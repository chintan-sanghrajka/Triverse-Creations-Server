import express from "express";
import {
  addCategory,
  updateCategory,
} from "../controllers/categories-controller";

const categoriesRouter = express.Router();

categoriesRouter.post("/category/add-category", addCategory);

categoriesRouter.patch("/category/update-category", updateCategory);

export default categoriesRouter;
