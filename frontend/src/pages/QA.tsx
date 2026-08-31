import { useState } from "react";

interface QAItem {
    question: string;
    answer: string;
}

const qaItems: QAItem[] = [
    {
        question: 'How do I progress to the next level?',
        answer: 'Earn XP with solving quizzes. Each 500XP earns you a level up. The more quizzes you solve and the more correct answers you get, you will progress faster.',
    },
    {
        question: 'Why do I not see quizzes?',
        answer: 'Quizzes are locked by level. In order to see higher level quizzes, you must first reach the appropriate level by collecting XP points.',
    },
    {
        question: 'Can I solve the same quiz multiple times?',
        answer: 'Yes! You can take the same quizzes as many times as you want and each time you will get XP points based on your score.',
    },
    {
        question: 'How is XP reward calculated?',
        answer: 'The XP reward depends on your score. If you solve 70% of a quiz whose reward is 100 XP, you will get 70 XP. A perfect score brings a full reward.',
    },
    {
        question: 'How do I become an admin?',
        answer: 'Admin access is granted manually by the PopQuest team. If you are interested, contact us.',
    },
    {
        question: 'Is PopQuest free?',
        answer: 'Yes! PopQuest is completely free. Register and start playing immediately without any restrictions.',
    },
];

const QA = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-white mb-4">FAQ</h1>
            <p className="text-gray-400 text-lg mb-12">
                Find answers in frequently asked questions about PopQuest platform.
            </p>

            <div className="space-y-3">
                {qaItems.map((item, index) => (
                    <div 
                        key={index}
                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between px-6 py-5 text-left"
                        >
                            <span className="text-white font-semibold">{item.question}</span>
                            <span className="text-purple-400 text-xl ml-4">
                                {openIndex === index ? '-' : '+'}
                            </span>
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-5">
                                <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QA;