import { put } from "@vercel/blob";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

// No Blob token configured yet → skip uploads rather than erroring out a
// submission over an optional attachment.
export async function uploadEnquiryPhotos(files: File[]): Promise<string[]> {
  const token = import.meta.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];

  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) continue;

    const blob = await put(`enquiries/${Date.now()}-${file.name}`, file, {
      access: "public",
      token,
    });
    urls.push(blob.url);
  }
  return urls;
}
