import { useMutation } from "@tanstack/react-query";

interface GetOtpVariables {
  username: string;
  countryCode: string;
  organizationId: string;
}

interface GetOtpResponse {
  success: boolean;
  message: string;
  // Add other expected fields from the API response if any
}

const getOtp = async (variables: GetOtpVariables): Promise<GetOtpResponse> => {
  const storedRandomId = localStorage.getItem("randomId");
  const randomId = storedRandomId || crypto.randomUUID(); // Use stored randomId or generate a new one

  const response = await fetch(
    "https://stage-api.penpencil.co/v1/users/get-otp?smsType=0",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "en-GB,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        origin: "https://staging.physicswallah.live",
        pragma: "no-cache",
        priority: "u=1, i",
        randomId: randomId,
        referer: "https://staging.physicswallah.live/",
        "sec-ch-ua":
          '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
      body: JSON.stringify(variables),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send OTP");
  }

  return response.json();
};

export const useGetOtp = () => {
  return useMutation<GetOtpResponse, Error, GetOtpVariables>({
    mutationFn: getOtp,
  });
};
