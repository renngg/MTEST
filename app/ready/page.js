'use client';

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // useRouter 사용 시 이렇게 import해야 함!
import { useEffect, useState } from "react";

export default function Ready_page() {
  const router = useRouter();
  const [check, setCheck] = useState("");

  // check 값이 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    // check 값이 특정 문자열과 일치하면 페이지 이동
    if (check === "뭉탱이로 있다가 유링게슝 아이그냥" || check === "오옹") {
      fetch("/api/checkSubmission", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // 요청 헤더에 Content-Type을 설정
        },
      })
      .then((res) => {
        if (!res.ok) {
          // 서버에서 403 에러 등의 상태 코드가 오면 처리
          throw new Error("얘! 재수는 안 된단다!");
        }
      })
      .then(() => {
        router.push('/question');
      })
      .catch((error) => {
        alert(error.message);
        router.push('/');
      })
    }
  }, [check]); // check 값이 변경될 때마다 실행

  return (
    <>
      <div className="flex flex-col items-center mt-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-['dinaru']">케인 영역</h1>
        </div>

        <div className="w-full border-t-2 border-black mt-3"></div>
      </div>

      <div className="border border-black rounded-lg p-10 max-w-screen-lg mx-auto mt-20 bg-gray-50 shadow-lg">
        <ul className="space-y-4 list-disc list-inside text-gray-800">
          <li className="text-lg font-semibold">시험 시간은 20분이고, 총 16문항입니다.</li>
          <li className="text-lg font-semibold">시험 중에는 페이지에서 뒤로 가거나 새로고침하지 마시오.</li>
          <li className="text-lg font-semibold">시험이 종료되면 자동으로 제출됩니다.</li>
          <li className="text-lg font-semibold">문항에 따라 배점이 다릅니다. 3점 문항에는 표시가 되어있고, 그렇지 않은 문항은 모두 2점입니다.</li>
          <li className="text-lg font-semibold">하나의 계정에는 단 한 번의 응시 자격이 주어집니다.</li>
          <li className="text-lg font-semibold">필적 확인란에 다음의 문구를 입력하면 시험이 시작됩니다.</li>
          <div className="pl-6">
            <div>
              <div className="border border-black p-2 w-auto h-auto inline-block">
                <p className="text-gray-500">뭉탱이로 있다가 유링게슝 아이그냥</p>
              </div>
            </div>
          </div>
          <li className="text-lg font-semibold">주의사항을 꼭 확인 후 응시 바랍니다.</li>
        </ul>
      </div>

      <div className="flex justify-center max-w-screen-xl mx-auto mt-20">
        <input
          type="text"
          placeholder="필적 확인란"
          className="border-2 border-gray-500 rounded-lg px-4 py-2 w-2/3 text-center text-lg"
          onChange={(e) => { setCheck(e.target.value.trim()) }}
        />
      </div>

      <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-2 p-4">
        <span className="text-black font-medium">유튜브쟁이능력평가원</span>
        <Image src="/mte.png" alt="Your Image" width={25} height={25} />
      </div>
    </>
  );
}