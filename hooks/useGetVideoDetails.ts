import { useApi } from "./use-api";
import { useEffect, useState } from "react";

interface VideoDetails {
  _id: string;
  videoId: string;
  title: string;
  createdAt: string;
  uploadedAt: string;
  updatedAt: string;
  videoUrl: string;
  description: string;
  summary: string;
  pdfUrl: string;
}

interface VideoDetailsApiResponse {
  status_code: number;
  data: VideoDetails;
  message: string;
  success: boolean;
  dataFrom: string;
  error: null | any;
}

interface UseGetVideoDetailsParams {
  videoId: string | null;
  enabled: boolean;
}

export function useGetVideoDetails({
  videoId,
  enabled,
}: UseGetVideoDetailsParams) {
  const { useApiQuery } = useApi();
  const [localVideoDetails, setLocalVideoDetails] = useState<any | null>(null);

  const {
    data,
    error,
    isPending: isLoading,
  } = useApiQuery<VideoDetailsApiResponse, Error>(
    videoId ? ["videoDetails", videoId] : ["videoDetails"],
    videoId ? `/vpservice/public-api/chat/video?id=${videoId}` : "",
    {
      enabled: !!videoId && enabled,
    }
  );

  useEffect(() => {
    if (data) {
      setLocalVideoDetails(data.data);
    }
  }, [data]);

  return {
    videoDetails: localVideoDetails,
    isLoading,
    error,
  };
}
