import { QueryResult } from "pg";
import database from "../config/db-setup";
import httpStatus from "http-status";

export const getAllSubCategories = async () => {
  try {
    const query = `SELECT
      sub.id AS sub_id,
      sub.name AS sub_name,
      sub.description AS sub_description,
      sub.status AS sub_status,
      sub.image AS sub_image,
      sub.remarks AS sub_remarks,
      sub.created_at AS sub_created_at,
      sub.updated_at AS sub_updated_at,
      sub.created_by AS sub_created_by,
      sub.updated_by AS sub_updated_by,
      sub.category_id AS sub_category_id,
      sub.short_code AS sub_short_code,
      cat.id AS cat_id,
      cat.name AS cat_name,
      cat.description AS cat_description,
      cat.status AS cat_status,
      cat.image AS cat_image,
      cat.remarks AS cat_remarks,
      cat.created_at AS cat_created_at,
      cat.updated_at AS cat_updated_at,
      cat.created_by AS cat_created_by,
      cat.updated_by AS cat_updated_by,
      cat.short_code AS cat_short_code
  FROM
      sub_categories sub
  INNER JOIN
      categories cat ON sub.category_id = cat.id;`;
    const { rows }: QueryResult = await database.query(query);
    return rows;
  } catch (error) {
    return [];
  }
};

export const getSubCategoryById = async (subCategoryId: number) => {
  try {
    const query = "select * from sub_categories where id = $1";
    const values: number[] = [subCategoryId];
    const { rows } = await database.query(query, values);
    return rows;
  } catch (error) {
    return [];
  }
};

export const findSubCategoryByShortCode = async (shortCode: string) => {
  try {
    const query = "select * from sub_categories where short_code = $1";
    const values: string[] = [shortCode];
    const { rows } = await database.query(query, values);
    return rows;
  } catch (error) {
    return [];
  }
};

export const createSubCategory = async (
  name: string,
  description: string,
  shortCode: string,
  remarks: string,
  image: string,
  category_id: number
) => {
  try {
    const query: string =
      "insert into sub_categories (name, description, short_code, remarks, image, category_id) values ($1, $2, $3, $4, $5, $6);";
    const values: (string | number)[] = [
      name,
      description,
      shortCode,
      remarks,
      image,
      category_id,
    ];
    const { rows }: QueryResult = await database.query(query, values);
    if (rows.length === 0) {
      return {
        error: false,
        status: httpStatus.CREATED,
        message: "Sub-Category Added Successfully.",
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

export const updateSubCategoryByID = async (
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
    const query: string = `update sub_categories set ${updateString} where id='${id}';`;
    let category = await database.query(query, values);
    if (category.rowCount !== 0) {
      return {
        error: false,
        status: httpStatus.OK,
        message: "Sub-Category Updated Successfully.",
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

export const getAllActiveSubCategories = async () => {
  try {
    const query = "select * from sub_categories where status = true";
    const { rows }: QueryResult = await database.query(query);
    return rows;
  } catch (error) {
    return [];
  }
};
