'use client'

import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Login_btn() {
  return (
    <button 
      className="flex items-center px-8 py-4 border-2 border-black text-black rounded-lg hover:bg-gray-200 transition-all duration-300"
      onClick={() => signIn()}
    >
      <img src="/google.png" alt="Google Icon" className="w-8 h-8 mr-4" />
      <span className="font-semibold text-lg">Google로 로그인하여 응시하기</span>
    </button>
  )
}

export function Logout_btn() {
  return (
    <div className="flex w-full max-w-xl space-x-4 justify-center">
      <Link href="/ready" className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-200 transition-all duration-300 mb-5 text-center font-semibold text-lg">
        응시하기
      </Link>

      <button
        className="flex-1 border-2 border-black text-black py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 mb-5 font-semibold text-lg"
        onClick={() => signOut()}
      >
        로그아웃
      </button>
    </div>
  )
}

export function UIs(props) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}년 ${(currentDate.getMonth() + 1).toString().padStart(2, '0')}월 ${currentDate.getDate().toString().padStart(2, '0')}일`;

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 서버에서 관리자인지 확인하는 API 호출
    fetch("/api/updateGrade", {
      method: 'GET',
      })
      .then((res) => {
        if (res.ok) {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        console.error("관리자 확인 실패:", error);
      });
  }, []);

  return (
    <>
      <div className="flex items-center justify-center w-full px-8 py-6 h-68 border-2 border-black rounded-lg shadow-lg bg-gray-100 transition-all duration-300">
        <div className='text-center'>
          { isAdmin
            ?
            <div>
              {/* 응시인원,  */}
            </div>
            :
            <div>
              <span className="font-medium text-xl text-black">
                {props.score ? (
                  `[${props.name}${props.name.slice(-1)}님의 성적]`
                ) : (
                  <span className="text-gray-700">응시하면 성적이 보인단다</span>
                )}
              </span>
              
              <span>
                {props.score && (
                  <div className="mt-10 flex justify-between w-full">
                    <span className="text-gray-700 text-lg">원점수</span>
                    <span className="font-extrabold text-5xl text-black">
                      {`${props.score}`}
                    </span>
                  </div>
                )}
              </span>
              <span>
                {props.score && (
                  <div className="mt-5 flex justify-between w-full">
                    <span className="text-gray-700 text-lg">등급</span>
                    <span className="font-extrabold text-5xl text-black">
                      {props.grade ? `${props.grade}` : '?'}
                    </span>
                  </div>
                )}
              </span>
              <span>
                {props.score && (
                  <div className="mt-5 flex justify-between w-full">
                    <span className="text-gray-700 text-lg">백분위</span>
                    <span className="font-extrabold text-5xl text-black">
                      {props.percentileRank !== null ? `${props.percentileRank}` : '?'}
                    </span>
                  </div>
                )}
              </span>
              
              <div>
                {props.score ? (
                    <div>
                      <div className="mt-10 text-black font-extralight text-base">
                        <span>{formattedDate}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-center space-x-2">
                        <span className="text-black">유튜브쟁이수준평가원맨</span>
                        <Image src="/mte.png" alt="Your Image" width={25} height={25} />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
              </div> 
            </div>
          }
        </div>
      </div>

      <div className="flex items-center w-full px-8 py-4 border-2 border-black rounded-lg shadow-lg bg-white transition-all duration-300">
        <div className="text-left">
          <ul className="list-disc text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-1 text-gray-500">*</span>성적은 실시간 집계 중이다맨이야
            </li>
            <li className="flex items-start mt-2">
              <span className="mr-1 text-gray-500">*</span>등급은 트렌드에 맞게 5등급제임
            </li>
            <li className="flex items-start mt-2">
              <span className="mr-1 text-gray-500">*</span>자세한 사항은 아래 링크로 ㄱㄱ
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export function Update_button() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 서버에서 관리자인지 확인하는 API 호출
    fetch("/api/updateGrade", {
      method: 'GET',
      })
      .then((res) => {
        if (res.ok) {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        console.error("관리자 확인 실패:", error);
      });
  }, []);

  const handleUpdate = () => {
    fetch("/api/updateGrade", {
      method: 'POST',
      })
      .then((res) => {
        if (res.ok) {
          setIsAdmin(true);
        }
      })
    }

  return (
    <button
      onClick={handleUpdate}
      className="border-2 border-rose-400 text-rose-400 hover:shadow-lg hover:bg-pink-100 transition-all rounded-lg py-3 px-8 text-xl w-full"
      style={{ display: isAdmin ? 'block' : 'none' }}
    >
      표본 업데이트
    </button>
  );
}