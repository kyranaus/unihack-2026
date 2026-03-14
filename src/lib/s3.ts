// src/lib/s3.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION ?? "ap-southeast-2";
const BUCKET = process.env.AWS_S3_BUCKET ?? "";

function createClient() {
	return new S3Client({
		region: REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
		},
	});
}

export async function generatePresignedUploadUrl(
	key: string,
	mimeType: string,
	expiresIn = 300,
): Promise<{ uploadUrl: string; videoUrl: string }> {
	const client = createClient();
	const command = new PutObjectCommand({
		Bucket: BUCKET,
		Key: key,
		ContentType: mimeType,
	});
	const uploadUrl = await getSignedUrl(client, command, { expiresIn });
	const videoUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
	return { uploadUrl, videoUrl };
}
