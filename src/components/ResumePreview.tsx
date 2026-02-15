import { Github, ExternalLink, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function ResumePreview({ data, template = 'classic', accentColor = 'hsl(168, 60%, 40%)' }: { data: any, template?: string, accentColor?: string }) {
    if (!data) return null;

    const hasPersonalInfo = data.personalInfo.name || data.personalInfo.email || data.personalInfo.phone || data.personalInfo.location;
    const hasLinks = data.links.github || data.links.linkedin;
    const hasEducation = data.education.some((edu: any) => edu.school || edu.degree);
    const hasExperience = data.experience.some((exp: any) => exp.company || exp.role || exp.description);

    // Skills check for new object structure or fallback to old string
    const skills = typeof data.skills === 'string' ? { technical: data.skills.split(',').map((s: string) => s.trim()).filter(Boolean), soft: [], tools: [] } : data.skills;
    const hasSkills = (skills.technical?.length > 0) || (skills.soft?.length > 0) || (skills.tools?.length > 0);

    const hasProjects = data.projects.some((proj: any) => proj.name || proj.description);

    const SectionTitle = ({ title }: { title: string }) => {
        if (template === 'minimal') {
            return <h3 className="text-10 font-black uppercase tracking-[0.3em] bg-black text-white px-8 py-2 inline-block mb-12">{title}</h3>;
        }
        if (template === 'modern') {
            return <h3 className="text-14 font-bold uppercase tracking-widest border-b pb-4 mb-16" style={{ color: accentColor, borderColor: `${accentColor}33` }}>{title}</h3>;
        }
        // Classic
        return (
            <div className="flex items-center gap-16 mb-12">
                <h3 className="text-12 font-bold uppercase tracking-[0.2em] flex-shrink-0" style={{ color: accentColor }}>{title}</h3>
                <div className="h-1 flex-1 bg-black/5" />
            </div>
        );
    };

    const renderClassic = () => (
        <div className="font-serif space-y-32">
            <header className="text-center space-y-12 border-b pb-24" style={{ borderColor: accentColor }}>
                <h1 className="text-40 font-black tracking-tight" style={{ color: accentColor }}>{data.personalInfo.name || 'Your Name'}</h1>
                <div className="flex flex-wrap justify-center gap-x-16 gap-y-4 text-[10px] font-bold uppercase tracking-widest text-black/50 font-sans">
                    {data.personalInfo.email && <span className="flex items-center gap-4"><Mail className="w-10 h-10" /> {data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span className="flex items-center gap-4"><Phone className="w-10 h-10" /> {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span className="flex items-center gap-4"><MapPin className="w-10 h-10" /> {data.personalInfo.location}</span>}
                </div>
            </header>

            {data.summary && (
                <section>
                    <SectionTitle title="Summary" />
                    <p className="text-12 leading-relaxed text-black/70 font-sans">{data.summary}</p>
                </section>
            )}

            {hasExperience && (
                <section>
                    <SectionTitle title="Experience" />
                    <div className="space-y-24">
                        {data.experience.map((exp: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-baseline font-sans">
                                    <h4 className="text-14 font-black uppercase tracking-tight">{exp.company}</h4>
                                    <span className="text-10 font-bold text-black/30">{exp.date}</span>
                                </div>
                                <p className="text-12 font-bold italic" style={{ color: accentColor }}>{exp.role}</p>
                                <p className="text-11 leading-relaxed text-black/60 font-sans">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hasProjects && (
                <section>
                    <SectionTitle title="Projects" />
                    <div className="space-y-16">
                        {data.projects.map((proj: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-baseline font-sans">
                                    <div className="flex items-center gap-8">
                                        <h4 className="text-13 font-black uppercase tracking-tight">{proj.name}</h4>
                                        {proj.techStack?.length > 0 && <span className="text-[9px] text-black/30 font-bold uppercase">• {proj.techStack.join(', ')}</span>}
                                    </div>
                                    <div className="flex gap-8">
                                        {proj.githubUrl && <Github className="w-12 h-12 text-black/20" />}
                                        {proj.liveUrl && <ExternalLink className="w-12 h-12 text-black/20" />}
                                    </div>
                                </div>
                                <p className="text-11 leading-relaxed text-black/60 font-sans">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hasEducation && (
                <section>
                    <SectionTitle title="Education" />
                    <div className="space-y-12">
                        {data.education.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between items-baseline font-sans">
                                <div>
                                    <h4 className="text-13 font-black uppercase tracking-tight">{edu.school}</h4>
                                    <p className="text-11 text-black/60">{edu.degree}</p>
                                </div>
                                <span className="text-10 font-bold text-black/30">{edu.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hasSkills && (
                <section>
                    <SectionTitle title="Skills" />
                    <div className="flex flex-wrap gap-x-24 gap-y-8 font-sans">
                        {Object.entries(skills).map(([key, list]: [string, any]) => list.length > 0 && (
                            <div key={key} className="flex gap-8">
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/30 w-80">{key}:</span>
                                <span className="text-10 font-bold text-black/70">{list.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );

    const renderModern = () => (
        <div className="font-sans flex gap-32 h-full -m-40">
            <aside className="w-[30%] text-white p-32 space-y-32 h-auto shrink-0" style={{ backgroundColor: accentColor }}>
                <div className="space-y-8">
                    <h1 className="text-24 font-black leading-tight">{data.personalInfo.name || 'Your Name'}</h1>
                    <p className="text-10 font-bold uppercase tracking-[0.2em] opacity-80">{data.experience[0]?.role || 'Professional'}</p>
                </div>

                <div className="space-y-16 text-[10px] font-medium opacity-90 leading-relaxed">
                    <h5 className="text-[9px] font-black uppercase tracking-widest border-b border-white/20 pb-4">Contact</h5>
                    {data.personalInfo.email && <p className="flex items-center gap-8"><Mail className="w-10 h-10" /> {data.personalInfo.email}</p>}
                    {data.personalInfo.phone && <p className="flex items-center gap-8"><Phone className="w-10 h-10" /> {data.personalInfo.phone}</p>}
                    {data.personalInfo.location && <p className="flex items-center gap-8"><MapPin className="w-10 h-10" /> {data.personalInfo.location}</p>}
                </div>

                {hasSkills && (
                    <div className="space-y-24">
                        <h5 className="text-[9px] font-black uppercase tracking-widest border-b border-white/20 pb-4">Expertise</h5>
                        {Object.entries(skills).map(([key, list]: [string, any]) => list.length > 0 && (
                            <div key={key} className="space-y-8">
                                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">{key}</p>
                                <div className="flex flex-wrap gap-4">
                                    {list.map((s: string, idx: number) => (
                                        <span key={idx} className="px-6 py-2 bg-white/10 rounded-2 text-[9px] font-bold uppercase">{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </aside>

            <main className="flex-1 p-32 space-y-32 bg-white overflow-hidden">
                {data.summary && (
                    <section>
                        <SectionTitle title="Summary" />
                        <p className="text-12 leading-relaxed text-black/70">{data.summary}</p>
                    </section>
                )}

                {hasExperience && (
                    <section>
                        <SectionTitle title="Experience" />
                        <div className="space-y-24">
                            {data.experience.map((exp: any, i: number) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="text-14 font-black">{exp.company}</h4>
                                        <span className="text-10 font-bold text-black/30 uppercase">{exp.date}</span>
                                    </div>
                                    <p className="text-11 font-bold uppercase tracking-widest" style={{ color: accentColor }}>{exp.role}</p>
                                    <p className="text-11 leading-relaxed text-black/60">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {hasProjects && (
                    <section>
                        <SectionTitle title="Projects" />
                        <div className="grid grid-cols-1 gap-16">
                            {data.projects.map((proj: any, i: number) => (
                                <div key={i} className="space-y-4 p-12 bg-black/[0.02] border-l-2" style={{ borderColor: accentColor }}>
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-12 font-black uppercase">{proj.name}</h4>
                                        <div className="flex gap-8">
                                            {proj.githubUrl && <Github className="w-12 h-12 text-black/10" />}
                                            {proj.liveUrl && <ExternalLink className="w-12 h-12 text-black/10" />}
                                        </div>
                                    </div>
                                    <p className="text-11 text-black/60 leading-relaxed">{proj.description}</p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        {proj.techStack?.map((t: string, idx: number) => (
                                            <span key={idx} className="text-[8px] font-bold uppercase px-6 py-2 bg-black/5 rounded-2">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {hasEducation && (
                    <section>
                        <SectionTitle title="Education" />
                        <div className="space-y-16">
                            {data.education.map((edu: any, i: number) => (
                                <div key={i} className="flex justify-between items-baseline">
                                    <div>
                                        <h4 className="text-13 font-black">{edu.school}</h4>
                                        <p className="text-11 text-black/60 uppercase tracking-widest">{edu.degree}</p>
                                    </div>
                                    <span className="text-10 font-bold text-black/30 uppercase">{edu.date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );

    const renderMinimal = () => (
        <div className="font-sans space-y-32 p-16">
            <header className="space-y-12">
                <h1 className="text-48 font-black tracking-tighter leading-none" style={{ color: accentColor }}>{data.personalInfo.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-16 text-[10px] font-bold uppercase tracking-widest text-black/30">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </header>

            {data.summary && (
                <section className="max-w-[85%]">
                    <p className="text-14 leading-relaxed text-black/70 italic border-l-2 pl-24" style={{ borderColor: accentColor }}>{data.summary}</p>
                </section>
            )}

            {hasExperience && (
                <section className="space-y-16">
                    <SectionTitle title="Experience" />
                    <div className="space-y-24">
                        {data.experience.map((exp: any, i: number) => (
                            <div key={i} className="grid grid-cols-[120px,1fr] gap-24">
                                <span className="text-10 font-bold uppercase tracking-widest text-black/30 mt-4">{exp.date}</span>
                                <div className="space-y-4">
                                    <h4 className="text-14 font-black">{exp.company}</h4>
                                    <p className="text-11 font-bold opacity-60 uppercase tracking-widest leading-none">{exp.role}</p>
                                    <p className="text-12 leading-relaxed text-black/60 pt-4">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hasProjects && (
                <section className="space-y-16">
                    <SectionTitle title="Projects" />
                    <div className="space-y-24">
                        {data.projects.map((proj: any, i: number) => (
                            <div key={i} className="grid grid-cols-[120px,1fr] gap-24">
                                <div className="flex flex-col gap-4">
                                    <span className="text-10 font-black uppercase tracking-widest" style={{ color: accentColor }}>Project</span>
                                    <div className="flex gap-8">
                                        {proj.githubUrl && <Github className="w-12 h-12 text-black/20" />}
                                        {proj.liveUrl && <ExternalLink className="w-12 h-12 text-black/20" />}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-14 font-black">{proj.name}</h4>
                                    <p className="text-12 leading-relaxed text-black/60">{proj.description}</p>
                                    {proj.techStack?.length > 0 && (
                                        <div className="flex flex-wrap gap-8 pt-4">
                                            {proj.techStack.map((t: string, idx: number) => (
                                                <span key={idx} className="text-[10px] font-bold text-black/40 uppercase">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hasEducation && (
                <section className="space-y-16">
                    <SectionTitle title="Education" />
                    <div className="space-y-16">
                        {data.education.map((edu: any, i: number) => (
                            <div key={i} className="grid grid-cols-[120px,1fr] gap-24">
                                <span className="text-10 font-bold uppercase tracking-widest text-black/30 mt-4">{edu.date}</span>
                                <div>
                                    <h4 className="text-14 font-black">{edu.school}</h4>
                                    <p className="text-11 text-black/60 uppercase tracking-widest">{edu.degree}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hasSkills && (
                <section className="space-y-16">
                    <SectionTitle title="Skills" />
                    <div className="grid grid-cols-[120px,1fr] gap-24">
                        {Object.entries(skills).map(([key, list]: [string, any]) => list.length > 0 && (
                            <div key={key} className="contents">
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/30 mt-4">{key}</span>
                                <div className="flex flex-wrap gap-8">
                                    {list.map((s: string, idx: number) => (
                                        <span key={idx} className="text-11 font-bold">{s}{idx < list.length - 1 ? '•' : ''}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );

    return (
        <div className="w-full h-full">
            {template === 'modern' ? renderModern() : template === 'minimal' ? renderMinimal() : renderClassic()}
        </div>
    );
}
