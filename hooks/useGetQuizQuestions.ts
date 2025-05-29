import { useApi } from "./use-api";
import { useEffect, useState } from "react";

interface QuizQuestion {
  question: string;
  options: { name: number; value: string }[];
  correctAnswer: number;
}

interface QuizQuestionApiResponse {
  status_code: number;
  data: {
    questions: QuizQuestion[];
  };
  message: string;
  success: boolean;
  dataFrom: string;
  error: null | any;
}

interface UseGetQuizQuestionsParams {
  videoId: string | null;
  enabled: boolean; // Add enabled option for conditional fetching
}

export function useGetQuizQuestions({
  videoId,
  enabled,
}: UseGetQuizQuestionsParams) {
  // Correctly call useApi to get mutation function
  const { useApiMutation } = useApi();

  // Local state to hold quiz questions
  const [localQuizQuestions, setLocalQuizQuestions] = useState<QuizQuestion[]>(
    []
  );

  // Mock data for fallback
  const mockQuizQuestions: QuizQuestion[] = [
    {
      question: "What is the capital of France?",
      options: [
        { name: 1, value: "London" },
        { name: 2, value: "Berlin" },
        { name: 3, value: "Paris" },
        { name: 4, value: "Madrid" },
      ],
      correctAnswer: 3,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: [
        { name: 1, value: "Venus" },
        { name: 2, value: "Mars" },
        { name: 3, value: "Jupiter" },
        { name: 4, value: "Saturn" },
      ],
      correctAnswer: 2,
    },
    // Add more mock questions as needed
  ];

  // Use useApiMutation to set up the API call details
  const {
    error,
    isPending: isLoading, // Rename isPending to isLoading
    mutate: triggerFetch, // Rename mutate to triggerFetch
  } = useApiMutation<QuizQuestionApiResponse, { videoId: string }>(
    "/vpservice/public-api/chat/video/questions",
    {
      // Options for useMutation
      fetchOptions: {
        // Put fetch options inside fetchOptions
        headers: {
          "Content-Type": "application/json",
        },
      },
      onSuccess: (data) => {
        setLocalQuizQuestions(data.data.questions);
      },
      onError: (error) => {
        console.error("API call failed:", error);
        setLocalQuizQuestions(mockQuizQuestions);
      },
    }
  );

  // Trigger the API call when videoId changes and enabled is true
  useEffect(() => {
    if (videoId && enabled) {
      triggerFetch({ videoId });
    }
  }, [videoId, enabled, triggerFetch]); // Depend on videoId, enabled, and triggerFetch

  return {
    quizQuestions: localQuizQuestions,
    isLoading,
    error,
  };
}
