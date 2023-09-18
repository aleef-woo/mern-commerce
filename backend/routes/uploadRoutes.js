import express from "express";
const router = express.Router();

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { admin, protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// create your client and specify region
const s3Client = new S3Client({ region: process.env.AWS_REGION_BUCKET });

router.route("/").post(
  protect,
  admin,
  asyncHandler(async (req, res) => {
    let key = `${req.user._id}/${
      req.query.productName
    }/${uuidv4()}.${req.query.fileType.split("/").pop()}`;

    if (req.query.key) {
      key = req.query.key;
    }

    const bucketParams = {
      Bucket: process.env.AWS_RESOURCE_BUCKET,
      Key: key,
      ContentType: req.query.fileType,
    };

    let command;
    if (req.query.key) {
      command = new DeleteObjectCommand(bucketParams);
    } else {
      command = new PutObjectCommand(bucketParams);
    }

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    if (signedUrl) {
      res.status(201).json({
        key: key,
        url: signedUrl,
      });
    } else {
      res.status(401);
      throw new Error("Presigned error!");
    }
  })
);

export default router;
