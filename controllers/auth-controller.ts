import { Request, Response } from "express";
import {
  APIResponse,
  APIResponse404,
  APIResponse500,
} from "../helpers/res-helper";
import {
  addUserActivityService,
  createUser,
  getUserByEmail,
  updateUserByEmail,
} from "../services/user-service";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import {
  deleteTokensByUserId,
  generateAccessRefreshToken,
  generateAccessTokenWithRefreshToken,
} from "../services/tokens-service";

export const addUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, contact, countryCode } =
      req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser.length !== 0) {
      await addUserActivityService(
        existingUser[0].id,
        existingUser[0].email,
        "Sign Up Failed. User Already Exists."
      );
      return APIResponse(
        res,
        httpStatus.CONFLICT,
        "Email Already Exists.",
        existingUser
      );
    } else {
      const encryptedPassword = bcrypt.hashSync(password, 10);
      const newUser = await createUser(
        firstname,
        lastname,
        email,
        contact,
        countryCode,
        encryptedPassword
      );
      return APIResponse(res, newUser.status, newUser.message);
    }
  } catch (error) {
    return APIResponse500(res);
  }
};

export const loginPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (user.length === 0) {
      await addUserActivityService(0, email, "Login Failed. User Not Found.");
      return APIResponse404(res, "User Not Found.");
    } else {
      if (await bcrypt.compare(password, user![0].password)) {
        let tokens = await generateAccessRefreshToken(
          user[0].id,
          user[0].email,
          user[0].firstname
        );
        if (tokens.error) {
          await addUserActivityService(
            user[0].id,
            email,
            "Failed To Generate OTP."
          );
          return APIResponse500(res);
        } else {
          let data = { user: user, tokens: tokens.tokens };
          await addUserActivityService(
            user[0].id,
            user[0].email,
            "User Loggged In Successfully With Password."
          );
          return APIResponse(
            res,
            httpStatus.OK,
            "User Logged In Successfully.",
            data
          );
        }
      } else {
        await addUserActivityService(
          user[0].id,
          user[0].email,
          "User Loggged Failed. Incorrect Password."
        );
        return APIResponse(res, httpStatus.FORBIDDEN, "Incorrect Password.");
      }
    }
  } catch (error) {
    return APIResponse500(res);
  }
};

export const generateOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (user.length === 0) {
      await addUserActivityService(
        0,
        email,
        "Generate OTP Failed. User Not Found."
      );
      return APIResponse404(res, "User Not Found.");
    } else {
      const otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      const serviceResponse = await updateUserByEmail(email, ["otp"], [otp]);
      if (!serviceResponse.error) {
        await addUserActivityService(
          user[0].id,
          user[0].email,
          "OTP Generate Successfully."
        );
        setTimeout(async () => {
          await updateUserByEmail(email, ["otp"], [0]);
        }, 600000);
      } else {
        await addUserActivityService(
          user[0].id,
          user[0].email,
          "Failed To Generate OTP."
        );
      }
      return APIResponse(res, serviceResponse.status, serviceResponse?.message);
    }
  } catch (error) {
    return APIResponse500(res);
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, generateTokens } = req.body;
    let user = await getUserByEmail(email);
    if (user.length !== 0) {
      if (user[0].otp === otp) {
        if (generateTokens) {
          let tokens = await generateAccessRefreshToken(
            user[0].id,
            user[0].email,
            user[0].firstname
          );
          if (tokens.error) {
            await addUserActivityService(
              user[0].id,
              user[0].email,
              "Failed To Generate Tokens"
            );
            return APIResponse500(res);
          } else {
            let data = { user: user, tokens: tokens.tokens };
            await addUserActivityService(
              user[0].id,
              user[0].email,
              "User Logged In Successfully With OTP."
            );
            return APIResponse(
              res,
              httpStatus.OK,
              "User Logged In Successfully.",
              data
            );
          }
        } else {
          await addUserActivityService(
            user[0].id,
            user[0].email,
            "OTP Verified Successfully."
          );
          return APIResponse(
            res,
            httpStatus.OK,
            "OTP Verified Successfully.",
            user
          );
        }
      } else {
        await addUserActivityService(
          user[0].id,
          user[0].email,
          "Login Failed. Incorrect OTP"
        );
        return APIResponse(res, httpStatus.FORBIDDEN, "Incorrect OTP.");
      }
    } else {
      await addUserActivityService(
        0,
        email,
        "Verify OTP Failed. User Not Found."
      );
      return APIResponse404(res, "User Not Found.");
    }
  } catch (error) {
    return APIResponse500(res);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser.length === 0) {
      await addUserActivityService(
        0,
        email,
        "Reset Password Failed. User Not Found."
      );
      return APIResponse404(res, "User Not Found");
    } else {
      const encryptedPassword = bcrypt.hashSync(newPassword, 10);
      const serviceResponse = await updateUserByEmail(
        email,
        ["password"],
        [encryptedPassword]
      );
      if (serviceResponse.error) {
        await addUserActivityService(
          existingUser[0].id,
          existingUser[0].email,
          "Failed To Reset Password."
        );
      } else {
        await addUserActivityService(
          existingUser[0].id,
          existingUser[0].email,
          "Password Changed Successfully."
        );
      }
      return APIResponse(res, serviceResponse.status, serviceResponse?.message);
    }
  } catch (error) {
    return APIResponse500(res);
  }
};

export const generateAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    let tokens = await generateAccessTokenWithRefreshToken(refreshToken);
    if (tokens.error) {
      return APIResponse(res, httpStatus.UNAUTHORIZED, "Unauthorized User.");
    } else {
      return APIResponse(
        res,
        httpStatus.OK,
        "Access Token Generated Successfully.",
        tokens.tokens
      );
    }
  } catch (error) {
    return APIResponse500(res);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    let rows = await deleteTokensByUserId(userId);
    if (rows.error) {
      return APIResponse500(res);
    } else {
      return APIResponse(res, httpStatus.OK, "User Logged Out Successfully.");
    }
  } catch (error) {
    return APIResponse500(res);
  }
};
