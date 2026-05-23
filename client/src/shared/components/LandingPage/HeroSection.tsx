import type React from "react";
import { DashboardPreview } from "./DashboardPreview";

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">

          <div className="space-y-7 lg:space-y-9 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-cool-white">
              The <span className="text-teal-green">Three-M</span> Philosophy:<br className="hidden lg:inline" />
              <span className="text-teal-green">Make</span>, <span className="text-teal-green">Manage</span>, and <span className="text-teal-green">Multiply</span> Your Wealth
            </h1>

            <p className="text-sm sm:text-base text-cool-white/80 leading-relaxed max-w-xl">
              A production-grade algorithmic trading and portfolio management platform. Leverage <span className="text-teal-green font-semibold">WebSocket-driven</span> real-time data, advanced analytics, and automated SIP engines to build wealth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative overflow-hidden bg-teal-green text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-teal-green90 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-teal-green25">
                <span className="relative z-10">Sign Up Free in 30 Seconds</span>
                <div className="absolute inset-0 bg-white20 translate-y-full group-hover:translate-y-0 ease-out duration-300"></div>
              </button>
              <button className="group border border-[#393939] text-cool-white px-6 py-2.5 rounded-lg font-medium text-sm hover:border-teal-green hover:text-teal-green transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:fill-teal-green transition-colors" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative animate-fade-in animation-delay-300">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-teal-green10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-green5 rounded-full blur-3xl -z-10 animate-pulse animation-delay-1000"></div>
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};