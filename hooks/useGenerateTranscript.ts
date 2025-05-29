import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface GenerateTranscriptVariables {
  videoUrl: string;
}

interface GenerateTranscriptResponse {
  success: boolean;
  data: any;
  message?: string;
}

const generateTranscript = async (
  variables: GenerateTranscriptVariables
): Promise<GenerateTranscriptResponse> => {
  const NG_ROCK_API_BASE_URL = "https://f35c-103-222-252-210.ngrok-free.app";
  const response = await fetch(
    `${NG_ROCK_API_BASE_URL}${API_ENDPOINTS.GENERATE_TRANSCRIPT}`,
    {
      method: "POST",
      headers: {
        "Client-Id": "5eb393ee95fab7468a79d189",
        "Client-Type": "WEB",
        "Client-Version": "1.0.0",
        randomId: localStorage.getItem("randomId") || "",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate transcript");
  }

  return response.json();
};

export const useGenerateTranscript = () => {
  return useMutation<
    GenerateTranscriptResponse,
    Error,
    GenerateTranscriptVariables
  >({
    mutationFn: generateTranscript,
  });
};
