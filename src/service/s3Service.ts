import { Request, Response } from "express";

import AWS from "aws-sdk";
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const getPresignedUrl = async (req:Request, res:Response) => {
  try {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${fileName}`,
      Expires: 60, // URL expires in 60 seconds
      ContentType: fileType,
      ACL: "public-read",
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    res.json({ url, key: params.Key });

  } catch (error) {
    console.error("Error generating presigned URL", error);
    res.status(500).json({ error: "Failed to generate URL" });
  }
};
