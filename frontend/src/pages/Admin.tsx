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
    const [activeTab, setActiveTab] = useState<'quizzes' | 'categories' | 'manage'>('quizzes');

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

    //manage form state
    const [quizzes, setQuizzes] = useState<{id: number, title: string, description: string, categoryId: number, minLevel: number, xpReward: number}[]>([]);
    const [editingQuiz, setEditingQuiz] = useState<number | null>(null);
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [editQuizData, setEditQuizData] = useState({ title: '', description: '', minLevel: 1, xpReward: 100, categoryId: 0 });
    const [editCatData, setEditCatData] = useState({ name: '', icon: '', description: '', minLevel: 1 });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, quizRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/quizzes/all')
                ]);
                setCategories(catRes.data);
                setQuizzes(quizRes.data);
            } catch {
                setError('Issue with loading quizzes and categories');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const handleDeleteCategory = async (id: number) => {
        const confirmed = window.confirm(
            'Are you sure? Deleting this category will also delete all quizzes associated with it.'
        );

        if(!confirmed) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories((prev) => prev.filter((c) => c.id !== id));
            setQuizzes((prev) => prev.filter((q) => q.categoryId !== id));
            setMessage('Category deleted successfully!');
        } catch {
            setError('Error with category removal');
        }
    };

    const handleDeleteQuiz = async (id: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this quiz?'
        );

        if(!confirmed) return;

        try {
            await api.delete(`/quizzes/${id}`);
            setQuizzes((prev) => prev.filter((q) => q.id !== id));
            setMessage('Quiz deleted successfully!');
        } catch {
            setError('Error with quiz removal')
        }
    };

    const handleUpdateCategory = async (id: number) => {
        try {
            await api.put(`/categories/${id}`, editCatData);
            const res = await api.get('/categories');
            setCategories(res.data);
            setEditingCategory(null);
            setMessage('Category updated successfully.');
        } catch {
            setError('Error with updating category');
        }
    };

    const handleUpdateQuiz = async (id: number) => {
        try {
            await api.put(`/quizzes/${id}`, editQuizData);
            const res = await api.get('/quizzes/all');
            setQuizzes(res.data);
            setEditingQuiz(null);
            setMessage('Quiz updated successfully.');
        } catch {
            setError('Error with updating quiz');
        }
    }

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
                <button
                    onClick={async () => {
                        setActiveTab('manage');
                        try {
                            const [catRes, quizRes] = await Promise.all([
                                api.get('/categories'),
                                api.get('/quizzes/all')
                            ]);

                            setCategories(catRes.data);
                            setQuizzes(quizRes.data);
                        } catch {
                            setError('Error loading data');
                        }
                    }}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        activeTab === 'manage'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                >
                    Manage Content
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

            {/* Manage Content*/}
            {activeTab === 'manage' && (
                <div className="space-y-8">

                    {/* Categories */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <div key={cat.id} className="bg-gray-800 rounded-xl p-4">
                                    {editingCategory === cat.id ? (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={editCatData.name}
                                                    onChange={(e) => setEditCatData({ ...editCatData, name: e.target.value })}
                                                    className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                                    placeholder="Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={editCatData.icon}
                                                    onChange={(e) => setEditCatData({ ...editCatData, icon: e.target.value })}
                                                    className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                                    placeholder="Icon"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={editCatData.description}
                                                onChange={(e) => setEditCatData({ ...editCatData, description: e.target.value })}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                                placeholder="Description"
                                            />
                                            <NumberInput
                                                label="Minimum level"
                                                value={editCatData.minLevel}
                                                onChange={(val) => setEditCatData({ ...editCatData, minLevel: val })}
                                                min={1}
                                                max={5}
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleUpdateCategory(cat.id)}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingCategory(null)}
                                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{cat.icon}</span>
                                                <div>
                                                    <p className="text-white font-semibold">{cat.name}</p>
                                                    <p className="text-gray-400 text-sm">{cat.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingCategory(cat.id);
                                                        setEditCatData({ name: cat.name, icon: cat.icon, description: cat.description, minLevel: cat.minLevel });
                                                    }}
                                                    className="text-purple-400 hover:text-purple-300 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="text-red-400 hover:text-red-300 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quizzes */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Quizzes</h2>
                        <div className="space-y-3">
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className="bg-gray-800 rounded-xl p-4">
                                    {editingQuiz === quiz.id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editQuizData.title}
                                                onChange={(e) => setEditQuizData({ ...editQuizData, title:e.target.value })}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                                placeholder="Title"
                                            />
                                            <input
                                                type="text"
                                                value={editQuizData.description}
                                                onChange={(e) => setEditQuizData({ ...editQuizData, description:e.target.value })}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                                placeholder="Description"
                                            />
                                            <select
                                                value={editQuizData.categoryId}
                                                onChange={(e) => setEditQuizData({ ...editQuizData, categoryId: Number(e.target.value) })}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.icon} {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="grid grid-cols-2 gap-4">
                                                <NumberInput
                                                    label="Minimum level"
                                                    value={editQuizData.minLevel}
                                                    onChange={(val) => setEditQuizData({ ...editQuizData, minLevel: val })}
                                                    min={1}
                                                    max={5}
                                                />
                                                <div>
                                                    <label className="block text-gray-300 mb-2">XP Reward</label>
                                                    <input
                                                        type="number"
                                                        value={editQuizData.xpReward}
                                                        onChange={(e) => setEditQuizData({ ...editQuizData, xpReward: Number(e.target.value) })}
                                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleUpdateQuiz(quiz.id)}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingQuiz(null)}
                                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-semibold">{quiz.title}</p>
                                                <p className="text-gray-400 text-sm">{quiz.description}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingQuiz(quiz.id);
                                                        setEditQuizData({
                                                            title: quiz.title,
                                                            description: quiz.description,
                                                            categoryId: quiz.categoryId,
                                                            minLevel: quiz.minLevel,
                                                            xpReward: quiz.xpReward
                                                        });
                                                    }}
                                                    className="text-purple-400 hover:text-purple-300 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                                    className="text-red-400 hover:text-red-300 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;