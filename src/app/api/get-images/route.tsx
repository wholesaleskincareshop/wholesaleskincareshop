import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API Route handler
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");

  if (!folder) {
    return NextResponse.json(
      { error: "Folder query parameter is missing" },
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: folder, // Use the folder provided in the query param
      max_results: 100,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images from Cloudinary" },
      { status: 500 }
    );
  }
}
