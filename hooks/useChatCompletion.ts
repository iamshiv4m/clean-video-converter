import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api/endpoints";

interface ChatCompletionRequest {
  question: string;
  videoId: string;
}

interface ChatCompletionResponse {
  // Add response type based on your API response
  success: boolean;
  data: {
    finalAnswer: string;
  };
}

const getChatCompletion = async (
  variables: ChatCompletionRequest
): Promise<ChatCompletionResponse> => {
  const response = await fetch(
    `https://stage-api.penpencil.co${API_ENDPOINTS.CHAT_COMPLETION}`,
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get chat completion");
  }

  return response.json();
};

export const useChatCompletion = () => {
  return useMutation<ChatCompletionResponse, Error, ChatCompletionRequest>({
    mutationFn: getChatCompletion,
  });
};
