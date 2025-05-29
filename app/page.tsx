"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Share2, User } from "lucide-react";
import VideoPlayer from "@/components/video-player";
import ChatInterface from "@/components/chat-interface";
import { useGenerateTranscript } from "@/hooks/useGenerateTranscript";
import { useGetVideoDetails } from "@/hooks/useGetVideoDetails";
import { TranscriptProvider } from "@/contexts/TranscriptContext";
import AuthDialog from "@/components/auth-dialog";
import QuizTab from "@/components/quiz-tab";
import LockComponent from "@/components/lock-component";
import logo from "@/assets/YoutubPlus.jpg"; // Adjust the path as necessary

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

  const {
    videoDetails,
    isLoading: isVideoDetailsLoading,
    error: videoDetailsError,
  } = useGetVideoDetails({
    videoId: localStorage.getItem("videoId"),
    enabled: isLoggedIn,
  });

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
    // Check for token in localStorage on initial load
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Optionally fetch user info here if needed based on token
    }

    const url = searchParams.get("video") ?? searchParams.get("v");

    if (url && token) {
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
  }, [searchParams, generateTranscript]); // Removed isLoggedIn from dependencies to avoid infinite loop

  const handleLogin = (userInfo: { username: string; countryCode: string }) => {
    setIsLoggedIn(true);
    setUserInfo(userInfo);

    // Generate transcript after successful login if video URL exists
    const url = searchParams.get("video") ?? searchParams.get("v");
    const token = localStorage.getItem("token"); // Check for token again after login
    if (url && token) {
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

  const handleDownload = () => {
    // Navigate to PW app
    window.open(
      "https://play.google.com/store/search?q=physics+wallah&c=apps",
      "_blank"
    );
  };

  const handleShare = async () => {
    const videoUrl = searchParams.get("video");
    if (!videoUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this video on PW YoutubeX",
          text: "I found this interesting video on PW YoutubeX",
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  console.log("Transcript data:", data);

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
                PW Youtube+
              </h1>
              <img
                src={logo?.src}
                alt="PW Logo"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {userInfo?.username}
                    </span>
                  </div>
                ) : (
                  <AuthDialog
                    isLoggedIn={isLoggedIn}
                    userInfo={userInfo}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                  />
                )}
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
                {!isLoggedIn ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    {/* Updated heading and subtext */}
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Unlock Video Transcript
                    </h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Sign in to access the complete video transcript and
                      enhance your learning experience
                    </p>
                    {/* Add AuthDialog with a button here */}
                    <AuthDialog
                      isLoggedIn={isLoggedIn}
                      userInfo={userInfo}
                      onLogin={handleLogin}
                      onLogout={handleLogout}
                    >
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                        Sign in to Continue
                      </Button>
                    </AuthDialog>
                  </div>
                ) : isVideoDetailsLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : videoDetailsError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    An error occurred while fetching video details.
                  </div>
                ) : videoDetails?.description ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{videoDetails.description}</p>
                    {isLoggedIn && videoDetails.pdfUrl && (
                      <div className="mt-4">
                        <a
                          href={videoDetails.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Download PDF Summary
                        </a>
                      </div>
                    )}
                  </div>
                ) : isGenerateTranscriptPending ? (
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
                    No transcript or description available. Please provide a
                    video URL.
                  </div>
                )}
              </div>

              {/* Quiz Section */}
              <QuizTab />
            </div>

            {/* Right Column - Chat and Timestamps */}
            <div className="lg:col-span-1 space-y-6">
              {/* Chat Interface */}
              <div className="h-[500px]">
                <ChatInterface />
              </div>

              {/* Video Timestamps */}
              <LockComponent />
              {/*  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
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
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </TranscriptProvider>
  );
}
