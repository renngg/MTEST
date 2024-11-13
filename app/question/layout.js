import TimerComponent from "./timer";

export default function QuestionLayout({ children }) {
  return (
    <div className="bg-white p-5">
      <div className="flex flex-col items-center mt-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-['dinaru']">케인 영역</h1>
        </div>

        <TimerComponent></TimerComponent>

        <div className="w-full border-t-2 border-black mt-5"></div>
      </div>
      <main>{children}</main>
    </div>
  );
}