import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 },
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "File type not supported",
        },
        { status: 400 },
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "File size exceeds the limit of 5MB",
        },
        { status: 400 },
      )
    }

    // Create a unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop() || "jpg"
    const filename = `${timestamp}-${randomId}.${fileExtension}`

    // Define the upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads")

    // Create the upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await writeFile(uploadDir, "")
    }

    // Get the file as a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write the file to the upload directory
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Construct the URL to access the uploaded file
    const fileUrl = `/uploads/${filename}`

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully!",
        data: {
          url: fileUrl,
          filename: filename,
          size: file.size,
          mimetype: file.type,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Image upload error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while uploading the image",
      },
      { status: 500 },
    )
  }
}
