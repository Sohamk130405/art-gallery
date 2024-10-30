import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET route to fetch pending artworks
export const GET = async (req) => {
  const connection = await db.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT artworks.*, users.name AS artist_name 
       FROM artworks 
       JOIN users ON artworks.artist_id = users.id 
       WHERE artworks.status = ?`,
      ["pending"]
    );


    return NextResponse.json({ artworks: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching artworks:", error); // Log the error
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};

// PATCH route to approve or reject an artwork
export const PATCH = async (req) => {
  const { artworkId, action } = await req.json();
  const status = action === "approve" ? "approved" : "rejected";
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute("UPDATE artworks SET status = ? WHERE id = ?", [
      status,
      artworkId,
    ]);
    await connection.commit();
    return NextResponse.json({ message: `Artwork ${status}` }, { status: 200 });
  } catch (error) {
    console.log(error);
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};
