import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-20 py-10 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-2xl font-bold text-purple-400 mb-1">🎯 PopQuest</p>
                    <p className="text-gray-400 text-sm">Test your knowledge, improve, become a legend!</p>
                </div>
                <div className="flex gap-8">
                    <Link to="/" className="text-gray-400 hover:text-white transition text-sm">
                        Home
                    </Link>
                    <Link to="/quizzes" className="text-gray-400 hover:text-white transition text-sm">
                        Quizzes
                    </Link>
                    <Link to="/about" className="text-gray-400 hover:text-white transition text-sm">
                        About
                    </Link>
                    <Link to="/qa" className="text-gray-400 hover:text-white transition text-sm">
                        Q&A
                    </Link>
                </div>
                <p className="text-gray-600 text-sm">© 2026 PopQuest. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;