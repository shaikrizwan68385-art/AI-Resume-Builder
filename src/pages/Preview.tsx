import { useState, useEffect } from 'react';
import ResumePreview from '../components/ResumePreview';
import { Printer, Copy, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Preview() {
    const [resumeData, setResumeData] = useState<any>(null);
    const [currentTemplate, setCurrentTemplate] = useState(() => {
        return localStorage.getItem('resumeTemplate') || 'classic';
    });
    const [copyStatus, setCopyStatus] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            setResumeData(JSON.parse(savedData));
        }

        const savedTemplate = localStorage.getItem('resumeTemplate');
        if (savedTemplate) {
            setCurrentTemplate(savedTemplate);
        }
    }, []);

    const handleTemplateChange = (template: string) => {
        setCurrentTemplate(template);
        localStorage.setItem('resumeTemplate', template);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopyAsText = () => {
        if (!resumeData) return;

        const text = `
${resumeData.personalInfo.name || 'Your Name'}
${resumeData.personalInfo.email || ''} | ${resumeData.personalInfo.phone || ''} | ${resumeData.personalInfo.location || ''}
${resumeData.links.github ? 'GitHub: ' + resumeData.links.github : ''}
${resumeData.links.linkedin ? 'LinkedIn: ' + resumeData.links.linkedin : ''}

SUMMARY
${resumeData.summary || ''}

EXPERIENCE
${resumeData.experience.map((exp: any) => `
${exp.company} | ${exp.role} | ${exp.date}
${exp.description}
`).join('\n')}

PROJECTS
${resumeData.projects.map((proj: any) => `
${proj.name} | ${proj.link}
${proj.description}
`).join('\n')}

EDUCATION
${resumeData.education.map((edu: any) => `
${edu.school} | ${edu.degree} | ${edu.date}
`).join('\n')}

SKILLS
${resumeData.skills || ''}
        `.trim();

        navigator.clipboard.writeText(text);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
    };

    const isDataIncomplete = () => {
        if (!resumeData) return true;
        const noName = !resumeData.personalInfo.name;
        const noExpOrProj = resumeData.experience.every((e: any) => !e.company) &&
            resumeData.projects.every((p: any) => !p.name);
        return noName || noExpOrProj;
    };

    const sample = {
        personalInfo: {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA'
        },
        summary: 'Strategic product designer with 8+ years of experience building scalable design systems and high-converting user interfaces for Fintech leaders.',
        education: [
            { school: 'Stanford University', degree: 'B.S. in Computer Science', date: '2012 — 2016' }
        ],
        experience: [
            {
                company: 'Stripe',
                role: 'Senior Product Designer',
                date: '2019 — Present',
                description: 'Led the redesign of the merchant dashboard, increasing conversion by 14%.'
            }
        ],
        projects: [
            { name: 'OpenVault', link: 'github.com/janedoe/vault', description: 'Simplified encryption layer for React applications.' }
        ],
        skills: 'React, TypeScript, Figma, System Design, GraphQL, UI/UX Engineering',
        links: {
            github: 'github.com/janedoe',
            linkedin: 'linkedin.com/in/janedoe'
        }
    };

    return (
        <div className="min-h-full bg-background py-80 px-24 space-y-40">
            {/* Top Bar for Actions */}
            <div className="max-w-[800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-24 no-print">
                {/* Template Selection Tabs */}
                <div className="flex gap-8 bg-white p-4 border border-black/5 shadow-sm w-full md:w-auto">
                    {['classic', 'modern', 'minimal'].map((t) => (
                        <button
                            key={t}
                            onClick={() => handleTemplateChange(t)}
                            className={`flex-1 px-16 py-12 text-[10px] font-bold uppercase tracking-widest transition-all ${currentTemplate === t ? 'bg-black text-white' : 'hover:bg-black/5 text-black/40'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex gap-12 w-full md:w-auto">
                    <button
                        onClick={handleCopyAsText}
                        className="flex-1 md:flex-none flex items-center justify-center gap-8 px-24 py-12 bg-white border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all text-black/60"
                    >
                        {copyStatus ? <CheckCircle className="w-14 h-14" /> : <Copy className="w-14 h-14" />}
                        {copyStatus ? 'Copied' : 'Copy Text'}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 md:flex-none flex items-center justify-center gap-8 px-24 py-12 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all shadow-xl shadow-black/10"
                    >
                        <Printer className="w-14 h-14" />
                        Print / PDF
                    </button>
                </div>
            </div>

            {/* Incomplete Warning */}
            {isDataIncomplete() && (
                <div className="max-w-[800px] mx-auto bg-amber-50 border border-amber-200 p-16 flex items-center gap-12 text-amber-800 no-print">
                    <AlertTriangle className="w-16 h-16 flex-shrink-0" />
                    <p className="text-12 font-medium">Your resume may look incomplete. Check your Name, Experience, or Projects.</p>
                </div>
            )}

            <div className="max-w-[800px] mx-auto bg-white shadow-sm border border-black/5 p-80 min-h-[1100px] origin-top print:shadow-none print:border-none print:p-0">
                <ResumePreview data={resumeData || sample} template={currentTemplate} />
            </div>

            <div className="max-w-[800px] mx-auto mt-40 text-center no-print">
                <p className="text-[10px] uppercase tracking-widest text-black/20 font-bold">
                    Premium Black & White Layout — {currentTemplate.toUpperCase()} Style
                </p>
            </div>
        </div>
    );
}
