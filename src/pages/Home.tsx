import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-24 text-center">
            <div className="max-w-3xl space-y-32">
                <div className="space-y-16">
                    <h2 className="text-16 font-serif italic text-primary">KodNest Premium</h2>
                    <h1 className="text-56 md:text-80 font-serif leading-tight text-text">
                        Build a Resume <br /> That Gets Read.
                    </h1>
                    <p className="text-18 text-black/40 font-sans mx-auto pt-16">
                        A calm, intentional builder for high-stakes career moves.
                        No distractions, just extreme clarity.
                    </p>
                </div>

                <div className="pt-24">
                    <Link
                        to="/builder"
                        className="btn btn-primary text-14 py-16 px-40 tracking-widest uppercase font-bold"
                    >
                        Start Building
                    </Link>
                </div>
            </div>

            <footer className="absolute bottom-40 text-[10px] uppercase tracking-[0.3em] text-black/20 font-bold">
                Precision & Clarity — KodNest Project 3
            </footer>
        </div>
    );
}
