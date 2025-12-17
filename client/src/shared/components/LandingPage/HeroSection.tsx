import type React from "react";
import { DashboardPreview } from "./DashboardPreview";

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">

          <div className="space-y-7 lg:space-y-9 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-cool-white">
              Achieve <span className="text-teal-green">Financial Freedom</span>:<br className="hidden lg:inline" />
              Make, Manage, and <span className="text-teal-green">Multiply</span> Your Money
            </h1>

            <p className="text-base sm:text-lg text-cool-white/80 leading-relaxed max-w-xl">
              The all-in-one FinTech platform powered by <span className="text-teal-green font-semibold">AI</span> and <span className="text-teal-green font-semibold">Blockchain</span> to simplify budgeting, track expenses, and automate investments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative overflow-hidden bg-teal-green text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-teal-green90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-green25">
                <span className="relative z-10">Sign Up Free in 30 Seconds</span>
                <div className="absolute inset-0 bg-white20 translate-y-full group-hover:translate-y-0 ease-out duration-300"></div>
              </button>
              <button className="group border border-[#393939] text-cool-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:border-teal-green hover:text-teal-green transition-all duration-300 flex items-center justify-center gap-2">
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