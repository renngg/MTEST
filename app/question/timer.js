'use client'

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function TimerComponent() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20분 = 1200초
  const router = useRouter();

  useEffect(() => {
    const start_audio = new Audio("/sounds/bbb.mp3");
    start_audio.play();
  }, []);

  useEffect(() => {
    const end_audio = new Audio("/sounds/ddd.mp3");

    if (timeLeft <= 0) {
      // 시간 종료 시 처리
      fetch("/api/submitting", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        end_audio.play();
        alert("땡땡땡! 답안은 자동 저장된다맨이야");
        window.location.href = '/';
      })
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="timer">
      <p>남은 시간: {formatTime(timeLeft)}</p>
    </div>
  );
}