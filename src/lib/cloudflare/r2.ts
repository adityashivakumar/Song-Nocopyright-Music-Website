import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export const r2 = new S3Client({ region: "auto", endpoint: process.env.R2_ENDPOINT, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "" } });
const Bucket = process.env.R2_BUCKET_NAME!;
export const presignUpload = (Key: string, ContentType: string) => getSignedUrl(r2, new PutObjectCommand({ Bucket, Key, ContentType }), { expiresIn: 600 });
export const presignDownload = (Key: string, filename: string) => getSignedUrl(r2, new GetObjectCommand({ Bucket, Key, ResponseContentDisposition: `attachment; filename="${filename.replace(/[^\w.\- ]/g, "")}"` }), { expiresIn: 300 });
export const headObject = (Key: string) => r2.send(new HeadObjectCommand({ Bucket, Key }));
export const publicUrl = (key?: string | null) => (key ? `${process.env.R2_PUBLIC_URL}/${key}` : "");
