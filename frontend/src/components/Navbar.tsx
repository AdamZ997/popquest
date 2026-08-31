import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link to="/" className="text-2xl text-gray-100 mx-auto flex items-center justify-between">
                    🎯 PopQuest
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/quizzes" className="text-gray-300 hover:text-white transition">
                                Quizzes
                            </Link>
                            <Link to="/about" className="text-gray-300 hover:text-white transition">
                                About
                            </Link>
                            <Link to="/qa" className="text-gray-300 hover:text-white transition">
                                Q&A
                            </Link>
                            <div className="flex items-center gap-2 text-gray-300">
                                <span className="text-purple-400 font-bold">Lv.{user.level}</span>
                                <span>{user.xp} XP</span>
                            </div>
                            <Link to="/profile" className="text-gray-300 hover:text-white transition">
                                {user.username}
                            </Link>
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition">
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/about" className="text-gray-300 hover:text-white transition">
                                About
                            </Link>
                            <Link to="/qa" className="text-gray-300 hover:text-white transition">
                                Q&A
                            </Link>
                            <Link to="/login" className="text-gray-300 hover:text-white transition">
                                Log in
                            </Link>
                            <Link to="/register" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition">
                                Sign in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;