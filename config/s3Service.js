const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config()
const uuid = require("uuid").v4;

// exports.S3Uploadv2 = async (file) => {
//     const s3 = new S3()

//     const param = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `uploads/${uuid()}-${file.originalname}`,
//         Body: file.buffer
//     }
//     const result = await s3.upload(param).promise();

//     return result;

// }

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