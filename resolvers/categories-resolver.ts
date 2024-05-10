import httpStatus from "http-status";
import {
  getAllActiveCategories,
  getAllCategories,
  getCategoryById,
} from "../services/categories-service";

const categoriesResolver = {
  Query: {
    categories: async () => {
      try {
        const categories = await getAllCategories();
        return {
          message: "Categories Fetched Successfully.",
          status: httpStatus.OK,
          data: categories,
        };
      } catch (error) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Some Error Occurred. Please Try After Some Time.",
          data: [],
        };
      }
    },
    category: async (_: any, { categoryId }: { categoryId: string }) => {
      try {
        const category = await getCategoryById(parseInt(categoryId));
        return {
          message: "Category Fetched Successfully.",
          status: httpStatus.OK,
          data: category,
        };
      } catch (error) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Some Error Occurred. Please Try After Some Time.",
          data: [],
        };
      }
    },
    activeCategories: async () => {
      try {
        const categories = await getAllActiveCategories();
        return {
          message: "Categories Fetched Successfully.",
          status: httpStatus.OK,
          data: categories,
        };
      } catch (error) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Some Error Occurred. Please Try After Some Time.",
          data: [],
        };
      }
    },
  },
};

export default categoriesResolver;
