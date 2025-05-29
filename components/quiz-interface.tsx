"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Sparkles,
  RotateCcw,
  Gift,
  Percent,
  Copy,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuizOption {
  name: number;
  value: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctAnswer: number;
}

const quizData: QuizQuestion[] = [
  {
    question: "What is the primary purpose of the Garud Platform?",
    options: [
      { name: 0, value: "To facilitate drone operations and management" },
      { name: 1, value: "To provide online shopping services" },
      { name: 2, value: "To stream educational videos" },
      { name: 3, value: "To manage financial transactions" },
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which organization is associated with the development of the Garud Platform?",
    options: [
      { name: 0, value: "ISRO" },
      { name: 1, value: "DGCA (Directorate General of Civil Aviation)" },
      { name: 2, value: "NITI Aayog" },
      { name: 3, value: "Indian Railways" },
    ],
    correctAnswer: 1,
  },
  {
    question: "What is a key feature of the Garud Platform?",
    options: [
      { name: 0, value: "Drone registration and approval" },
      { name: 1, value: "Video conferencing" },
      { name: 2, value: "Weather forecasting" },
      { name: 3, value: "E-commerce integration" },
    ],
    correctAnswer: 0,
  },
  {
    question: "Who can use the Garud Platform?",
    options: [
      { name: 0, value: "Only government officials" },
      { name: 1, value: "Drone operators and owners" },
      { name: 2, value: "Students" },
      { name: 3, value: "Bank employees" },
    ],
    correctAnswer: 1,
  },
  {
    question: "What does 'Garud' stand for in the context of the platform?",
    options: [
      { name: 0, value: "Government Authorised Remote UAS Digital Platform" },
      { name: 1, value: "General Aviation Registration and Usage Database" },
      { name: 2, value: "Global Automated Registration for Unmanned Devices" },
      { name: 3, value: "Geospatial Analysis and Reporting Unified Dashboard" },
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which type of vehicles is the Garud Platform primarily concerned with?",
    options: [
      { name: 0, value: "Unmanned Aerial Vehicles (Drones)" },
      { name: 1, value: "Automobiles" },
      { name: 2, value: "Ships" },
      { name: 3, value: "Trains" },
    ],
    correctAnswer: 0,
  },
];

const getDiscountInfo = (score: number, total: number) => {
  const percentage = (score / total) * 100;

  if (percentage === 100) {
    return {
      discount: 50,
      code: "EXPERT50",
      message: "🎉 Perfect Score! You're a true expert!",
    };
  } else if (percentage >= 83) {
    return {
      discount: 30,
      code: "SMART30",
      message: "🌟 Excellent knowledge! Almost perfect!",
    };
  } else if (percentage >= 67) {
    return {
      discount: 20,
      code: "GOOD20",
      message: "👍 Good job! You know your stuff!",
    };
  } else if (percentage >= 50) {
    return {
      discount: 10,
      code: "TRY10",
      message: "💪 Keep learning! You're on the right track!",
    };
  } else {
    return {
      discount: 5,
      code: "START5",
      message: "📚 Every expert was once a beginner!",
    };
  }
};

export default function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
      setShowResults(true);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    quizData.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  };

  const copyDiscountCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  useEffect(() => {
    if (showResults && score === quizData.length) {
      triggerConfetti();
    }
  }, [showResults, score]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setIsComplete(false);
    setShowDiscount(false);
    setCopiedCode(false);
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  if (showResults) {
    const discountInfo = getDiscountInfo(score, quizData.length);
    const isPerfectScore = score === quizData.length;

    return (
      <Card className="border-0 shadow-lg bg-white overflow-hidden">
        <CardHeader
          className={`text-center ${
            isPerfectScore
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}
        >
          <div className="flex justify-center mb-4">
            {isPerfectScore ? (
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Trophy className="w-10 h-10 text-yellow-800" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-10 h-10 text-blue-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isPerfectScore ? "🎉 Perfect Score! 🎉" : "Quiz Complete!"}
          </CardTitle>
          <p className="text-white/90 mt-2">{discountInfo.message}</p>
        </CardHeader>

        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div
              className={`text-6xl font-bold mb-4 ${
                isPerfectScore ? "text-green-600" : "text-blue-600"
              }`}
            >
              {score}/{quizData.length}
            </div>
            <div className="text-xl text-gray-600 mb-6">
              You scored {Math.round((score / quizData.length) * 100)}%
            </div>

            {/* Discount Reveal Section */}
            {!showDiscount ? (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-2 text-purple-800 font-semibold text-lg mb-4">
                  <Gift className="w-6 h-6" />
                  🎁 Special Reward Waiting!
                  <Gift className="w-6 h-6" />
                </div>
                <p className="text-purple-700 mb-4">
                  You've earned an exclusive discount based on your performance!
                </p>
                <Button
                  onClick={() => setShowDiscount(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg animate-pulse"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Reveal My Discount!
                </Button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-2 text-green-800 font-semibold text-lg mb-4">
                  <Percent className="w-6 h-6" />
                  🎊 Your Exclusive Discount!
                  <Percent className="w-6 h-6" />
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-dashed border-green-300 mb-4">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {discountInfo.discount}% OFF
                  </div>
                  <div className="text-lg text-gray-700 mb-4">
                    Use code at checkout:
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg font-bold text-gray-800 border-2 border-dashed border-gray-300">
                      {discountInfo.code}
                    </div>
                    <Button
                      onClick={() => copyDiscountCode(discountInfo.code)}
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      {copiedCode ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {copiedCode && (
                    <div className="text-green-600 text-sm animate-fade-in">
                      ✅ Code copied to clipboard!
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  * Valid for 24 hours • Applicable on all premium courses
                </div>
              </div>
            )}

            {isPerfectScore && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-2 text-yellow-800 font-semibold text-lg">
                  <Sparkles className="w-6 h-6" />
                  Outstanding Performance!
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-yellow-700 mt-2">
                  You've mastered all the key concepts about the Garud Platform!
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {quizData.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">
                    Question {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        Incorrect
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={resetQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <Card className="border-0 shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl">
            Garud Platform Quiz
          </CardTitle>
          <Badge className="bg-white/20 text-white border-white/30">
            {currentQuestion + 1} of {quizData.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.name}
                onClick={() => handleAnswerSelect(currentQuestion, option.name)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  selectedAnswer === option.name
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === option.name
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === option.name && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.value}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6"
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {currentQuestion === quizData.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
