import { useState, useEffect } from "react";
import api from "../api/axios";
import NumberInput from "../components/NumberInput";

interface Category {
    id: number;
    name: string;
    icon: string;
    description: string;
    minLevel: number;
}

const Admin = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'quizzes' | 'categories'>('quizzes');

    //category form state
    const [catName, setCatName] = useState('');
    const [catIcon, setCatIcon] = useState('');
    const [catDescription, setCatDescription] = useState('');
    const [catMinLevel, setCatMinLevel] = useState(1);

    //quiz form state
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [quizCategoryId, setQuizCategoryId] = useState(0);
    const [quizMinLevel, setQuizMinLevel] = useState(1);
    const [quizXpReward, setQuizXpReward] = useState(100);
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            answers: [
                { answerText: '', isCorrect: true },
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
            ],
        },
    ]);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCateogories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch {
                setError('Issue with loading categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCateogories();
    }, []);

    const handleCreateCategory = async () => {
        try {
            await api.post('/categories', {
                name: catName,
                icon: catIcon,
                description: catDescription,
                minLevel: catMinLevel,
            });
            setMessage('Category successfuly created!');
            setCatName('');
            setCatIcon('');
            setCatDescription('');
            setCatMinLevel(1);
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch {
            setError('Issue with creating category');
        }
    };

    const handleQuestionChange = (index: number, value: string) => {
        const updated = [...questions];
        updated[index].questionText = value;
        setQuestions(updated);
    };

    const handleAnswerChange = (qIndex: number, aIndex: number, value: string) => {
        const updated = [...questions];
        updated[qIndex].answers[aIndex].answerText = value;
        setQuestions(updated);
    };

    const handleCorrectAnswer = (qIndex: number, aIndex: number) => {
        const updated = [...questions];
        updated[qIndex].answers = updated[qIndex].answers.map((a, i) => ({
            ...a,
            isCorrect: i === aIndex,
        }));
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            {
                questionText: '',
                answers: [
                    { answerText: '', isCorrect: true },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                ],
            },
        ]);
    };

    const removeQuestion = (qIndex: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
    };

    const handleCreateQuiz = async () => {
        try {
            await api.post('/quizzes', {
                title: quizTitle,
                description: quizDescription,
                categoryId: quizCategoryId,
                minLevel: quizMinLevel,
                xpReward: quizXpReward,
                questions,
            });
            setMessage('Quiz successfuly created!');
            setQuizTitle('');
            setQuizDescription('');
            setQuizCategoryId(0);
            setQuizMinLevel(1);
            setQuizXpReward(100);
            setQuestions([{
                questionText: '',
                answers: [
                    { answerText: '', isCorrect: true },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                ],
            }]);
        } catch {
            setError('Issue with quiz creation');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            Loading...
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-white mb-2">Admin panel</h1>
            <p className="text-gray-400 mb-8">Create or modify quizzes and categories</p>

            {message && (
                <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
                    {message}
                </div>
            )}
            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        activeTab === 'quizzes'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                >
                    Create Quizz
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        activeTab === 'categories'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                >
                    Create Category
                </button>
            </div>

            {/* Category form */}
            {activeTab === 'categories' && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">New category</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                placeholder="Movies"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Icon (emoji)</label>
                            <input
                                type="text"
                                value={catIcon}
                                onChange={(e) => setCatIcon(e.target.value)}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                placeholder="🎬"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Description</label>
                            <input
                                type='text'
                                value={catDescription}
                                onChange={(e) => setCatDescription(e.target.value)}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                placeholder="Quiz about movies"
                            />
                        </div>
                        <NumberInput
                            label="Minimum level"
                            value={catMinLevel}
                            onChange={setCatMinLevel}
                            min={1}
                            max={5}
                        />
                        <button
                            onClick={handleCreateCategory}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition"
                        >
                            Create category
                        </button>
                    </div>
                </div>
            )}

            {/* Quizz form */}
            {activeTab === 'quizzes' && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">New quiz</h2>
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                placeholder="Movies 101"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Description</label>
                            <input
                                type="text"
                                value={quizDescription}
                                onChange={(e) => setQuizDescription(e.target.value)}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                placeholder="Basic quiz about movies"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Cateogry</label>
                            <select
                                value={quizCategoryId}
                                onChange={(e) => setQuizCategoryId(Number(e.target.value))}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                            >
                                <option value={0}>Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <NumberInput
                                label="Minimum level"
                                value={quizMinLevel}
                                onChange={setQuizMinLevel}
                                min={1}
                                max={5}
                            />
                            <div>
                                <label className="block text-gray-300 mb-2">XP reward</label>
                                <input
                                    type="number"
                                    value={quizXpReward}
                                    onChange={(e) => setQuizXpReward(Number(e.target.value))}
                                    min={50}
                                    max={500}
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 h-10.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <h3 className="text-xl font-bold text-white mb-4">Questions</h3>
                    <div className="space-y-6 mb-6">
                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="bg-gray-800 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-gray-400 text-sm mb-3">Question {qIndex + 1}</p>
                                    {questions.length > 1 && (
                                        <button
                                            onClick={() => removeQuestion(qIndex)}
                                            className="text-red-400 hover:text-red-300 text-sm transition"
                                        >
                                            Remove question
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={question.questionText}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 mb-4"
                                    placeholder="Enter question..."
                                />
                                <div className="space-y-2">
                                    {question.answers.map((answer, aIndex) => (
                                        <div key={aIndex} className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleCorrectAnswer(qIndex, aIndex)}
                                                className={`w-6 h-6 rounded-full border-2 shrink-0 transition ${
                                                answer.isCorrect
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-500 hover:border-green-500'
                                        }`}
                                        />
                                        <input
                                            type="text"
                                            value={answer.answerText}
                                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            placeholder={`Answer ${aIndex + 1}`}
                                        />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={addQuestion}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition"
                        >
                            + Add Question
                        </button>
                        <button
                            onClick={handleCreateQuiz}
                            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition"
                        >
                            Create quiz
                        </button>
                    </div>                        
                </div>
            )}
        </div>
    );
};

export default Admin;