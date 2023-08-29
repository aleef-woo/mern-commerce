import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import express from "express";
const router = express.Router();

dotenv.config();

import asyncHandler from "../middlewares/asyncHandler.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

// create your client and specify region
const s3Client = new S3Client({ region: "ap-southeast-1" });

router.route("/").post(
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const key = `${req.user._id}/${uuidv4()}.${req.query.fileType.split('/').pop()}`;
    
    const bucketParams = {
      Bucket: process.env.AWS_RESOURCE_BUCKET,
      Key: key,
      ContentType: req.query.fileType,
    };

    const command = new PutObjectCommand(bucketParams);

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
