import { QueryResult } from "pg";
import database from "../config/db-setup";
import httpStatus from "http-status";
import { sendUserVerificationEmail } from "./email-service";

export const addUserActivityService = async (
  id: number,
  email: string,
  activity: string
) => {
  try {
    let values: (string | number)[] = [id, email, activity];
    let query: string =
      "insert into user_logs (user_id, email, activity) values ($1, $2, $3);";
    const { rows }: QueryResult = await database.query(query, values);
  } catch (error) {}
};

export const getUserByEmail = async (email: string) => {
  try {
    const query: string =
      "select * from users where email = $1 and active = true";
    const values: string[] = [email];
    const { rows }: QueryResult = await database.query(query, values);
    return rows;
  } catch (error) {
    return [];
  }
};

export const createUser = async (
  firstname: string,
  lastname: string,
  email: string,
  contact: number,
  countryCode: string,
  password: string
) => {
  try {
    const query: string =
      "insert into users (firstname, lastname, email, contact, country_code, password) values ($1, $2, $3, $4, $5, $6);";
    const values: (string | number)[] = [
      firstname,
      lastname,
      email,
      contact,
      countryCode,
      password,
    ];
    const { rows }: QueryResult = await database.query(query, values);
    if (rows.length === 0) {
      const newUserData = await getUserByEmail(email);
      if (newUserData.length !== 0) {
        await addUserActivityService(
          newUserData[0].id,
          newUserData[0].email,
          "User Created Successfully."
        );
      }
      return {
        error: false,
        status: httpStatus.CREATED,
        message: "User Added Successfully.",
      };
    } else {
      await addUserActivityService(0, email, "Failed To Create User.");
      return {
        error: true,
        status: httpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  } catch (error) {
    return {
      error: true,
      status: httpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

export const updateUserByEmail = async (
  email: string,
  columns: string[],
  values: (string | number)[]
) => {
  try {
    if (columns.length === 0) {
      return {
        error: true,
        status: httpStatus.BAD_REQUEST,
        message: "Insufficient Data.",
      };
    }
    let updateString = columns
      .map((col, index) => {
        return `${col} = $${index + 1}`;
      })
      .join(", ");
    const query: string = `update users set ${updateString} where email='${email}';`;
    let user = await database.query(query, values);
    if (user.rowCount !== 0) {
      return {
        error: false,
        status: httpStatus.OK,
        message: "User Updated Successfully.",
      };
    } else {
      return {
        error: true,
        status: httpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  } catch (error) {
    return { error: true, status: httpStatus.INTERNAL_SERVER_ERROR };
  }
};

export const getAllUsers = async () => {
  try {
    const query = "select * from users";
    const { rows }: QueryResult = await database.query(query);
    return rows;
  } catch (error) {
    return [];
  }
};

export const getUserById = async (userId: number) => {
  try {
    const query = "select * from users where id = $1";
    const values: number[] = [userId];
    const { rows } = await database.query(query, values);
    return rows;
  } catch (error) {
    return [];
  }
};
