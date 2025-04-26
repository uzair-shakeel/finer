import toast from "react-hot-toast";

export const uploadMediaFiles = async (files) => {
  if (!files || files.length === 0) return [];

  // Filter out GIF files
  const validFiles = files.filter((file) => file.type !== "image/gif");

  // If some files were filtered out, notify the user with toast
  if (validFiles.length < files.length) {
    toast.error("GIF files were excluded from upload");
  }

  if (validFiles.length === 0) {
    toast.error("No valid files to upload");
    return [];
  }

  const formData = new FormData();

  for (let i = 0; i < validFiles.length; i++) {
    formData.append("images", validFiles[i]);
  }

  const uploadPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        // Handle detailed error information
        if (data.errors && data.errors.length > 0) {
          // Format error messages from the server
          const errorMessages = data.errors.map(err => 
            `${err.fileName}: ${err.reason}`
          ).join(', ');
          throw new Error(data.message + ': ' + errorMessages);
        } else {
          throw new Error(data.message || "Failed to upload files");
        }
      }

      // Handle partial success case
      if (data.partialSuccess) {
        toast.warning(
          data.message || "Some files were uploaded successfully, but others failed"
        );
        
        // Show specific errors
        if (data.errors) {
          data.errors.forEach(err => {
            toast.error(`${err.fileName}: ${err.reason}`);
          });
        }
      }

      resolve(data.imageUrls);
      return data.imageUrls;
    } catch (error) {
      console.error("Error uploading files:", error);
      reject(error);
      throw error;
    }
  });

  // Show loading toast during upload
  toast.promise(uploadPromise, {
    loading: "Uploading files...",
    success: (urls) => `Successfully uploaded ${urls.length} file(s)`,
    error: (err) => `${err.message || "Unknown error"}`,
  });

  return uploadPromise;
};

// For backward compatibility
export const uploadImages = uploadMediaFiles;
