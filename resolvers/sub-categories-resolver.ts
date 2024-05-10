import httpStatus from "http-status";
import {
  getAllActiveSubCategories,
  getAllSubCategories,
  getSubCategoryById,
} from "../services/sub-categories-service";

const subCategoriesResolver = {
  Query: {
    subCategories: async () => {
      try {
        const subCategories = await getAllSubCategories();
        const formattedSubCategories = subCategories.map((subCategory) => ({
          id: subCategory.sub_id,
          name: subCategory.sub_name,
          description: subCategory.sub_description,
          image: subCategory.sub_image,
          status: subCategory.sub_status,
          short_code: subCategory.sub_short_code,
          remarks: subCategory.sub_remarks,
          category_id: subCategory.sub_category_id,
          created_at: subCategory.sub_created_at,
          updated_at: subCategory.sub_updated_at,
          created_by: subCategory.sub_created_by,
          updated_by: subCategory.sub_updated_by,

          category: [
            {
              id: subCategory.cat_id,
              name: subCategory.cat_name,
              description: subCategory.cat_description,
              image: subCategory.cat_image,
              status: subCategory.cat_status,
              short_code: subCategory.sub_short_code,
              remarks: subCategory.cat_remarks,
              created_at: subCategory.cat_created_at,
              updated_at: subCategory.cat_updated_at,
              created_by: subCategory.cat_created_by,
              updated_by: subCategory.cat_updated_by,
            },
          ],
        }));
        return {
          message: "Categories Fetched Successfully.",
          status: httpStatus.OK,
          data: formattedSubCategories,
        };
      } catch (error) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Some Error Occurred. Please Try After Some Time.",
          data: [],
        };
      }
    },
    subCategory: async (
      _: any,
      { subCategoryId }: { subCategoryId: string }
    ) => {
      try {
        const subCategory = await getSubCategoryById(parseInt(subCategoryId));
        return {
          message: "Sub-Category Fetched Successfully.",
          status: httpStatus.OK,
          data: subCategory,
        };
      } catch (error) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Some Error Occurred. Please Try After Some Time.",
          data: [],
        };
      }
    },
    activeSubCategories: async () => {
      try {
        const subCategories = await getAllActiveSubCategories();
        return {
          message: "Categories Fetched Successfully.",
          status: httpStatus.OK,
          data: subCategories,
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

export default subCategoriesResolver;
