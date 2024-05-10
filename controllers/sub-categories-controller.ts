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
  createSubCategory,
  findSubCategoryByShortCode,
  getSubCategoryById,
  updateSubCategoryByID,
} from "../services/sub-categories-service";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/sub-categories")) {
      cb(null, "./uploads/sub-categories");
    } else {
      fs.mkdirSync("./uploads/sub-categories", { recursive: true });
      cb(null, "./uploads/sub-categories");
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

export const addSubCategory = async (req: Request, res: Response) => {
  try {
    const uploadFile = upload.single("image");
    uploadFile(req, res, async function (error: any) {
      if (error) {
        return APIResponse(res, httpStatus.BAD_REQUEST, error.message);
      }

      let { name, description, shortCode, remarks, category_id } = req.body;
      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      let existingSubCategory = await findSubCategoryByShortCode(shortCode);
      if (existingSubCategory.length !== 0) {
        if (image) {
          fs.unlinkSync(`./uploads/sub-categories/${image}`);
        }
        return APIResponse(
          res,
          httpStatus.CONFLICT,
          "Sub-Category Already Exists."
        );
      }

      const subCategory = await createSubCategory(
        name,
        description,
        shortCode,
        remarks,
        image,
        category_id
      );
      if (subCategory.error) {
        if (image) {
          fs.unlinkSync(`./uploads/sub-categories/${image}`);
        }
      }
      return APIResponse(res, subCategory.status, subCategory.message);
    });
  } catch (error) {
    return APIResponse500(res);
  }
};

export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const uploadFile = upload.single("image");
    uploadFile(req, res, async function (error: any) {
      if (error) return APIResponse(res, httpStatus.BAD_REQUEST, error.message);

      let { name, description, remarks, id, status } = req.body;

      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      let oldSubCategory = await getSubCategoryById(id);
      if (oldSubCategory.length === 0) {
        if (image) {
          fs.unlinkSync(`./uploads/sub-categories/${image}`);
        }
        return APIResponse404(res, "Sub-Category Not Found.");
      } else {
        if (
          fs.existsSync(`./uploads/sub-categories/${oldSubCategory[0].image}`)
        ) {
          fs.unlinkSync(`./uploads/sub-categories/${oldSubCategory[0].image}`);
        }
      }

      const subCategory = await updateSubCategoryByID(
        id,
        ["name", "description", "remarks", "image", "updated_at", "status"],
        [name, description, remarks, image, new Date(), status]
      );
      if (subCategory.error) {
        if (image) {
          fs.unlinkSync(`./uploads/sub-categories/${image}`);
        }
      }
      return APIResponse(res, subCategory.status, subCategory.message);
    });
  } catch (error) {
    return APIResponse500(res);
  }
};
