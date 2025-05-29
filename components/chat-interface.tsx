"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatCompletion } from "@/hooks/useChatCompletion";
import { useTranscript } from "@/contexts/TranscriptContext";
import TypingIndicator from "@/components/typing-indicator";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_TIMESTAMP = new Date("2024-01-01T00:00:00.000Z");

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Welcome! I'm here to help you with any questions about the video. Feel free to ask anything!",
      isUser: false,
      timestamp: INITIAL_TIMESTAMP,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { mutate: getChatCompletion, isPending } = useChatCompletion();
  const { videoId, isPending: isTranscriptPending } = useTranscript();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isPending) return;

    const userMessage: Message = {
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    getChatCompletion(
      {
        question: inputValue.trim(),
        videoId: localStorage.getItem("videoId") as string,
      },
      {
        onSuccess: (response) => {
          setIsTyping(false);
          const responseMessage: Message = {
            text: response.data?.finalAnswer,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, responseMessage]);
        },
        onError: (error) => {
          setIsTyping(false);
          const errorMessage: Message = {
            text: "Sorry, I encountered an error. Please try again.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <MessageCircle className="h-5 w-5" />
          Solve Your Doubt
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div
          className="flex-1 overflow-y-auto px-4 min-h-0"
          ref={scrollAreaRef}
        >
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 bg-white">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isTranscriptPending
                  ? "Generating transcript..."
                  : "Type your message..."
              }
              disabled={isPending || isTranscriptPending}
              className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isPending || isTranscriptPending}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {/*  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>Online • Usually replies instantly</span>
            <span>✓ Secure chat</span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
