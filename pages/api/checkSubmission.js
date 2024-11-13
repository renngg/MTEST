import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const db = (await connectDB).db('test');
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (req.method == 'POST') {
    if (user.isSubmitted) {
      return res.status(403).json({ error: 'Acess denied: submision required' });
    }

    return res.status(200).json({ message: 'good' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}