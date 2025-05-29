import { useMutation } from "@tanstack/react-query";

interface LoginVariables {
  username: string;
  otp: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
  organizationId: string;
  latitude: number;
  longitude: number;
}

interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    tokenId?: string;
    user?: any;
  };
  dataFrom: string;
}

const loginUser = async (variables: LoginVariables): Promise<LoginResponse> => {
  const storedRandomId = localStorage.getItem("randomId");
  const randomId = storedRandomId || crypto.randomUUID(); // Use stored randomId or generate a new one

  const response = await fetch(
    "https://stage-api.penpencil.co/v3/oauth/token",
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
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: loginUser,
  });
};
