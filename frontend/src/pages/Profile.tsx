import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

interface QuizAttempt {
    id: number;
    score: number;
    xpEarned: number;
    completedAt: string;
    quiz: {
        title: string;
        category: {
            icon: string;
            name: string;
        };
    };
}

const levelNames: Record<number, string> = {
    1: 'Rookie',
    2: 'Fan',
    3: 'Enthusiast',
    4: 'Expert',
    5: 'Legend',
};

const levelColors: Record<number, string> = {
    1: 'text-gray-400',
    2: 'text-green-400',
    3: 'text-blue-400',
    4: 'text-yellow-400',
    5: 'text-purple-400',
};

const Profile = () => {
    const { user } = useAuth();
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await api.get('/users/attempts');
                setAttempts(res.data);
            } catch {
                console.error('Issue with loading history');
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, []);

    if(!user) return null;

    const xpProgress = user.xp % 500;
    const xpPercentage = (xpProgress / 500) * 100;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-white mb-10">My profile</h1>

            {/* User info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                        {user.username[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                        <p className="text-gray-400">{user.email}</p>
                        <span className={`font-bold text-lg ${levelColors[user.level]}`}>
                            {levelNames[user.level]}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-sm mb-1">Level</p>
                        <p className={`text-3xl font-bold ${levelColors[user.level]}`}>{user.level}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-sm mb-1">Total XP</p>
                        <p className="text-3xl font-bold text-yellow-400">{user.xp}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-400 text-sm mb-1">Quizzes</p>
                        <p className="text-3xl font-bold text-white">{attempts.length}</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">Progress until next level</span>
                        <span className="text-purple-400 text-sm font-bold">{xpProgress} / 500 XP</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                        <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${xpPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Quiz history */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quiz history</h2>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : attempts.length === 0 ? (
                    <p className="text-gray-400">You have no finished quizzes.</p>
                ) : (
                    <div className="space-y-3">
                        {attempts.map((attempt) => (
                            <div
                                key={attempt.id}
                                className="flex items-center justify-between bg-gray-800 rounded-xl px-6 py-4"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{attempt.quiz.category.icon}</span>
                                    <div>
                                        <p className="text-white font-semibold">{attempt.quiz.title}</p>
                                        <p className="text-gray-400 text-sm">{attempt.quiz.category.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={`font-bold text-lg ${
                                            attempt.score >= 80 ? 'text-green-400' :
                                            attempt.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                            {attempt.score}%
                                        </p>
                                        <p className="text-gray-400 text-sm">+{attempt.xpEarned} XP</p>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(attempt.completedAt).toLocaleDateString('sr-RS')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;