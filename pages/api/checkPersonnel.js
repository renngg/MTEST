import { connectDB } from "@/util/database";

export default async function(req, res) {
  if (req.method == 'GET') {
    const db = (await connectDB).db('test');
    const personnel = await db.collection("users").countDocuments(); // 도큐먼트 개수 가져오기 메소드

    return res.json({ personnel: personnel });
  } 
}