import { Request, Response } from "express";
import {
  APIResponse,
  APIResponse404,
  APIResponse500,
} from "../helpers/res-helper";
import multer from "multer";
import fs from "fs";
import path from "path";
import httpStatus from "http-status";
import {
  createCategory,
  findCategoryByShortCode,
  getCategoryById,
  updateCategoryByID,
} from "../services/categories-service";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/categories")) {
      cb(null, "./uploads/categories");
    } else {
      fs.mkdirSync("./uploads/categories", { recursive: true });
      cb(null, "./uploads/categories");
    }
  },
  filename: function (req, file, cb) {
    const imgName = file.originalname;
    const imgArr = imgName.split(".");
    imgArr.pop();
    const imgExt = path.extname(imgName);
    const fname = imgArr.join(".") + "-" + Date.now() + imgExt;
    cb(null, fname);
  },
});

const upload = multer({ storage: storage });

export const addCategory = async (req: Request, res: Response) => {
  try {
    const uploadFile = upload.single("image");
    uploadFile(req, res, async function (error: any) {
      if (error) {
        return APIResponse(res, httpStatus.BAD_REQUEST, error.message);
      }

      let { name, description, shortCode, remarks } = req.body;
      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      let existingCategory = await findCategoryByShortCode(shortCode);
      if (existingCategory.length !== 0) {
        if (image) {
          fs.unlinkSync(`./uploads/categories/${image}`);
        }
        return APIResponse(
          res,
          httpStatus.CONFLICT,
          "Category Already Exists."
        );
      }

      const category = await createCategory(
        name,
        description,
        shortCode,
        remarks,
        image
      );
      if (category.error) {
        if (image) {
          fs.unlinkSync(`./uploads/categories/${image}`);
        }
      }
      return APIResponse(res, category.status, category.message);
    });
  } catch (error) {
    return APIResponse500(res);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const uploadFile = upload.single("image");
    uploadFile(req, res, async function (error: any) {
      if (error) return APIResponse(res, httpStatus.BAD_REQUEST, error.message);

      let { name, description, remarks, id, status } = req.body;

      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      let oldCategory = await getCategoryById(id);
      if (oldCategory.length === 0) {
        if (image) {
          fs.unlinkSync(`./uploads/categories/${image}`);
        }
        return APIResponse404(res, "Category Not Found.");
      } else {
        if (fs.existsSync(`./uploads/categories/${oldCategory[0].image}`)) {
          fs.unlinkSync(`./uploads/categories/${oldCategory[0].image}`);
        }
      }

      const category = await updateCategoryByID(
        id,
        ["name", "description", "remarks", "image", "updated_at", "status"],
        [name, description, remarks, image, new Date(), status]
      );
      if (category.error) {
        if (image) {
          fs.unlinkSync(`./uploads/categories/${image}`);
        }
      }
      return APIResponse(res, category.status, category.message);
    });
  } catch (error) {
    return APIResponse500(res);
  }
};
