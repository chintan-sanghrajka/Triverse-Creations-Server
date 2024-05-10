import jwt, { JwtPayload } from "jsonwebtoken";
import { QueryResult } from "pg";
import database from "../config/db-setup";

export const generateAccessRefreshToken = async (
  userId: number,
  email: string,
  firstname: string
) => {
  try {
    let existingTokens = await getTokensByUserId(userId);
    if (existingTokens.length !== 0) {
      let deleteRes = await deleteTokensByUserId(userId);
      if (deleteRes.error) {
        return {
          error: true,
          tokens: {},
        };
      }
    }
    let accessToken = jwt.sign(
      {
        userId: userId,
        email: email,
        firstname: firstname,
      },
      process.env.SECRET_KEY!,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    let refreshToken = jwt.sign(
      {
        userId: userId,
        email: email,
        firstname: firstname,
      },
      process.env.SECRET_KEY!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
    const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;

    let accessTokenExpiryDate: Date | undefined;
    if (decodedAccessToken && decodedAccessToken.exp) {
      accessTokenExpiryDate = new Date(decodedAccessToken.exp * 1000);
    }

    let refreshTokenExpiryDate: Date | undefined;
    if (decodedRefreshToken && decodedRefreshToken.exp) {
      refreshTokenExpiryDate = new Date(decodedRefreshToken.exp * 1000);
    }

    if (
      accessToken &&
      refreshToken &&
      accessTokenExpiryDate &&
      refreshTokenExpiryDate
    ) {
      const query =
        "insert into tokens (user_id, access_token, refresh_token, access_token_expires_at, refresh_token_expires_at) values ($1, $2, $3, $4, $5)";
      const values: (string | Date | number)[] = [
        userId,
        accessToken,
        refreshToken,
        accessTokenExpiryDate,
        refreshTokenExpiryDate,
      ];
      const { rows }: QueryResult = await database.query(query, values);
      if (rows.length === 0) {
        return {
          error: false,
          tokens: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        };
      } else {
        return {
          error: true,
          tokens: {},
        };
      }
    } else {
      return {
        error: true,
        tokens: {},
      };
    }
  } catch (error) {
    return {
      error: true,
      tokens: {},
    };
  }
};

export const generateAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  try {
    const query: string = "select * from tokens where refresh_token = $1";
    const values: string[] = [refreshToken];
    const { rows }: QueryResult = await database.query(query, values);
    if (rows.length === 0) {
      return {
        error: true,
        tokens: {},
      };
    } else {
      let decodeToken = jwt.verify(refreshToken, process.env.SECRET_KEY!);
      if (decodeToken) {
        const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
        let accessToken = jwt.sign(
          {
            userId: decodedRefreshToken.userId,
            email: decodedRefreshToken.email,
            firstname: decodedRefreshToken.firstname,
          },
          process.env.SECRET_KEY!,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
        const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
        let accessTokenExpiryDate: Date | undefined;
        if (decodedAccessToken && decodedAccessToken.exp) {
          accessTokenExpiryDate = new Date(decodedAccessToken.exp * 1000);
        }

        if (accessToken && accessTokenExpiryDate) {
          let query: string = `update tokens set access_token = $1, access_token_expires_at = $2 where refresh_token = ${refreshToken}`;
          let values: (string | Date)[] = [accessToken, accessTokenExpiryDate];
          const rows: QueryResult = await database.query(query, values);
          if (rows.rowCount !== 0) {
            return {
              error: false,
              tokens: {
                accessToken: accessToken,
                refreshToken: refreshToken,
              },
            };
          } else {
            return {
              error: true,
              tokens: {},
            };
          }
        } else {
          return {
            error: true,
            tokens: {},
          };
        }
      } else {
        return {
          error: true,
          tokens: {},
        };
      }
    }
  } catch (error) {
    return {
      error: true,
      tokens: {},
    };
  }
};

export const deleteTokensByUserId = async (userId: number) => {
  try {
    let query = `delete from tokens where user_id = ${userId}`;
    let rows = await database.query(query);
    if (rows.rowCount !== 0) {
      return {
        error: false,
      };
    } else {
      return { error: true };
    }
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const getTokensByUserId = async (userId: number) => {
  try {
    const query: string = "select * from tokens where user_id = $1";
    const values: number[] = [userId];
    const { rows }: QueryResult = await database.query(query, values);
    return rows;
  } catch (error) {
    return [];
  }
};
