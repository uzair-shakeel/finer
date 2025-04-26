import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Please select at least one file to upload",
      });
    }

    const fileUrls = [];
    const errors = [];

    for (const file of files) {
      if (file instanceof Blob) {
        // Reject GIF files
        if (file.type === "image/gif") {
          errors.push({
            fileName: file.name || "Unknown file",
            reason: "GIF files are not allowed",
          });
          continue;
        }

        // Allow images and videos
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) {
          errors.push({
            fileName: file.name || "Unknown file",
            reason: "Only image and video files are allowed",
          });
          continue;
        }

        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64String = `data:${file.type};base64,${buffer.toString(
            "base64"
          )}`;

          const resourceType = file.type.startsWith("video/")
            ? "video"
            : "image";

          const uploadResult = await cloudinary.uploader.upload(base64String, {
            folder: "finerlux-uploads",
            resource_type: resourceType,
          });

          fileUrls.push(uploadResult.secure_url);
        } catch (uploadError) {
          errors.push({
            fileName: file.name || "Unknown file",
            reason: "Failed to upload to cloud storage",
          });
        }
      }
    }

    // If no files were uploaded successfully but we had errors
    if (fileUrls.length === 0 && errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload files",
          errors: errors,
        },
        { status: 400 }
      );
    }

    // If some files were uploaded but we had some errors
    if (errors.length > 0) {
      return NextResponse.json({
        success: true,
        imageUrls: fileUrls,
        partialSuccess: true,
        message: "Some files were uploaded successfully, but others failed",
        errors: errors,
      });
    }

    // All files uploaded successfully
    return NextResponse.json({
      success: true,
      imageUrls: fileUrls,
      message: "All files uploaded successfully",
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing your upload request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
