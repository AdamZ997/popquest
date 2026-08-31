import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-purple-400 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-white mb-4">Page not found</h2>
                <p className="text-gray-400 mb-10">
                    You got lost? Let's go back on the correct route!
                </p>
                <Link
                    to="/"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-y py-4 rounded-xl transition"
                >
                    Back to home page
                </Link>
            </div>
        </div>
    );
};

export default NotFound;