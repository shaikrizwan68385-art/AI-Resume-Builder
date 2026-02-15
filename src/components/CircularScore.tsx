import React from 'react';

interface CircularScoreProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
    score,
    size = 120,
    strokeWidth = 8
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score <= 40) return '#ef4444'; // Red
        if (score <= 70) return '#f59e0b'; // Amber
        return '#22c55e'; // Green
    };

    const getStatus = () => {
        if (score <= 40) return 'Needs Work';
        if (score <= 70) return 'Getting There';
        return 'Strong Resume';
    };

    const color = getColor();

    return (
        <div className="flex flex-col items-center gap-12">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-black/5"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        style={{
                            strokeDashoffset: offset,
                            transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease-in-out'
                        }}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-24 font-black tracking-tighter" style={{ color }}>
                        {score}
                    </span>
                    <span className="text-[8px] uppercase font-bold tracking-widest text-black/20">
                        Score
                    </span>
                </div>
            </div>
            <div
                className="px-12 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-500"
                style={{
                    color: color,
                    borderColor: `${color}44`,
                    backgroundColor: `${color}08`
                }}
            >
                {getStatus()}
            </div>
        </div>
    );
};
