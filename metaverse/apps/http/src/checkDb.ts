import client from "@repo/db/client";

export async function testDbConnection() {
  try {
    await client.$connect();
    console.log("✅ Connected to the database successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit the process if DB fails
  }
}
