export interface ScoreResult {
    score: number;
    suggestions: string[];
}

const ACTION_VERBS = [
    'built', 'led', 'designed', 'improved', 'developed',
    'implemented', 'managed', 'created', 'orchestrated',
    'optimized', 'resolved', 'mentored', 'scaled', 'launched'
];

export const calculateATSScore = (data: any): ScoreResult => {
    let score = 0;
    const suggestions: string[] = [];

    // 1. Name (+10)
    if (data?.personalInfo?.name) score += 10;
    else suggestions.push('Add your full name (+10)');

    // 2. Email (+10)
    if (data?.personalInfo?.email) score += 10;
    else suggestions.push('Add a professional email (+10)');

    // 3. Summary > 50 chars (+10)
    if (data?.summary?.length > 50) score += 10;
    else suggestions.push('Write a professional summary > 50 characters (+10)');

    // 4. Experience with bullets (+15)
    const hasBullets = data?.experience?.some((exp: any) =>
        exp.description?.includes('•') || exp.description?.includes('-') || exp.description?.includes('*')
    );
    if (hasBullets) score += 15;
    else suggestions.push('Use bullet points in your experience descriptions (+15)');

    // 5. Education (+10)
    const hasEducation = data?.education?.some((edu: any) => edu.school && edu.degree);
    if (hasEducation) score += 10;
    else suggestions.push('Add your education details (+10)');

    // 6. 5+ Skills (+10)
    let totalSkills = 0;
    if (typeof data?.skills === 'string') {
        totalSkills = data.skills.split(',').filter((s: string) => s.trim()).length;
    } else if (typeof data?.skills === 'object') {
        totalSkills = Object.values(data.skills).flat().filter(Boolean).length;
    }
    if (totalSkills >= 5) score += 10;
    else suggestions.push('Add at least 5 professional skills (+10)');

    // 7. 1+ Project (+10)
    const hasProject = data?.projects?.some((proj: any) => proj.name);
    if (hasProject) score += 10;
    else suggestions.push('Add at least one project (+10)');

    // 8. Phone (+5)
    if (data?.personalInfo?.phone) score += 5;
    else suggestions.push('Add your phone number (+5)');

    // 9. LinkedIn (+5)
    if (data?.links?.linkedin) score += 5;
    else suggestions.push('Add your LinkedIn profile (+5)');

    // 10. GitHub (+5)
    if (data?.links?.github) score += 5;
    else suggestions.push('Add your GitHub profile (+5)');

    // 11. Action Verbs (+10)
    const hasVerbs = ACTION_VERBS.some(v => data?.summary?.toLowerCase().includes(v));
    if (hasVerbs) score += 10;
    else suggestions.push('Use powerful action verbs in your summary (e.g., Led, Built, Optimized) (+10)');

    return {
        score: Math.min(score, 100),
        suggestions: suggestions.slice(0, 3) // Show top 3 improvements
    };
};
