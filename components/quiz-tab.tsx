"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Play, Gift, Sparkles, Trophy, Zap, Target } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuizInterface from "./quiz-interface";

export default function QuizTab() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (showQuiz) {
    return (
      <QuizInterface
        videoId={localStorage.getItem("videoId") as string}
        isLoggedIn
      />
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Brain className="h-5 w-5" />
          Knowledge Challenge
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 text-center">
        <div
          className="relative mb-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
              isHovered ? "scale-110 shadow-lg" : ""
            }`}
          >
            <Brain
              className={`w-10 h-10 text-purple-600 transition-all duration-300 ${
                isHovered ? "animate-pulse" : ""
              }`}
            />
          </div>

          {isHovered && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Test Your Knowledge & Win Rewards!
        </h3>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Take our interactive quiz about the Garud Platform and unlock
          exclusive discounts based on your performance!
        </p>

        {/* Engaging Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <Gift className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-green-800">
              Up to 50% OFF
            </div>
            <div className="text-xs text-green-600">Discount Coupons</div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-blue-800">6 Questions</div>
            <div className="text-xs text-blue-600">Quick & Easy</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-yellow-800">
              Instant Results
            </div>
            <div className="text-xs text-yellow-600">Know Your Score</div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-purple-800">
              5-10 Minutes
            </div>
            <div className="text-xs text-purple-600">Quick Challenge</div>
          </div>
        </div>

        {/* Coupon Teasers */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-dashed border-pink-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 text-pink-700 font-semibold mb-3">
            <Gift className="w-5 h-5" />
            🎁 Exclusive Rewards Waiting!
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white/60 px-2 py-1 rounded border border-pink-200">
              <div className="font-bold text-pink-800">EXPERT50</div>
              <div className="text-pink-600">Perfect Score</div>
            </div>
            <div className="bg-white/60 px-2 py-1 rounded border border-blue-200">
              <div className="font-bold text-blue-800">SMART30</div>
              <div className="text-blue-600">5+ Correct</div>
            </div>
            <div className="bg-white/60 px-2 py-1 rounded border border-green-200">
              <div className="font-bold text-green-800">GOOD20</div>
              <div className="text-green-600">4+ Correct</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            * Discount codes revealed after quiz completion
          </div>
        </div>

        <Button
          onClick={() => setShowQuiz(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Quiz & Win Rewards!
        </Button>

        <div className="text-xs text-gray-500 mt-4">
          💡 Higher scores = Better discounts!
        </div>
      </CardContent>
    </Card>
  );
}
