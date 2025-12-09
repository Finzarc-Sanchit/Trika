import React from 'react';

const WhatMakesUnique: React.FC = () => {
    const uniqueFeatures = [
        {
            title: 'Science + Spirituality',
            description: 'Blend of science and spirituality'
        },
        {
            title: 'Clinical Organ Therapy',
            description: 'Targeted vibration therapy for organs'
        },
        {
            title: 'Trauma-Sensitive',
            description: 'Trauma-sensitive approach'
        },
        {
            title: 'Curated Journeys',
            description: 'Curated sound journeys'
        },
        {
            title: 'Gong Mastery',
            description: 'Expert gong mastery'
        },
        {
            title: 'Community Healing',
            description: 'Community + individual healing spaces'
        }
    ];

    return (
        <section className="py-24 bg-white px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Left: Text and Feature Cards */}
                <div>
                    <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">WHAT SETS US APART</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] mb-12">What Makes <span className="text-[#967BB6]">Trika</span> Unique</h2>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {uniqueFeatures.map((feature, index) => {
                            return (
                                <div
                                    key={index}
                                    className="bg-[#F3F0EB] p-6 rounded-lg border border-stone-200"
                                >
                                    <h3 className="font-serif text-lg font-semibold text-[#967BB6] mb-2">{feature.title}</h3>
                                    <p className="text-stone-600 text-sm font-light leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Large Image */}
                <div className="relative">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                        <img
                            src="/assets/images/image39.png"
                            alt="Sound healing session"
                            className="w-full h-full object-cover grayscale-[10%]"
                        />
                        <div className="absolute inset-0 bg-black/5"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatMakesUnique;

