import { connectDB } from "@/util/database.js";
import { Login_btn, Logout_btn, UIs, Update_button } from "./homeUi";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Check from "./check";
import Image from "next/image";

export default async function Home() {
  const db = (await connectDB).db('test');
  const session = await getServerSession(authOptions);
  let user = null
  if (session) {
    user = await db.collection("users").findOne({ email: session.user.email });
  }
  // 응시 여부 검사 로직 만들어야 함 => 로그인 시 false로 설정, 응시 제출 시 true로 변경해서 상시 검사 필요 => 그에 따른 렌더링 변화

  return (
    <>
      <Check session={session} />
      <div className="flex flex-col items-center mt-5">
        <div className="text-center">
            <p className="text-lg font-semibold font-['dinaru'] tracking-wider">2025학년도 유튜브쟁이능력시험</p>
            <h1 className="text-5xl font-bold font-['dinaru'] mt-4">케인 영역</h1>
        </div>
        
        <div className="border border-black rounded-full px-4 py-1 mt-4">
          <span className="text-lg font-semibold font-['dinaru']">제 11교시</span>
        </div>

        <div className="w-full border-t-2 border-black mt-5"></div>
        {/* <div className="border-l-2 border-black h-[calc(100vh-10rem-2rem)]"></div> */}
      </div>

      <div className="flex flex-col items-center w-full max-w-72 space-y-4 my-10 mx-auto">
        {session ? <Logout_btn /> : <Login_btn />}
        <UIs
          name={session ? user.name : null}
          score={session ? user.score : null}
          grade={session ? user.grade : null}
          percentileRank={session ? user.percentileRank : null}
        />
        <Update_button />
      </div>

      <div className="flex justify-center items-center space-x-2 p-4 mt-auto">
        <span className="text-black font-medium">유튜브쟁이수준평가원</span>
        <Image src="/mte.png" alt="Your Image" width={25} height={25} />
      </div>
    </>
  );
}