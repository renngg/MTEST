import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  // 정답
  const correct_answer = JSON.parse(process.env.CORRECT_ANSWER);  // 배열도 환경변수로 저장될 때 JSON으로 저장됨
  let score = 0;

  const db = (await connectDB).db('test');
  const session = await getServerSession(req, res, authOptions);
  const user = await db.collection("users").findOne({ email: session.user.email });

  // 제출 여부 계속 검사
  if (!session || user.isSubmitted) {
    return res.status(403).json({ error: 'Acess denied: submision required' });
  }

  if (req.method == 'POST') {
    for (let q = 1; q <= 16; q++) {
      if (user.answers[q] == correct_answer[q]) {
        if (q == 3 || q == 5 || q == 7 || q == 8 || q == 10 || q == 13 || q == 14 || q == 16) {
          score += 3;
        } else {
          score += 2;
        }
      }
    }
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { score: score, isSubmitted: true } }
    );

    // return res.status(200).json({ message: 'Submission success' });
    return res.redirect(302, '/');
  }

  return res.status(405).json({ error: 'Method not allowed' });
}