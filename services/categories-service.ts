import { QueryResult } from "pg";
import database from "../config/db-setup";
import httpStatus from "http-status";

export const getAllCategories = async () => {
  try {
    const query = "select * from categories";
    const { rows }: QueryResult = await database.query(query);
    return rows;
  } catch (error) {
    return [];
  }
};

export const getCategoryById = async (categoryId: number) => {
  try {
    const query = "select * from categories where id = $1";
    const values: number[] = [categoryId];
    const { rows } = await database.query(query, values);
    return rows;
  } catch (error) {
    return [];
  }
};

export const findCategoryByShortCode = async (shortCode: string) => {
  try {
    const query = "select * from categories where short_code = $1";
    const values: string[] = [shortCode];
    const { rows } = await database.query(query, values);
    return rows;
  } catch (error) {
    return [];
  }
};

export const createCategory = async (
  name: string,
  description: string,
  shortCode: string,
  remarks: string,
  image: string
) => {
  try {
    const query: string =
      "insert into categories (name, description, short_code, remarks, image) values ($1, $2, $3, $4, $5);";
    const values: (string | number)[] = [
      name,
      description,
      shortCode,
      remarks,
      image,
    ];
    const { rows }: QueryResult = await database.query(query, values);
    if (rows.length === 0) {
      return {
        error: false,
        status: httpStatus.CREATED,
        message: "Category Added Successfully.",
      };
    } else {
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

export const updateCategoryByID = async (
  id: number,
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
    const query: string = `update categories set ${updateString} where id='${id}';`;
    let category = await database.query(query, values);
    if (category.rowCount !== 0) {
      return {
        error: false,
        status: httpStatus.OK,
        message: "Category Updated Successfully.",
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

export const getAllActiveCategories = async () => {
  try {
    const query = "select * from categories where status = true";
    const { rows }: QueryResult = await database.query(query);
    return rows;
  } catch (error) {
    return [];
  }
};
