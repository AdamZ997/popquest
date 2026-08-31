const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-white mb-4">About</h1>
            <p className="text-gray-400 text-lg mb-12">
                Learn more about Popquest platform and it's functionalities.
            </p>

            {/* What is PopQuest */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">🎯 What is PopQuest?</h2>
                <p className="text-gray-400 leading-relaxed">
                    PopQuest is a gamified quiz platform dedicated to pop culture. 
                    Test your knowledge of movies, music, sports and series, 
                    progress through the levels and compete with the rest of the community.
                    Each quiz earns you XP that lead you to the next level of knowledge.
                </p>
            </div>

            {/* How does it work */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">⚙️ How does it work?</h2>
                <div className="space-y-4">
                    {[
                        { icon: '📝', title: 'Sign up', desc: 'Create account for free and begin from Level 1.' },
                        { icon: '🎮', title: 'Play quizzes', desc: 'Select category and play quiz. Each correct answer brings more XP.' },
                        { icon: '⬆️', title: 'Progress', desc: 'Earn XP and unlock new, more difficult categories.'},
                        { icon: '🏆', title: 'Become a Legend', desc: 'Reach level 5 and prove that you are master of pop culture knowledge.' }, 
                    ].map((step) => (
                        <div key={step.title} className="flex items-start gap-4">
                            <span className="text-3xl">{step.icon}</span>
                            <div>
                                <h3 className="text-white font-bold mb-1">{step.title}</h3>
                                <p className="text-gray-400">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Levels */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">🎖️ Leveling system</h2>
                <div className="space-y-3">
                    {[
                        { level: 1, name: 'Rookie', xp: '0 XP', color: 'text-gray-400' },
                        { level: 2, name: 'Fan', xp: '500 XP', color: 'text-green-400' },
                        { level: 3, name: 'Enthusiast', xp: '1000 XP', color: 'text-blue-400'},
                        { level: 4, name: 'Expert', xp: '1500 XP', color: 'text-yellow-400' },
                        { level: 5, name: 'Legend', xp: '2000 XP', color: 'text-purple-400' },
                    ].map((l) => (
                        <div key={l.level} className="flex items-center justify-between bg-gray-800 rounded-xl px-6 py-4">
                            <div className="flex items-center gap-4">
                                <span className={`text-2xl font-bold ${l.color}`}>Lv.{l.level}</span>
                                <span className="text-white font-semibold">{l.name}</span>
                            </div>
                            <span className="text-gray-400">{l.xp}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;