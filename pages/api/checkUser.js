import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(400).json({ message: "No user session found" });
  }

  const db = (await connectDB).db("test");
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (!user.createdAt) {
    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { answers: Array(17).fill(0),
        isSubmitted: false,
        createdAt: new Date(),
        score: null,
        grade: null,
        percentileRank: null,
      }}
    );
    return res.status(200).json({ message: "New user", user });
  }

  // 사용자 존재하면 그대로 반환
  return res.status(200).json({ message: "User exists", user });
}