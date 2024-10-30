import db from "@/lib/db";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { ok } from "assert";

// Define the uploads directory
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
// Ensure uploads directory exists
await fs.mkdir(UPLOAD_DIR, { recursive: true });

// To fetch all artworks (populate with artist)
export const GET = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.execute(
      `SELECT artworks.*, users.name AS artist_name 
       FROM artworks 
       JOIN users ON artworks.artist_id = users.id`
    );
    return NextResponse.json({ artworks: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};



export const POST = async (req, res) => {
  const {
    title,
    description,
    price,
    type,
    artistId,
    dimensions,
    medium,
    img,
    year,
  } = await req.json();

  if (!img) {
    return NextResponse.json(
      { error: "Image file is required" },
      { status: 400 }
    );
  }

  const imageBuffer = Buffer.from(img, "base64");
  const filePath = path.join(
    process.cwd(),
    "public/uploads",
    `${Date.now()}-${title}.jpg`
  );

  await fs.writeFile(filePath, imageBuffer);

  const connection = await db.getConnection();

  try {
    // Insert artwork data into the database
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "INSERT INTO artworks (title, description, price, type, artist_id, dimensions, medium, image_url,year) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
      [
        title,
        description,
        price,
        type,
        artistId,
        dimensions,
        medium,
        `/uploads/${path.basename(filePath)}`,
        year,
      ]
    );
    await connection.commit();
    return NextResponse.json(
      { id: result.insertId, message: "Artwork submitted with image" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};

export const PUT = async (req, res) => {
  const {
    artworkId,
    title,
    description,
    price,
    type,
    dimensions,
    medium,
    year,
  } = await req.json();

  const imageFile = req.file; // Assuming `req.file` contains the new image file

  const connection = await db.getConnection();
  let imageUrl = null;

  try {
    await connection.beginTransaction();

    // If a new image is provided, save it and update imageUrl
    if (imageFile) {
      const imageFileName = `${nanoid()}_${imageFile.originalname}`;
      const imagePath = path.join(UPLOAD_DIR, imageFileName);
      imageUrl = `/uploads/${imageFileName}`;

      // Write the new image file
      await fs.writeFile(imagePath, imageFile.buffer);

      // Get the current image URL to delete the old file if needed
      const [currentArtwork] = await connection.execute(
        "SELECT image_url FROM artworks WHERE id = ?",
        [artworkId]
      );
      if (currentArtwork[0].image_url) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          currentArtwork[0].image_url
        );
        await fs
          .unlink(oldImagePath)
          .catch((error) => console.log("Old image not found:", error));
      }
    }

    // Update artwork with new details and image URL if provided
    const updateQuery = `
      UPDATE artworks 
      SET title = ?, description = ?, price = ?, type = ?, dimensions = ?, year = ? ,medium = ? 
          ${imageUrl ? ",image_url = ?" : ""} 
      WHERE id = ?`;
    const updateValues = [
      title,
      description,
      price,
      type,
      dimensions,
      year,
      medium,
    ];
    if (imageUrl) updateValues.push(imageUrl);
    updateValues.push(artworkId);

    await connection.execute(updateQuery, updateValues);
    await connection.commit();

    return NextResponse.json({ message: "Artwork updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};

// To delete an artwork
export const DELETE = async (req, res) => {
  const { artworkId } = await req.json();

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get the current image URL to delete the associated image file
    const [currentArtwork] = await connection.execute(
      "SELECT image_url FROM artworks WHERE id = ?",
      [artworkId]
    );

    if (currentArtwork.length === 0) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    const imageUrl = currentArtwork[0].image_url;
    const oldImagePath = path.join(process.cwd(), "public", imageUrl);

    // Delete the artwork from the database
    await connection.execute("DELETE FROM artworks WHERE id = ?", [artworkId]);

    await connection.commit();

    // Remove the image file from the filesystem if it exists
    await fs.unlink(oldImagePath).catch((error) => {
      console.log("Error deleting image file:", error);
    });

    return NextResponse.json(
      { message: "Artwork deleted", ok: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};
