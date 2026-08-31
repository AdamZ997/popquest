import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const levelNames: Record<number, string> = {
    1: 'Rookie',
    2: 'Fan',
    3: 'Enthusiast',
    4: 'Expert',
    5: 'Legend',
};

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {user ? (
                //logged in user
                <div>
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Welcome, <span className="text-purple-400">{user.username}</span>!
                        </h1>
                        <p className="text-gray-400 text-lg">Continue your journey and earn more XP!</p>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-3 gap-6 mb-12">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <p className="text-gray-400 mb-1">Level</p>
                            <p className="text-4xl font-bold text-purple-400">{user.level}</p>
                            <p className="text-gray-500 mt-1">{levelNames[user.level]}</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <p className="text-gray-400 mb-1">Total XP</p>
                            <p className="text-4xl font-bold text-yellow-400">{user.xp}</p>
                            <p className="text-gray-500 mt-1">XP needed until next level: {500 - (user.xp % 500)}</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <p className="text-gray-400 mb-1">Status</p>
                            <p className="text-4xl font-bold text-green-400">🔥</p>
                            <p className="text-gray-500 mt-1">Active player</p>
                        </div>
                    </div>

                    {/* XP progress bar */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-12">
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-300 font-semibold">Level progress</span>
                            <span className="text-purple-400 font-bold">{user.xp % 500} / 500 XP</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-4">
                            <div
                                className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${((user.xp % 500) / 500) * 100}%` }}
                            />
                        </div>
                    </div>

                    <Link
                        to="/quizzes"
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
                    >
                        Play quiz →
                    </Link>
                </div>
            ) : (
                //user not logged in
                <div className="text-center py-20">
                    <h1 className="text-6xl font-bold text-white mb-6">
                        🎯 Pop<span className="text-purple-400">Quest</span>
                    </h1>
                    <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
                        Try your knowledge in movies, music, sport and TV shows. Advance through levels and become a legend!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
                        >
                            Start your journey for free
                        </Link>
                        <Link
                            to="/login"
                            className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;