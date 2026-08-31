import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch {
            setError('Incorrect email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
                <p className="text-gray-400 mb-8">Log in to your account</p>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6"> 
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                            placeholder="example@mail.com"
                            required
                        />
                        <label className="block text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold py-3 rounded-lg transition"
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-6">
                    You don't have an account?{' '}
                    <Link to='/register' className="text-purple-400 hover:text-purple-300">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;