"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUrl = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
require("dotenv").config();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const getPresignedUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName, fileType } = req.body;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${fileName}`,
            Expires: 60, // URL expires in 60 seconds
            ContentType: fileType,
            ACL: "public-read",
        };
        const url = yield s3.getSignedUrlPromise("putObject", params);
        res.json({ url, key: params.Key });
    }
    catch (error) {
        console.error("Error generating presigned URL", error);
        res.status(500).json({ error: "Failed to generate URL" });
    }
});
exports.getPresignedUrl = getPresignedUrl;
