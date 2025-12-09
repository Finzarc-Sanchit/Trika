import React from 'react';

const TheProblem: React.FC = () => {
    const struggles = [
        {
            title: 'Chronic Stress',
            description: 'The constant pressure of modern life leaves your nervous system in a perpetual state of fight-or-flight, depleting your energy and resilience.'
        },
        {
            title: 'Anxiety & Overwhelm',
            description: 'Racing thoughts, constant worry, and the feeling of being unable to slow down create a cycle of mental exhaustion.'
        },
        {
            title: 'Burnout',
            description: 'Physical and emotional exhaustion from prolonged stress leads to disconnection from yourself and what truly matters.'
        },
        {
            title: 'Emotional Imbalance',
            description: 'Suppressed emotions, unresolved trauma, and emotional blocks prevent you from experiencing true peace and joy.'
        },
        {
            title: 'Sleep Disorders',
            description: 'Restless nights, difficulty falling asleep, or staying asleep disrupt your body\'s natural healing and restoration cycles.'
        }
    ];

    return (
        <section id="problem" className="py-24 px-6 md:px-12 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#967BB6]/5 via-[#F3F0EB] to-white -z-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Label and Heading */}
                        <div className="lg:col-span-7">
                            <span className="uppercase tracking-widest text-xs font-bold text-[#967BB6] mb-4 block">The Modern Challenge</span>
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1c1917] leading-tight">
                                Do You Struggle with <span className="text-stone-500">Modern Life?</span>
                            </h2>
                        </div>

                        {/* Right: Intro Text */}
                        <div className="lg:col-span-5 lg:pt-12">
                            <p className="text-stone-600 leading-relaxed text-lg font-light">
                                You're not alone — even <span className="text-[#967BB6] font-semibold">smart, talented individuals</span> often feel overwhelmed, disconnected, or stuck when facing the demands of modern life.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Problem Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {struggles.map((struggle, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm p-8 rounded-lg hover:bg-white transition-all"
                        >
                            {/* Number Indicator */}
                            <div className="w-12 h-12 rounded-full bg-[#967BB6]/10 flex items-center justify-center text-[#967BB6] mb-6">
                                <span className="font-serif text-2xl font-bold">{index + 1}</span>
                            </div>

                            {/* Title */}
                            <h3 className="font-serif text-xl font-semibold text-[#1c1917] mb-3">
                                {struggle.title}
                            </h3>

                            {/* Description */}
                            <p className="text-stone-600 text-sm font-light leading-relaxed">
                                {struggle.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TheProblem;

