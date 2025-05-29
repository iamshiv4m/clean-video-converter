"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Play, Share2, Film, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGenerateTranscript } from "@/hooks/useGenerateTranscript";
import { TranscriptProvider } from "@/contexts/TranscriptContext";
import VideoPlayer from "@/components/video-player";
import ChatInterface from "@/components/chat-interface";
import AuthDialog from "@/components/auth-dialog";

export default function Component() {
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    countryCode: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const playerRef = useRef<any>(null);

  const {
    mutate: generateTranscript,
    isPending: isGenerateTranscriptPending,
    error: generateTranscriptError,
    data,
  } = useGenerateTranscript();

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

  const transcript = data?.data?.transcript || "";
  const videoId = data?.data?.videoId || null;

  const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
  };

  const handleTimestampUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
    }
  };

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
                PW Youtube+
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
            {/* Left Column */}
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
                  <VideoPlayer
                    onPlayerReady={handlePlayerReady}
                    onTimestampUpdate={handleTimestampUpdate}
                  />
                </Suspense>
              </div>

              {/* Video Info */}
              <div className="space-y-4 mt-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Video Converter & Transcript Generator
                </h2>

                {/* URL Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Video URL
                  </label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-white"
                    defaultValue={searchParams.get("video") || ""}
                  />
                </div>

                {/* Format Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button variant="outline" className="bg-white">
                    MP4
                  </Button>
                  <Button variant="outline" className="bg-white">
                    MP3
                  </Button>
                  <Button variant="outline" className="bg-white">
                    AVI
                  </Button>
                  <Button variant="outline" className="bg-white">
                    WAV
                  </Button>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Conversion
                </Button>

                {/* Transcript Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Video Notes
                  </h3>
                  {isGenerateTranscriptPending ? (
                    <LoadingSkeleton />
                  ) : generateTranscriptError ? (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                        <div>
                          <h4 className="text-lg font-semibold text-red-800">
                            Something went wrong
                          </h4>
                          <p className="text-red-600 mt-1">
                            {generateTranscriptError?.message ||
                              "An error occurred while processing your request"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : transcript ? (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <p className="text-gray-800 leading-relaxed text-base">
                        {transcript}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Film className="w-8 h-8 text-gray-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        No transcript available
                      </h4>
                      <p className="text-gray-600">
                        Please provide a video URL to generate a transcript
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Chat Interface */}
              <div className="h-[500px]">
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TranscriptProvider>
  );
}
