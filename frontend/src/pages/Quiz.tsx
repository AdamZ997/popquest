import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface Answer {
    id: number;
    answerText: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    questionText: string;
    order: number;
    answers: Answer[];
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    xpReward: number;
    questions: Question[];
    category: {
        name: string;
        icon: string;
    };
}

interface Result {
    score: number;
    correctCount: number;
    totalQuestions: number;
    xpEarned: number;
    newXp: number;
    newLevel: number;
}

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<Result | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { refreshUser } = useAuth();

    useEffect(() => {
      const fetchQuiz = async () => {
        try {
          const res = await api.get(`/quizzes/${id}`);
          setQuiz(res.data);
        } catch {
          setError("Issue with loading the quiz");
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    }, [id]);

    const handleAnswer = (questionId: number, answerId: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleNext = () => {
        if(currentQuestion < quiz!.questions.length -1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev -1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await api.post(`/quizzes/${id}/submit`, {
                answers: selectedAnswers,
            });
            setResult(res.data);
            await refreshUser();
        } catch {
            setError('Issue with submitting quiz');
        } finally {
            setSubmitting(false);
        }
    };

    if(loading) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            Loading...
        </div>
    );

    if(error) return (
        <div className="flex items-center justify-center min-h-screen text-red-400">
            {error}
        </div>
    );

    if(!quiz) return null;

    //result screen
    if(result) return (
        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10">
                <div className="text-6xl mb-6">
                    {result.score >= 80 ? '🏆' : result.score >= 50 ? '👍' : '💪'}
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                    {result.score}%
                </h1>
                <p className="text-gray-400 mb-8">
                    You have {result.correctCount} correct answers out of {result.totalQuestions} questions
                </p>
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-1">XP earned</p>
                        <p className="text-2xl font-bold text-yellow-400">+{result.xpEarned}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-1">Total XP</p>
                        <p className="text-2xl font-bold text-purple-400">{result.newXp}</p>
                    </div>
                </div>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition"
                    >
                        Go back to quizzes
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition"
                    >
                        Home
                    </button>
                 </div>
            </div>
        </div>
    );

    const question = quiz.questions[currentQuestion];
    const totalQuestions = quiz.questions.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id] !== undefined);

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">
                        {quiz.category.icon} {quiz.category.name}
                    </span>
                    <span className="text-gray-400">
                        {currentQuestion + 1} / {totalQuestions}
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">{quiz.title}</h1>
                <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">
                    {question.questionText}
                </h2>
                <div className="space-y-3">
                    {question.answers.map((answer) => (
                        <button
                            key={answer.id}
                            onClick={() => handleAnswer(question.id, answer.id)}
                            className={`w-full text-left px-5 py-4 rounded-xl border transition ${
                                selectedAnswers[question.id] === answer.id
                                ? 'border-purple-500 bg-purple-900/40 text-white'
                                : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500'
                            }`}
                        >
                            {answer.answerText}
                        </button>
                    ))}
                </div>
            </div>
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                    className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white px-6 py-3 rounded-xl transition"
                >
                    ← Previous
                </button>

                {currentQuestion === totalQuestions -1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered || submitting}
                        className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition"
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[question.id] === undefined}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl transition"
                    >
                        Next →
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;