import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface Category {
    id: number;
    name: string;
    icon: string;
    description: string;
    minLevel: number;
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    minLevel: number;
    xpReward: number;
    category: Category;
}

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try{
                const res = await api.get('/quizzes');
                setQuizzes(res.data);
            } catch {
                setError('Error with loading quizzes');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            Loading...
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen text-red-400">
            {error}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-white mb-2">Quizzes</h1>
            <p className="text-gray-400 mb-10">Select quizz and earn more XP!</p>

            {quizzes.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-xl">There are no quizzes available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Link
                            key={quiz.id}
                            to={`/quizzes/${quiz.id}`}
                            className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-2xl p-6 transition group"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{quiz.category.icon}</span>
                                <span className="text-gray-400 text-sm">{quiz.category.name}</span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
                                {quiz.title}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">{quiz.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Min. Level {quiz.minLevel}</span>
                                <span className="text-yellow-400 font-bold">+{quiz.xpReward} XP</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quizzes;