export const API_ENDPOINTS = {
  GENERATE_TRANSCRIPT: "/uxncc-go/video-stats/generate-transcript",
  CHAT_COMPLETION: "/vpservice/public-api/chat/completion",
} as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://stage-api.penpencil.co";
