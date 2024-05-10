import express from "express";
import {
  addSubCategory,
  updateSubCategory,
} from "../controllers/sub-categories-controller";

const subCategoriesRouter = express.Router();

subCategoriesRouter.post("/sub-category/add-sub-category", addSubCategory);

subCategoriesRouter.patch(
  "/sub-category/update-sub-category",
  updateSubCategory
);

export default subCategoriesRouter;
