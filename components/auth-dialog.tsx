"use client";

import { useState } from "react";
import {
  LogIn,
  User,
  Loader2,
  AlertCircle,
  Phone,
  Shield,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useGetOtp } from "@/hooks/useGetOtp";
import { useLogin } from "@/hooks/useLogin";

interface AuthDialogProps {
  isLoggedIn: boolean;
  userInfo: { username: string; countryCode: string } | null;
  onLogin: (userInfo: { username: string; countryCode: string }) => void;
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function AuthDialog({
  isLoggedIn,
  userInfo,
  onLogin,
  onLogout,
  children,
}: AuthDialogProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const { mutate: getOtpMutate, isPending: isGetOtpPending } = useGetOtp();
  const { mutate: loginMutate, isPending: isLoginPending } = useLogin();

  const handleGetOTP = async () => {
    if (!username.trim()) {
      setError("Please enter your username/phone number");
      return;
    }

    setError("");
    getOtpMutate(
      {
        username: username,
        countryCode: countryCode,
        organizationId: "5eb393ee95fab7468a79d189",
      },
      {
        onSuccess: () => {
          setOtpSent(true);
          setError("");
        },
        onError: (err: any) => {
          setError(err.message || "Failed to send OTP. Please try again.");
        },
      }
    );
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setError("");
    loginMutate(
      {
        username: username,
        otp: otp,
        client_id: "system-admin",
        client_secret: "KjPXuAVfC5xbmgreETNMaL7z",
        grant_type: "password",
        organizationId: "5eb393ee95fab7468a79d189",
        latitude: 0,
        longitude: 0,
      },
      {
        onSuccess: (data: any) => {
          if (data?.data?.access_token) {
            const randomId = crypto.randomUUID();
            localStorage.setItem("token", data.data.access_token);
            localStorage.setItem("randomId", randomId);
          }

          onLogin({ username, countryCode });
          setIsLoginOpen(false);
          resetLoginModal();
        },
        onError: (err: any) => {
          setError(
            err.message || "Login failed. Please check OTP and try again."
          );
        },
      }
    );
  };

  const resetLoginModal = () => {
    setOtpSent(false);
    setUsername("");
    setOtp("");
    setError("");
    setCountryCode("+91");
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-gray-700 text-sm font-medium">Welcome back!</div>
          <div className="text-gray-500 text-xs">{userInfo?.username}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Dialog
      open={isLoginOpen}
      onOpenChange={(open) => {
        setIsLoginOpen(open);
        if (!open) resetLoginModal();
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm" className="font-medium px-6 py-2">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-0 shadow-lg bg-white">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            {otpSent ? (
              <Shield className="w-8 h-8 text-blue-600" />
            ) : (
              <User className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {otpSent ? "Verify Your Identity" : "Welcome Back"}
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            {otpSent
              ? "Enter the verification code sent to your device"
              : "Sign in to access premium features"}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!otpSent ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="countryCode"
                  className="text-sm font-medium text-gray-700"
                >
                  Country Code
                </Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91 (India)</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number / Username
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your phone number or username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-400 py-3"
                    onKeyPress={(e) => e.key === "Enter" && handleGetOTP()}
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleGetOTP}
                disabled={isGetOtpPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isGetOtpPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-blue-800 font-medium">
                  Code sent to {countryCode} {username}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Check your messages for the verification code
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700"
                >
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-400 py-3 text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                  onKeyPress={(e) => e.key === "Enter" && handleVerifyOTP()}
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoginPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  {isLoginPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setOtpSent(false)}
                  className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
