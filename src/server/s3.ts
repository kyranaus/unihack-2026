// src/server/s3.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

function getConfig() {
  return {
    region: process.env.AWS_REGION ?? "ap-southeast-2",
    bucket: process.env.S3_BUCKET ?? "beesafe-recordings",
  }
}

let _s3: S3Client | null = null
function getS3() {
  if (!_s3) {
    _s3 = new S3Client({
      region: getConfig().region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }
  return _s3
}

export function videoKey(sessionId: string, camera: string) {
  return `drives/${sessionId}/${camera}.webm`
}

export async function getUploadUrl(sessionId: string, camera: string, contentType: string) {
  const { bucket } = getConfig()
  const key = videoKey(sessionId, camera)
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
  const url = await getSignedUrl(getS3(), command, { expiresIn: 600 })
  return { url, key }
}

export async function getDownloadUrl(key: string) {
  const { bucket } = getConfig()
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(getS3(), command, { expiresIn: 3600 })
}

export async function initiateMultipartUpload(key: string, contentType: string) {
  const { bucket } = getConfig()
  const { UploadId } = await getS3().send(
    new CreateMultipartUploadCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
  )
  if (!UploadId) throw new Error("Failed to initiate multipart upload")
  return UploadId
}

export async function getPartUploadUrl(key: string, uploadId: string, partNumber: number) {
  const { bucket } = getConfig()
  const command = new UploadPartCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  })
  return getSignedUrl(getS3(), command, { expiresIn: 600 })
}

export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[],
) {
  const { bucket } = getConfig()
  await getS3().send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    }),
  )
}

export async function abortMultipartUpload(key: string, uploadId: string) {
  const { bucket } = getConfig()
  await getS3().send(
    new AbortMultipartUploadCommand({ Bucket: bucket, Key: key, UploadId: uploadId }),
  ).catch(() => {})
}
