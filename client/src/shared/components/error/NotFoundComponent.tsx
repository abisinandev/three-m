import { useNavigate } from '@tanstack/react-router';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { ROUTES } from '@shared/constants/apiRoutes';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-[#e8eaed] font-sans text-center p-6 relative overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] rounded-full z-0" />

            <div className="relative z-10 flex flex-col items-center">

                <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Ghost size={48} className="text-[#5a5f6e]" strokeWidth={1.5} />
                </div>

                <h1 className="text-7xl font-extrabold m-0 leading-none bg-gradient-to-b from-[#e8eaed] to-[#5a5f6e] bg-clip-text text-transparent tracking-tighter">
                    404
                </h1>

                <h2 className="text-xl font-semibold mt-3 mb-1 text-[#e8eaed]">
                    Page not found
                </h2>

                <p className="text-sm text-[#5a5f6e] max-w-[320px] mx-auto mb-8 leading-relaxed">
                    The page you are looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-transparent border border-[#1e2025] text-[#e8eaed] text-sm font-semibold cursor-pointer transition-all hover:bg-[#16181c] hover:border-[#272b33]"
                    >
                        <ArrowLeft size={14} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate({ to: ROUTES.USER.HOME })}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e8eaed] border-none text-[#0a0b0d] text-sm font-semibold cursor-pointer transition-all hover:scale-105 hover:bg-white shadow-lg shadow-black/20"
                    >
                        <Home size={14} />
                        Return Home
                    </button>
                </div>
            </div>

            <div className="absolute bottom-2 text-[10px] text-[#272b33] tracking-[0.1em] uppercase font-bold">
                Three-M Ecosystem
            </div>
        </div>
    );
};

export default NotFoundPage;