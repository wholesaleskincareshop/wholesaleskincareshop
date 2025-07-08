import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { public_id } = body;

    if (!public_id) {
      return NextResponse.json(
        { error: "Missing required parameter - public_id" },
        { status: 400 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const api_secret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;
    const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

    // Generate the signature
    const signature = crypto
      .createHash("sha256")
      .update(`public_id=${public_id}&timestamp=${timestamp}${api_secret}`)
      .digest("hex");

    // Make the request to Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`;

    const cloudinaryResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_id,
        api_key,
        timestamp,
        signature,
      }),
    });

    const cloudinaryData = await cloudinaryResponse.json();

    if (cloudinaryData.result !== "ok") {
      return NextResponse.json(
        { error: "Failed to delete the image", details: cloudinaryData },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}
