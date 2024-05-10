import express from "express";
import {
  addUser,
  generateAccessToken,
  generateOTP,
  loginPassword,
  logout,
  verifyOTP,
} from "../controllers/auth-controller";

const authRouter = express.Router();

authRouter.post("/auth/add-user", addUser);

authRouter.post("/auth/login-password", loginPassword);

authRouter.post("/auth/generate-otp", generateOTP);

authRouter.post("/auth/verify-otp", verifyOTP);

authRouter.post("/auth/generate-access-token", generateAccessToken);

authRouter.post("/auth/logout", logout);

export default authRouter;
