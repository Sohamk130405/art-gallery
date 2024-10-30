import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.execute(`
      SELECT p.id, u.name AS buyer, a.title AS artwork, a.price, p.purchase_date AS date
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      JOIN artworks a ON p.artwork_id = a.id
      ORDER BY p.purchase_date DESC
    `);

    connection.release();

    return NextResponse.json({ history: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req, res) => {
  const { userId, artworkId } = await req.json();

  if (!userId || !artworkId) {
    return NextResponse.json(
      { error: "Required fileds are missing" },
      { status: 400 }
    );
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO purchases (user_id, artwork_id) VALUES (?, ?)`,
      [userId, artworkId]
    );

    await connection.execute(
      `UPDATE artworks SET is_sold = true  WHERE id = ?`,
      [artworkId]
    );

    await connection.commit();

    return NextResponse.json(
      {
        message: "Purchase successful",
        ok: true,
      },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
};
