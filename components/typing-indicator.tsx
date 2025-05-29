"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-blue-500 font-medium">Typing</span>
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 rounded-full bg-blue-400"
          style={{
            animation: "bounce 1.4s infinite ease-in-out both",
            animationDelay: "0ms",
          }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-blue-400"
          style={{
            animation: "bounce 1.4s infinite ease-in-out both",
            animationDelay: "150ms",
          }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-blue-400"
          style={{
            animation: "bounce 1.4s infinite ease-in-out both",
            animationDelay: "300ms",
          }}
        ></div>
      </div>
    </div>
  );
}
