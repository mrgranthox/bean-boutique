import { supabase } from "./supabase/client";

export type ImageEntity = "products" | "profiles" | "events" | "users";

interface ImageData {
  path: string;
  publicUrl: string;
  filename: string;
}

/**
 * Upload an image for any entity
 */
export async function uploadImage(
  file: File,
  entity: ImageEntity,
  entityId: string
): Promise<{ data: ImageData | null; error?: any }> {
  try {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        data: null,
        error: new Error(
          `Invalid file type. Allowed: ${allowedTypes.join(", ")}`
        ),
      };
    }

    // Validate file size (10MB max)
    if (file.size > 10485760) {
      return {
        data: null,
        error: new Error("File size exceeds 10MB limit"),
      };
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const path = `${entity}/${entityId}/${filename}`;

    const { data, error } = await supabase.storage
      .from("bean_boutique_images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return { data: null, error };
    }

    const publicUrl = getImageUrl(path);
    return {
      data: { path, publicUrl, filename },
      error: null,
    };
  } catch (err) {
    console.error("Exception uploading image:", err);
    return { data: null, error: err };
  }
}

/**
 * Get public URL for an image
 */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage
    .from("bean_boutique_images")
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get all images for a specific entity
 */
export async function getEntityImages(
  entity: ImageEntity,
  entityId: string
): Promise<{ data: ImageData[] | null; error?: any }> {
  try {
    const { data, error } = await supabase.storage
      .from("bean_boutique_images")
      .list(`${entity}/${entityId}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Error fetching images:", error);
      return { data: null, error };
    }

    const images: ImageData[] = data
      .filter(
        (file: { name: string | string[] }) =>
          !file.name.includes(".emptyFolderPlaceholder")
      )
      .map((file: { name: any }) => ({
        path: `${entity}/${entityId}/${file.name}`,
        publicUrl: getImageUrl(`${entity}/${entityId}/${file.name}`),
        filename: file.name,
      }));

    return { data: images, error: null };
  } catch (err) {
    console.error("Exception fetching images:", err);
    return { data: null, error: err };
  }
}

/**
 * Update an image (replace old with new)
 */
export async function updateImage(
  file: File,
  entity: ImageEntity,
  entityId: string,
  oldPath?: string
): Promise<{ data: ImageData | null; error?: any }> {
  try {
    // Delete old image if path provided
    if (oldPath) {
      await deleteImage(oldPath);
    }

    // Upload new image
    return await uploadImage(file, entity, entityId);
  } catch (err) {
    console.error("Exception updating image:", err);
    return { data: null, error: err };
  }
}

/**
 * Delete a specific image by path
 */
export async function deleteImage(path: string): Promise<{ error?: any }> {
  try {
    const { error } = await supabase.storage
      .from("bean_boutique_images")
      .remove([path]);

    if (error) {
      console.error("Error deleting image:", error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error("Exception deleting image:", err);
    return { error: err };
  }
}

/**
 * Delete all images for a specific entity
 */
export async function deleteEntityImages(
  entity: ImageEntity,
  entityId: string
): Promise<{ error?: any }> {
  try {
    // Get all images first
    const { data: images, error: listError } = await getEntityImages(
      entity,
      entityId
    );

    if (listError || !images) {
      return { error: listError };
    }

    if (images.length === 0) {
      return { error: null };
    }

    // Delete all images
    const paths = images.map((img) => img.path);
    const { error } = await supabase.storage
      .from("bean_boutique_images")
      .remove(paths);

    if (error) {
      console.error("Error deleting entity images:", error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error("Exception deleting entity images:", err);
    return { error: err };
  }
}

/**
 * Replace primary image (useful for profiles, products with main image)
 */
export async function replacePrimaryImage(
  file: File,
  entity: ImageEntity,
  entityId: string,
  tableName: string,
  columnName: string
): Promise<{ data: ImageData | null; error?: any }> {
  try {
    // Get old image
    const { data: oldImages } = await getEntityImages(entity, entityId);
    const oldPath = oldImages?.[0]?.path;

    // Upload new image
    const { data: newImage, error: uploadError } = await uploadImage(
      file,
      entity,
      entityId
    );

    if (uploadError || !newImage) {
      return { data: null, error: uploadError };
    }

    // Update database
    const { error: dbError } = await supabase
      .from(tableName)
      .update({ [columnName]: newImage.publicUrl })
      .eq("id", entityId);

    if (dbError) {
      console.error("Error updating database:", dbError);
      return { data: null, error: dbError };
    }

    // Delete old image
    if (oldPath) {
      await deleteImage(oldPath);
    }

    return { data: newImage, error: null };
  } catch (err) {
    console.error("Exception replacing primary image:", err);
    return { data: null, error: err };
  }
}
