import db from "@/lib/db";
import { NextResponse } from "next/server";

// To fetch all artworks belonging to artistId (populate with artist)
export const GET = async (req, res) => {
  const { artistId } = await res.params;
  const connection = await db.getConnection();
  try {
    const [results] = await connection.execute(
      `SELECT id ,title ,type, status FROM artworks WHERE artist_id = ?`,
      [artistId]
    );
    return NextResponse.json({ artworks: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};
