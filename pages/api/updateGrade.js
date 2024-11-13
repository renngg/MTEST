import { connectDB } from '@/util/database.js';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session.user.email != process.env.ADMIN_EMAIL) return res.status(500).json({ error: 'You are not admin' });
  if (req.method === 'GET') return res.status(200).json({ error: 'You are admin' });

  if (req.method === 'POST') {
    const db = (await connectDB).db('test');

    try {
      // 1. 모든 도큐먼트의 점수를 가져옴
      const scores = await db.collection('users').find({}, { projection: { score: 1 } }).toArray(); // 1은 가져오겠다. 0은 가져오지 않겠다.

      // 2. 점수를 배열로 변환(scores 배열에는 각 사용자 문서가 { score: 85 }, { score: 92 }와 같은 형태)하고, 내림차순으로 정렬
      const scoreArray = scores.map(doc => doc.score).sort((a, b) => b - a);

      // 3. 백분위에 따라 등급을 부여하는 로직 (예: 상위 20%는 1등급 등)
      for (const user of scores) {
        let percentileRank = (scoreArray.indexOf(user.score) + 1) / scoreArray.length * 100;

        let grade;
        if (percentileRank <= 10) grade = 1;
        else if (percentileRank <= 34) grade = 2;
        else if (percentileRank <= 66) grade = 3;
        else if (percentileRank <= 90) grade = 4;
        else grade = 5;

        // 4. 등급 업데이트
        percentileRank = parseInt(100 - percentileRank);
        await db.collection('users').updateOne({ _id: user._id }, { $set: { grade: grade, percentileRank: percentileRank } });
      }

      return res.status(200).json({ message: 'Grades updated successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Error updating grades' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}