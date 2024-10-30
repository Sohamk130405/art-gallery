import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  const { name, username, email, password, confirmPassword, role, phone } =
    await req.json();

  if (
    !(name && username && email && password && confirmPassword && role && phone)
  ) {
    return NextResponse.json(
      { error: "Please provide all input fields" },
      { status: 422 }
    );
  }
  if (password !== confirmPassword)
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );

  const connection = await db.getConnection();
  try {
    const [existingUser] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert new user
    const [result] = await connection.execute(
      "INSERT INTO users (name,username, email, password,role,phone) VALUES (?, ?, ?, ?, ?,?)",
      [name, username, email, hashedPassword, role, phone]
    );
    await connection.commit();
    return NextResponse.json(
      { message: "User successfully registered" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    connection.release();
  }
};
