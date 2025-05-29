"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, Bell, Star, Zap, Clock, Gift } from "lucide-react";

interface LockComponentProps {
  title?: string;
  description?: string;
  featureName?: string;
  comingSoonDate?: string;
  showNotifyButton?: boolean;
}

export default function LockComponent({
  title = "Upcoming Feature",
  description = "This feature is coming soon with exciting new capabilities!",
  featureName = "Advanced Timestamps",
  comingSoonDate = "Q2 2024",
  showNotifyButton = true,
}: LockComponentProps) {
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifyMe = () => {
    setIsNotified(true);
    // Here you would typically send the notification request to your backend
    setTimeout(() => {
      setIsNotified(false);
    }, 3000);
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23000000" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)]'></div>
      </div>

      <CardHeader className="text-center pb-4 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-500" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
          </div>
        </div>

        <CardTitle className="text-xl font-bold text-gray-700 my-2">
          {title}
        </CardTitle>
        <div className="flex items-center justify-center">
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-700 border-purple-200 mb-3 text-center"
          >
            <Clock className="w-3 h-3 mr-1" />
            Coming {comingSoonDate}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="text-center p-6 pt-0 relative z-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {featureName}
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <div className="flex items-center justify-center gap-2 p-3 bg-white/60 rounded-lg border border-gray-200">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">
              AI-Powered Timestamp Generation
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-white/60 rounded-lg border border-gray-200">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">Smart Scene Detection</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-white/60 rounded-lg border border-gray-200">
            <Gift className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">
              Custom Bookmark Creation
            </span>
          </div>
        </div>

        {showNotifyButton && (
          <div className="space-y-3">
            {!isNotified ? (
              <Button
                onClick={handleNotifyMe}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notify Me When Available
              </Button>
            ) : (
              <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    You'll be notified when this feature launches!
                  </span>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Join 1,200+ users waiting for this feature
            </p>
          </div>
        )}
      </CardContent>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-20">
        <Star
          className="w-5 h-5 text-yellow-500 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </Card>
  );
}
