import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const description = formData.get("description") || "";
    const item = formData.get("item") || "";
    const condition = formData.get("condition") || "";
    const price = formData.get("price") || "";
    const formType = formData.get("formType") || "Unknown Form";

    // Extract contact preferences
    const contactPreferences = [];
    if (formData.get("telephone") === "true")
      contactPreferences.push("Telephone");
    if (formData.get("sms") === "true") contactPreferences.push("SMS");
    if (formData.get("emailContact") === "true")
      contactPreferences.push("Email");
    if (formData.get("whatsapp") === "true")
      contactPreferences.push("WhatsApp");

    // Handle image uploads
    const imageUrls = [];
    const files = formData.getAll("images");

    if (files && files.length > 0 && files[0] instanceof Blob) {
      for (const file of files) {
        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = `data:${file.type};base64,${buffer.toString(
          "base64"
        )}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64String, {
          folder: "finerlux-uploads",
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "info@finerlux.com",
      subject: `${formType} from ${name}`,
      html: `
        <h1>New ${formType} Form Submission</h1>
        <h2>Contact Information:</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        ${item ? `<p><strong>Item:</strong> ${item}</p>` : ""}
        ${condition ? `<p><strong>Condition:</strong> ${condition}</p>` : ""}
        ${price ? `<p><strong>Price:</strong> ${price}</p>` : ""}
        ${
          description
            ? `<p><strong>Description:</strong> ${description}</p>`
            : ""
        }
        
        <p><strong>Contact Preferences:</strong> ${
          contactPreferences.join(", ") || "None selected"
        }</p>
        
        ${
          imageUrls.length > 0
            ? `
          <h2>Uploaded Images:</h2>
          <div>
            ${imageUrls
              .map(
                (url) =>
                  `<img src="${url}" alt="Uploaded image" style="max-width: 300px; margin: 10px 0;" />`
              )
              .join("")}
          </div>
        `
            : ""
        }
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { success: false, message: "Error submitting form" },
      { status: 500 }
    );
  }
}
