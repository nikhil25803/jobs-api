const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config()
const uuid = require("uuid").v4;


exports.s3Uploadv3 = async (file) => {
    const s3client = new S3Client();

    const key_name = `uploads/${uuid()}-${file.originalname}`

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key_name,
        Body: file.buffer,
    };


    const result = await s3client.send(new PutObjectCommand(params))
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key_name}`
    return fileUrl
};