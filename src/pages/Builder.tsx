import { useState, useEffect } from 'react';
import ResumePreview from '../components/ResumePreview';
import { AlertCircle, CheckCircle2, Info, Layout, X, Sparkles, ChevronDown, ChevronUp, Trash2, Github, ExternalLink, Loader2, Download, Printer } from 'lucide-react';

const COLORS = [
    { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
    { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
    { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
    { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
    { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' },
];

export default function Builder() {
    const [currentTemplate, setCurrentTemplate] = useState(() => {
        return localStorage.getItem('resumeTemplate') || 'classic';
    });

    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('resumeAccentColor') || 'hsl(168, 60%, 40%)';
    });

    const [isSuggesting, setIsSuggesting] = useState(false);
    const [expandedProjects, setExpandedProjects] = useState<number[]>([0]);
    const [showToast, setShowToast] = useState(false);

    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migrate old skills string to object if necessary
            if (typeof parsed.skills === 'string') {
                parsed.skills = { technical: parsed.skills.split(',').map((s: string) => s.trim()).filter(Boolean), soft: [], tools: [] };
            }
            // Ensure projects have techStack and URLs
            parsed.projects = parsed.projects.map((p: any) => ({
                ...p,
                techStack: p.techStack || [],
                liveUrl: p.liveUrl || '',
                githubUrl: p.githubUrl || ''
            }));
            return parsed;
        }
        return {
            personalInfo: { name: '', email: '', phone: '', location: '' },
            summary: '',
            education: [{ school: '', degree: '', date: '' }],
            experience: [{ company: '', role: '', date: '', description: '' }],
            projects: [{ name: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }],
            skills: { technical: [], soft: [], tools: [] },
            links: { github: '', linkedin: '' }
        };
    });

    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    }, [resumeData]);

    useEffect(() => {
        localStorage.setItem('resumeTemplate', currentTemplate);
    }, [currentTemplate]);

    useEffect(() => {
        localStorage.setItem('resumeAccentColor', accentColor);
    }, [accentColor]);

    const handleDownload = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const calculateScore = () => {
        let score = 0;
        const suggestions: string[] = [];

        // 1. Summary (40–120 words)
        const summaryWords = resumeData.summary.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 15;
        } else {
            suggestions.push("Expand professional summary.");
        }

        // 2. Projects (>= 2)
        const validProjects = resumeData.projects.filter((p: any) => p.name || p.description).length;
        if (validProjects >= 2) {
            score += 10;
        } else {
            suggestions.push("Add at least 2 projects.");
        }

        // 3. Experience (>= 1)
        const validExperience = resumeData.experience.filter((e: any) => e.company || e.role).length;
        if (validExperience >= 1) {
            score += 10;
        } else {
            suggestions.push("Add internship/project work.");
        }

        // 4. Skills (>= 8 across categories)
        const allSkills = [...resumeData.skills.technical, ...resumeData.skills.soft, ...resumeData.skills.tools];
        if (allSkills.length >= 8) {
            score += 10;
        } else {
            suggestions.push("Add more core skills.");
        }

        // 5. Links (GitHub/LinkedIn)
        if (resumeData.links.github || resumeData.links.linkedin) {
            score += 10;
        } else {
            suggestions.push("Add GitHub or LinkedIn links.");
        }

        // 6. Measurable Impact (Numbers in bullets)
        const hasNumbers = [...resumeData.experience, ...resumeData.projects].some((item: any) =>
            /[0-9]+%|[0-9]+k|[0-9]+x|[0-9]+/i.test(item.description || '')
        );
        if (hasNumbers) {
            score += 15;
        } else {
            suggestions.push("Add measurable impact (numbers).");
        }

        // 7. Education Complete
        const eduComplete = resumeData.education.some((e: any) => e.school && e.degree);
        if (eduComplete) {
            score += 10;
        } else {
            suggestions.push("Complete your education section.");
        }

        return {
            total: Math.min(score, 100),
            topImprovements: suggestions.slice(0, 3)
        };
    };

    const { total: score, topImprovements } = calculateScore();

    const loadSampleData = () => {
        setResumeData({
            personalInfo: {
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA'
            },
            summary: 'Strategic product designer with 8+ years of experience building scalable design systems and high-converting user interfaces for Fintech leaders. Proven track record of increasing efficiency by 25% and leading cross-functional teams of 12+ engineers.',
            education: [
                { school: 'Stanford University', degree: 'B.S. in Computer Science', date: '2012 — 2016' }
            ],
            experience: [
                {
                    company: 'Stripe',
                    role: 'Senior Product Designer',
                    date: '2019 — Present',
                    description: 'Led the redesign of the merchant dashboard, increasing conversion by 14% and reducing churn by 5k users monthly.'
                }
            ],
            projects: [
                {
                    name: 'OpenVault',
                    description: 'Built an open-source encryption layer for React. High-performance security for modern web apps.',
                    techStack: ['React', 'TypeScript', 'WebCrypto API'],
                    githubUrl: 'github.com/janedoe/vault',
                    liveUrl: 'vault.janedoe.me'
                }
            ],
            skills: {
                technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
                soft: ['Team Leadership', 'Problem Solving'],
                tools: ['Git', 'Docker', 'AWS']
            },
            links: {
                github: 'github.com/janedoe',
                linkedin: 'linkedin.com/in/janedoe'
            }
        });
    };

    const suggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setResumeData((prev: any) => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'])],
                    soft: [...new Set([...prev.skills.soft, 'Team Leadership', 'Problem Solving'])],
                    tools: [...new Set([...prev.skills.tools, 'Git', 'Docker', 'AWS'])]
                }
            }));
            setIsSuggesting(false);
        }, 1000);
    };

    const updateField = (path: string[], value: any) => {
        const newData = { ...resumeData };
        let current: any = newData;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setResumeData(newData);
    };

    const toggleProject = (index: number) => {
        setExpandedProjects(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const deleteItem = (section: 'education' | 'experience' | 'projects', index: number) => {
        const newData = { ...resumeData };
        newData[section].splice(index, 1);
        setResumeData(newData);
    };

    return (
        <div className="flex h-full">
            <div className="flex-[0.6] overflow-y-auto p-40 border-r border-black/5 bg-white space-y-64">
                <div className="flex items-center justify-between">
                    <h2 className="text-32 font-serif">Resume Details</h2>
                    <button onClick={loadSampleData} className="btn border border-black/10 text-[10px] font-bold uppercase tracking-widest py-8 px-16 hover:bg-black/5">
                        Load Sample Data
                    </button>
                </div>

                <div className="space-y-48 pb-80 max-w-2xl">
                    <Section title="Personal Info">
                        <div className="grid grid-cols-2 gap-24">
                            <Input label="Full Name" value={resumeData.personalInfo.name} onChange={(v) => updateField(['personalInfo', 'name'], v)} />
                            <Input label="Email" value={resumeData.personalInfo.email} onChange={(v) => updateField(['personalInfo', 'email'], v)} />
                            <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(v) => updateField(['personalInfo', 'phone'], v)} />
                            <Input label="Location" value={resumeData.personalInfo.location} onChange={(v) => updateField(['personalInfo', 'location'], v)} />
                        </div>
                    </Section>

                    <Section title="Summary">
                        <Textarea label="Professional Summary" value={resumeData.summary} onChange={(v) => updateField(['summary'], v)} />
                    </Section>

                    <Section title="Education" onAdd={() => updateField(['education'], [...resumeData.education, { school: '', degree: '', date: '' }])}>
                        {resumeData.education.map((item: any, i: number) => (
                            <div key={i} className="grid grid-cols-2 gap-24 p-24 bg-background/50 border border-black/5 relative group">
                                <button onClick={() => deleteItem('education', i)} className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity text-black/20 hover:text-primary"><Trash2 className="w-14 h-14" /></button>
                                <Input label="School" value={item.school} onChange={(v) => {
                                    const edu = [...resumeData.education];
                                    edu[i].school = v;
                                    updateField(['education'], edu);
                                }} />
                                <Input label="Dates" value={item.date} onChange={(v) => {
                                    const edu = [...resumeData.education];
                                    edu[i].date = v;
                                    updateField(['education'], edu);
                                }} />
                                <div className="col-span-2">
                                    <Input label="Degree / Major" value={item.degree} onChange={(v) => {
                                        const edu = [...resumeData.education];
                                        edu[i].degree = v;
                                        updateField(['education'], edu);
                                    }} />
                                </div>
                            </div>
                        ))}
                    </Section>

                    <Section title="Work Experience" onAdd={() => updateField(['experience'], [...resumeData.experience, { company: '', role: '', date: '', description: '' }])}>
                        {resumeData.experience.map((item: any, i: number) => (
                            <div key={i} className="space-y-24 p-24 bg-background/50 border border-black/5 relative group">
                                <button onClick={() => deleteItem('experience', i)} className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity text-black/20 hover:text-primary"><Trash2 className="w-14 h-14" /></button>
                                <div className="grid grid-cols-2 gap-24">
                                    <Input label="Company" value={item.company} onChange={(v) => {
                                        const exp = [...resumeData.experience];
                                        exp[i].company = v;
                                        updateField(['experience'], exp);
                                    }} />
                                    <Input label="Dates" value={item.date} onChange={(v) => {
                                        const exp = [...resumeData.experience];
                                        exp[i].date = v;
                                        updateField(['experience'], exp);
                                    }} />
                                </div>
                                <Input label="Role" value={item.role} onChange={(v) => {
                                    const exp = [...resumeData.experience];
                                    exp[i].role = v;
                                    updateField(['experience'], exp);
                                }} />
                                <Textarea label="Description" value={item.description} onChange={(v) => {
                                    const exp = [...resumeData.experience];
                                    exp[i].description = v;
                                    updateField(['experience'], exp);
                                }} />
                            </div>
                        ))}
                    </Section>

                    <Section title="Projects" onAdd={() => updateField(['projects'], [...resumeData.projects, { name: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }])}>
                        <div className="space-y-12">
                            {resumeData.projects.map((item: any, i: number) => {
                                const isExpanded = expandedProjects.includes(i);
                                return (
                                    <div key={i} className="border border-black/5 bg-background/50 overflow-hidden transition-all">
                                        <div
                                            onClick={() => toggleProject(i)}
                                            className="p-16 flex items-center justify-between cursor-pointer hover:bg-black/[0.02]"
                                        >
                                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black/60">
                                                {item.name || `Project ${i + 1}`}
                                            </h4>
                                            <div className="flex items-center gap-12">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteItem('projects', i); }}
                                                    className="text-black/20 hover:text-primary transition-colors"
                                                >
                                                    <Trash2 className="w-14 h-14" />
                                                </button>
                                                {isExpanded ? <ChevronUp className="w-14 h-14 text-black/20" /> : <ChevronDown className="w-14 h-14 text-black/20" />}
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div className="p-24 pt-0 space-y-24">
                                                <div className="grid grid-cols-2 gap-24">
                                                    <Input label="Project Title" value={item.name} onChange={(v) => {
                                                        const proj = [...resumeData.projects];
                                                        proj[i].name = v;
                                                        updateField(['projects'], proj);
                                                    }} />
                                                    <TagInput label="Tech Stack" tags={item.techStack || []} onTagsChange={(tags) => {
                                                        const proj = [...resumeData.projects];
                                                        proj[i].techStack = tags;
                                                        updateField(['projects'], proj);
                                                    }} />
                                                </div>
                                                <div className="space-y-8">
                                                    <Textarea
                                                        label="Description"
                                                        value={item.description}
                                                        maxLength={200}
                                                        onChange={(v) => {
                                                            const proj = [...resumeData.projects];
                                                            proj[i].description = v;
                                                            updateField(['projects'], proj);
                                                        }}
                                                    />
                                                    <div className="flex justify-end">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/20">
                                                            {(item.description || '').length} / 200
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-24">
                                                    <Input icon={<ExternalLink className="w-12 h-12" />} label="Live URL" value={item.liveUrl} onChange={(v) => {
                                                        const proj = [...resumeData.projects];
                                                        proj[i].liveUrl = v;
                                                        updateField(['projects'], proj);
                                                    }} />
                                                    <Input icon={<Github className="w-12 h-12" />} label="GitHub URL" value={item.githubUrl} onChange={(v) => {
                                                        const proj = [...resumeData.projects];
                                                        proj[i].githubUrl = v;
                                                        updateField(['projects'], proj);
                                                    }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Section>

                    <Section
                        title="Skills"
                        action={
                            <button
                                onClick={suggestSkills}
                                disabled={isSuggesting}
                                className="flex items-center gap-8 text-[10px] font-bold text-primary hover:text-primary/70 uppercase tracking-widest transition-colors disabled:opacity-50"
                            >
                                {isSuggesting ? <Loader2 className="w-12 h-12 animate-spin" /> : <Sparkles className="w-12 h-12" />}
                                Suggest Skills
                            </button>
                        }
                    >
                        <div className="space-y-24">
                            <TagInput
                                label={`Technical Skills (${resumeData.skills.technical.length})`}
                                tags={resumeData.skills.technical}
                                onTagsChange={(tags) => updateField(['skills', 'technical'], tags)}
                            />
                            <TagInput
                                label={`Soft Skills (${resumeData.skills.soft.length})`}
                                tags={resumeData.skills.soft}
                                onTagsChange={(tags) => updateField(['skills', 'soft'], tags)}
                            />
                            <TagInput
                                label={`Tools & Technologies (${resumeData.skills.tools.length})`}
                                tags={resumeData.skills.tools}
                                onTagsChange={(tags) => updateField(['skills', 'tools'], tags)}
                            />
                        </div>
                    </Section>

                    <Section title="Links">
                        <div className="grid grid-cols-2 gap-24">
                            <Input label="GitHub" value={resumeData.links.github} onChange={(v) => updateField(['links', 'github'], v)} />
                            <Input label="LinkedIn" value={resumeData.links.linkedin} onChange={(v) => updateField(['links', 'linkedin'], v)} />
                        </div>
                    </Section>
                </div>
            </div>

            <div className="flex-[0.4] bg-background p-40 overflow-y-auto hidden md:block relative">
                <div className="sticky top-0 space-y-32 scale-[0.9] origin-top">
                    {/* Template Selection */}
                    <div className="space-y-16">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Layout Style</h4>
                        <div className="flex gap-12 overflow-x-auto pb-8 no-scrollbar">
                            {[
                                { id: 'classic', name: 'Classic', icon: 'M4 4h16v2H4zM4 10h16v2H4zM4 16h16v2H4z' },
                                { id: 'modern', name: 'Modern', sidebar: true },
                                { id: 'minimal', name: 'Minimal', clean: true }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setCurrentTemplate(t.id)}
                                    className={`relative flex-shrink-0 w-120 group transition-all ${currentTemplate === t.id ? 'ring-2 ring-primary ring-offset-4' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`aspect-[3/4] rounded-4 border border-black/10 bg-white overflow-hidden p-8 flex gap-4 ${t.id === 'modern' ? 'flex-row' : 'flex-col'}`}>
                                        {t.id === 'modern' && <div className="w-1/3 h-full bg-black/5 rounded-2" />}
                                        <div className="flex-1 space-y-4">
                                            <div className="h-4 bg-black/10 rounded-full w-3/4" />
                                            <div className="h-2 bg-black/5 rounded-full" />
                                            <div className="h-2 bg-black/5 rounded-full w-5/6" />
                                            <div className="pt-8 space-y-2">
                                                <div className="h-2 bg-black/5 rounded-full" />
                                                <div className="h-2 bg-black/5 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="mt-8 block text-[10px] font-bold uppercase tracking-widest">
                                        {t.name}
                                    </span>
                                    {currentTemplate === t.id && (
                                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                            <CheckCircle2 className="w-14 h-14" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Theme Selector */}
                    <div className="space-y-16">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Theme Color</h4>
                        <div className="flex gap-12">
                            {COLORS.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setAccentColor(c.value)}
                                    className={`w-24 h-24 rounded-full transition-all flex items-center justify-center ${accentColor === c.value ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-110'}`}
                                    style={{ backgroundColor: c.value }}
                                >
                                    {accentColor === c.value && <div className="w-4 h-4 bg-white rounded-full" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ATS Readiness Score */}
                    <div className="space-y-16">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">ATS Readiness Score</h4>
                        <div className="bg-white border border-black/5 p-24 space-y-16">
                            <div className="flex items-center justify-between">
                                <span className={`text-40 font-serif ${score > 80 ? 'text-green-600' : score > 50 ? 'text-black' : 'text-primary'}`}>{score}</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-black/20">of 100</span>
                            </div>
                            <div className="h-4 bg-black/5"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${score}%` }} /></div>
                            {topImprovements.length > 0 && (
                                <div className="border-t border-black/5 pt-16 space-y-12">
                                    <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-black/30"><AlertCircle className="w-12 h-12" /> Top 3 Improvements</div>
                                    <ul className="space-y-8">
                                        {topImprovements.map((hint, i) => (
                                            <li key={hint} className="text-[11px] text-black/60 flex items-start gap-8">
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">{i + 1}</div>
                                                {hint}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-16">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Live Preview</h4>
                        <div className="flex gap-12 pb-16">
                            <button onClick={handleDownload} className="flex-1 btn bg-black text-white py-12 px-16 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-8 hover:bg-black/80 transition-all">
                                <Download className="w-14 h-14" /> Download PDF
                            </button>
                            <button onClick={() => window.print()} className="btn border border-black/10 py-12 px-16 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-8 hover:bg-black/5 transition-all">
                                <Printer className="w-14 h-14" /> Print
                            </button>
                        </div>
                        <div className="bg-white shadow-2xl p-40 min-h-[800px] scale-[0.8] origin-top border border-black/5 pointer-events-none">
                            <ResumePreview data={resumeData} template={currentTemplate} accentColor={accentColor} />
                        </div>
                    </div>
                </div>

                {/* Toast Notification */}
                {showToast && (
                    <div className="fixed bottom-40 right-40 bg-black text-white px-24 py-16 rounded-12 shadow-2xl flex items-center gap-12 animate-in fade-in slide-in-from-bottom-20 duration-300">
                        <CheckCircle2 className="w-20 h-20 text-green-400" />
                        <span className="text-12 font-bold uppercase tracking-widest">PDF export ready! Check your downloads.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, children, onAdd, action }: { title: string, children: React.ReactNode, onAdd?: () => void, action?: React.ReactNode }) {
    return (
        <div className="space-y-32">
            <div className="flex items-center justify-between border-b border-black/5 pb-12">
                <h3 className="text-12 font-bold uppercase tracking-[0.2em] text-black/40">{title}</h3>
                {onAdd && <button onClick={onAdd} className="text-[10px] font-bold text-primary hover:text-primary/70 uppercase tracking-widest transition-colors">+ Add Entry</button>}
                {action}
            </div>
            <div className="space-y-24">{children}</div>
        </div>
    );
}

function TagInput({ label, tags, onTagsChange }: { label: string, tags: string[], onTagsChange: (tags: string[]) => void }) {
    const [input, setInput] = useState('');

    const handleKeydown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                onTagsChange([...tags, input.trim()]);
            }
            setInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(t => t !== tagToRemove));
    };

    return (
        <div className="space-y-12">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/30">{label}</label>
            <div className="space-y-8">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeydown}
                    placeholder="Type and press Enter..."
                    className="w-full p-12 bg-background border border-black/5 text-sm focus:outline-none focus:border-primary/20 transition-colors"
                />
                <div className="flex flex-wrap gap-6 pt-4">
                    {tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-6 px-10 py-4 bg-black text-white text-[9px] font-bold uppercase tracking-widest">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-primary transition-colors">
                                <X className="w-10 h-10" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange, placeholder, icon, maxLength }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, icon?: React.ReactNode, maxLength?: number }) {
    return (
        <div className="space-y-8">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/30 flex items-center gap-6">
                {icon && <span>{icon}</span>}
                {label}
            </label>
            <input
                type="text"
                value={value}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-12 bg-background border border-black/5 text-sm focus:outline-none focus:border-primary/20 transition-colors"
            />
        </div>
    );
}

function Textarea({ label, value, onChange, maxLength }: { label: string, value: string, onChange: (v: string) => void, maxLength?: number }) {
    return (
        <div className="space-y-8">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/30">{label}</label>
            <textarea
                rows={3}
                value={value}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-12 bg-background border border-black/5 text-sm focus:outline-none focus:border-primary/20 resize-none font-sans transition-colors"
            />
        </div>
    );
}
