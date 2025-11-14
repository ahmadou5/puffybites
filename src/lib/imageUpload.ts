import { supabase } from "./supabase";

export interface ImageUploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload an image file to Supabase Storage and return the public URL
 * @param file - The image file to upload
 * @param bucket - The storage bucket name (default: 'dessert-images')
 * @returns Promise with the upload result
 */
export async function uploadImage(
  file: File,
  bucket: string = "desserts-images"
): Promise<ImageUploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        url: "",
        path: "",
        error: "Please select a valid image file (JPEG, PNG, WebP, etc.)",
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        url: "",
        path: "",
        error: "Image file must be less than 5MB",
      };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `desserts/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        url: "",
        path: "",
        error: `Upload failed: ${error.message}`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      error: undefined,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return {
      url: "",
      path: "",
      error: "An unexpected error occurred during upload",
    };
  }
}

/**
 * Delete an image from Supabase Storage
 * @param filePath - The path of the file to delete
 * @param bucket - The storage bucket name (default: 'dessert-images')
 * @returns Promise indicating success or failure
 */
export async function deleteImage(
  filePath: string,
  bucket: string = "desserts-images"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        error: `Delete failed: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Image delete error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during deletion",
    };
  }
}

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "Please select a valid image file",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image file must be less than 5MB",
    };
  }

  // Check for supported formats
  const supportedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!supportedFormats.includes(file.type)) {
    return {
      valid: false,
      error: "Please use JPEG, PNG, WebP, or GIF format",
    };
  }

  return { valid: true };
}
