import api from "./api";

/**
 * Upload a single image (WEB)
 * @param {File} file - File object from <input type="file" />
 * @param {string} folder - S3 folder name
 * @returns {Promise<string>} S3 URL
 */
export async function uploadImage(file, folder = "general") {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(`/files/upload/${folder}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // S3 URL
}

/**
 * Upload multiple images (WEB)
 * @param {File[]} files - Array of File objects
 * @param {string} folder - S3 folder name
 * @returns {Promise<string[]>} Array of S3 URLs
 */
export async function uploadMultipleImages(files = [], folder = "general") {
  if (!files.length) return [];

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await api.post(`/files/upload-multiple/${folder}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // array of URLs
}
