"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface VideoPlayerProps {
  onPlayerReady?: (player: any) => void;
  onTimestampUpdate?: (timestamp: number) => void;
}

export default function VideoPlayer({
  onPlayerReady,
  onTimestampUpdate,
}: VideoPlayerProps) {
  const searchParams = useSearchParams();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const url = searchParams.get("video");
    if (url) {
      // Convert YouTube URL to embed format if needed
      const embedUrl = convertToEmbedUrl(url);
      setVideoUrl(embedUrl);
    }

    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!videoUrl) return;

      const videoId = extractVideoId(videoUrl);
      if (!videoId) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        events: {
          onReady: (event: any) => {
            if (onPlayerReady) {
              onPlayerReady(event.target);
            }
            // Start time update interval when player is ready
            startTimeUpdateInterval();
          },
          onStateChange: (event: any) => {
            // Clear interval when video is paused or ended
            if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              clearInterval(timeUpdateInterval.current);
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              startTimeUpdateInterval();
            }
          },
        },
      });
    };

    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = null;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      clearInterval(timeUpdateInterval.current);
    };
  }, [searchParams, videoUrl, onPlayerReady]);

  const startTimeUpdateInterval = () => {
    // Clear any existing interval
    clearInterval(timeUpdateInterval.current);

    // Update time every second
    timeUpdateInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        if (onTimestampUpdate) {
          onTimestampUpdate(time);
        }
      }
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(seconds, true);
    }
  };

  const convertToEmbedUrl = (url: string): string => {
    // Handle different YouTube URL formats
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      const timestamp = extractTimestamp(url);
      return `https://www.youtube.com/embed/${videoId}${
        timestamp ? `?start=${timestamp}` : ""
      }`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      const timestamp = extractTimestamp(url);
      return `https://www.youtube.com/embed/${videoId}${
        timestamp ? `?start=${timestamp}` : ""
      }`;
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return url;
  };

  const extractTimestamp = (url: string): number | null => {
    // Handle t parameter in seconds (e.g., t=123s)
    const tParam = url.match(/[?&]t=(\d+)s/);
    if (tParam) {
      return parseInt(tParam[1]);
    }

    // Handle t parameter in minutes and seconds (e.g., t=2m3s)
    const timeParam = url.match(/[?&]t=(\d+)m(\d+)s/);
    if (timeParam) {
      const minutes = parseInt(timeParam[1]);
      const seconds = parseInt(timeParam[2]);
      return minutes * 60 + seconds;
    }

    return null;
  };

  const extractVideoId = (url: string): string | null => {
    if (url.includes("youtube.com/embed/")) {
      return url.split("/embed/")[1]?.split("?")[0] || null;
    }
    return null;
  };

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center p-6">
          <div className="text-gray-600 text-lg font-medium mb-2">
            No video URL provided
          </div>
          <div className="text-gray-400 text-sm">
            Add ?video=YOUR_YOUTUBE_URL to the page URL
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
      <div id="youtube-player" className="w-full h-full">
        <iframe
          ref={iframeRef}
          src={`${videoUrl}?enablejsapi=1`}
          title="Video Player"
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}
