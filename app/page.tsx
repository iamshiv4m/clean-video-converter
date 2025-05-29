"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import VideoPlayer from "@/components/video-player";
import ChatInterface from "@/components/chat-interface";
import { useGenerateTranscript } from "@/hooks/useGenerateTranscript";
import { TranscriptProvider } from "@/contexts/TranscriptContext";
import AuthDialog from "@/components/auth-dialog";
import QuizTab from "@/components/quiz-tab";

interface Timestamp {
  title: string;
  description: string;
  time: string;
  seconds: number;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    countryCode: string;
  } | null>(null);
  const [player, setPlayer] = useState<any>(null);

  const {
    mutate: generateTranscript,
    isPending: isGenerateTranscriptPending,
    error: generateTranscriptError,
    data,
  } = useGenerateTranscript();

  // Sample timestamps
  const timestamps: Timestamp[] = [
    {
      title: "Opening Scene",
      description: "Video introduction begins",
      time: "00:15",
      seconds: 15,
    },
    {
      title: "Main Content",
      description: "Core video content starts",
      time: "01:23",
      seconds: 83,
    },
    {
      title: "Key Points",
      description: "Important information highlighted",
      time: "02:45",
      seconds: 165,
    },
    {
      title: "Demonstration",
      description: "Practical examples shown",
      time: "04:12",
      seconds: 252,
    },
    {
      title: "Conclusion",
      description: "Summary and wrap-up",
      time: "05:30",
      seconds: 330,
    },
  ];

  useEffect(() => {
    const url = searchParams.get("video");
    if (url) {
      generateTranscript(
        { videoUrl: url },
        {
          onSuccess: (data: any) => {
            localStorage.setItem("videoId", data?.videoId);
          },
          onError: (error) => {
            console.error("Failed to generate transcript:", error);
          },
        }
      );
    }
  }, [searchParams, generateTranscript]);

  const handleLogin = (userInfo: { username: string; countryCode: string }) => {
    setIsLoggedIn(true);
    setUserInfo(userInfo);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("randomId");
  };

  const handlePlayerReady = (ytPlayer: any) => {
    setPlayer(ytPlayer);
  };

  const handleTimestampClick = (seconds: number) => {
    if (player && typeof player.seekTo === "function") {
      player.seekTo(seconds, true);
      player.playVideo();
    }
  };

  const transcript = data?.data?.transcript || "";
  const videoId = data?.data?.videoId || null;

  return (
    <TranscriptProvider
      value={{
        videoId,
        transcript,
        isPending: isGenerateTranscriptPending,
        error: generateTranscriptError,
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-semibold text-gray-900">
                PW YoutubeX
              </h1>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <AuthDialog
                  isLoggedIn={isLoggedIn}
                  userInfo={userInfo}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video, Transcript, and Quiz */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <Suspense
                  fallback={
                    <div className="aspect-video bg-gray-50 flex items-center justify-center">
                      <div className="text-gray-500 animate-pulse">
                        Loading video...
                      </div>
                    </div>
                  }
                >
                  <VideoPlayer onPlayerReady={handlePlayerReady} />
                </Suspense>
              </div>

              {/* Video Transcript Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Video Transcript
                </h2>
                {isGenerateTranscriptPending ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : generateTranscriptError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    An error occurred while generating the transcript.
                  </div>
                ) : transcript ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{transcript}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No transcript available. Please provide a video URL.
                  </div>
                )}
              </div>

              {/* Quiz Section - Now below transcript */}
              <QuizTab />
            </div>

            {/* Right Column - Chat and Timestamps */}
            <div className="lg:col-span-1 space-y-6">
              {/* Chat Interface */}
              <div className="h-[500px]">
                <ChatInterface />
              </div>

              {/* Video Timestamps */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Video Timestamps
                </h2>
                <div className="space-y-3">
                  {timestamps.map((timestamp, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimestampClick(timestamp.seconds)}
                      className="w-full grid grid-cols-[1fr_auto] gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors text-left border border-transparent"
                    >
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {timestamp.title}
                        </h4>
                        <p className="text-gray-600 text-xs truncate">
                          {timestamp.description}
                        </p>
                      </div>
                      <span className="text-blue-600 font-mono text-sm whitespace-nowrap">
                        {timestamp.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TranscriptProvider>
  );
}
