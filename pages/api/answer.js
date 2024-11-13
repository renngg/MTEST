import { connectDB } from "@/util/database";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const db = (await connectDB).db('test');
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (req.method === 'POST') {
    // 제출 여부 계속 검사
    if (!session || user.isSubmitted) {
      return res.status(403).json({ error: 'Acess denied: submision required' });
    }
    
    const { page, selectedAnswer } = req.body;
      
    // 페이지 번호에 해당하는 답을 업데이트
    const db = (await connectDB).db('test');
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { [`answers.${page}`]: selectedAnswer[page] } } // 배열 인덱스 업데이트
    );

    return res.status(200).json({ message: 'Answer updated successfully' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}