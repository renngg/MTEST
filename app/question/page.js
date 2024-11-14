'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

const QuestionPage = () => {
  const [page, setPage] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(Array(21).fill(0));

  const pathname = usePathname();
  const router = useRouter();

  const handleAnswerChange = (e) => {
    const newAnswers = [...selectedAnswer];
    newAnswers[page] = parseInt(e.target.value);
    setSelectedAnswer(newAnswers);  // 선택된 답안을 상태에 저장
  };

  // 상시 검사가 필요하다면, useEffect의 변경 조건 하에 fetch를 이용하여 서버에서 검사하게 하자!
  useEffect(() => {
    if (selectedAnswer[page] !== 0) {
      // 답안이 선택되었을 때만 fetch 요청 보내기
      fetch("/api/answer", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // 요청 헤더에 Content-Type을 설정
        },
        body: JSON.stringify({ page, selectedAnswer }),
      });

      fetch("/api/checkSubmission", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // 요청 헤더에 Content-Type을 설정
        },
      })
      .then((res) => {
        if (!res.ok) {
          // 서버에서 403 에러 등의 상태 코드가 오면 처리
          throw new Error("잘못된 경로입니다.");
        }
      })
      .then(() => {
        router.push('/question');
      })
      .catch((error) => {
        alert(error.message);
        router.replace('/');
      })
    }
  }, [selectedAnswer, page]); // selectedAnswer나 page가 변경될 때마다 실행

  // 뒤로가기 방지 로직
  useEffect(() => {
    const preventGoBack = () => {
      history.pushState(null, '', location.href);
      alert("문항 이동은 아래의 문항 번호를 클릭맨");
    };
    
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventGoBack);
    
    return () => window.removeEventListener('popstate', preventGoBack);
  }, []);

  return (
    <>
      <div className="flex justify-center my-10">
        {/* 문제 이미지 중앙 배치 및 크기 조정 */}
        <img
          src={`/questions/q${page}.png`}
          alt={`Question ${page}`}
          className="max-w-xl object-contain mx-auto"
        />
      </div>

      {/* 선택형 답안 */}
      <div className="mt-16">
        <div className="flex space-x-10 justify-center mt-4">
          {[1, 2, 3, 4, 5].map((answer) => (
            <label className="flex flex-col items-center" key={answer}>
              <input
                type="radio"
                name="answer"
                value={answer}
                checked={selectedAnswer[page] === answer}
                onChange={handleAnswerChange}
                className="hidden"  // 기본 라디오 버튼 숨기기
              />
              <span
                className={`radio-box ${selectedAnswer[page] === answer ? "checked" : ""}`}
              ></span>
              {answer}번
            </label>
          ))}
        </div>
      </div>
      <style jsx>{`
        .radio-box {
          width: 60px;      /* 크기 키우기 */
          height: 120px;    /* 크기 키우기 */
          border: 2px solid #000;
          border-radius: 30px;  /* 둥근 모서리 */
          display: inline-block;
          transition: background-color 0.3s, border-color 0.3s;
          margin-bottom: 16px;
          background-color: #f0f0f0;  /* 배경 추가 */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radio-box.checked {
          background-color: black;
        }

        .flex label {
          text-align: center;
        }
      `}</style>

      {/* 문항 이동 버튼 */}
      <div className="relative bottom-4 left-0 right-0 flex justify-around space-x-4 my-8 mt-28">
        {/* 이전 문항 버튼 */}
        <button
          onClick={() => setPage(page === 1 ? 20 : page - 1)}
          className="bg-slate-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-slate-600"
          style={{ display: page === 1 ? 'none' : 'inline-block' }}
        >
          이전 문항
        </button>
        {/* 다음 문항 버튼 */}
        <button
          onClick={() => {
            if (page === 20) {
              if (confirm("제출하시겠습니까?")) {
                fetch("/api/submitting", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                .then(() => {
                  const end_audio = new Audio("/sounds/ddd.mp3");
                  end_audio.play();
                  alert("제출되었습니다. 마킹하지 않은 문항은 0점 처리됩니다.");
                  window.location.href = '/';
                });
              }
            } else {
              setPage(page + 1);
            }
          }}
          className="bg-slate-700 text-white px-6 py-2 rounded-full shadow-md hover:bg-slate-800"
        >
          { page === 20 ? "제출" : "다음 문항" }
        </button>
      </div>
    </>
  );
};

export default QuestionPage;