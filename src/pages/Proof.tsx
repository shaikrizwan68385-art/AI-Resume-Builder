import { Info } from 'lucide-react';

export default function Proof() {
    return (
        <div className="h-full bg-background p-40 flex items-center justify-center">
            <div className="max-w-md w-full card space-y-24 text-center py-64">
                <div className="w-64 h-64 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                    <Info className="w-32 h-32 text-primary" />
                </div>
                <div className="space-y-8">
                    <h3 className="text-24 font-serif">Proof of Build</h3>
                    <p className="text-sm text-black/40">
                        This section is a placeholder for your build artifacts, links, and deployment proofs.
                    </p>
                </div>
                <div className="pt-16">
                    <div className="p-24 border-2 border-dashed border-black/5 rounded bg-black/[0.01]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">
                            Artifact System Offline
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
