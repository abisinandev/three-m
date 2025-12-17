import type React from "react";
import { StatCard } from "./StatCards";

export const DashboardPreview: React.FC = () => (
  <div className="relative group perspective-[1000px]">
    <div className="relative transition-transform duration-700 group-hover:rotate-y-[6deg] group-hover:rotate-x-[3deg] group-hover:scale-105">
      <div className="absolute -inset-4 bg-teal-green/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      <div className="bg-gradient-to-br from-deep-charcoal via-[#1a1a1a] to-[#111111] rounded-3xl p-1 shadow-2xl border border-cool-white/5">
        <div className="bg-[#0f0f0f] rounded-3xl p-6 sm:p-8 backdrop-blur-xl">

          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#141414] rounded-2xl p-5 sm:p-7 mb-6 border border-cool-white/10 shadow-inner">

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-cool-white flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-green rounded-full animate-pulse" />
                Portfolio Dashboard
              </h3>
              <div className="flex items-center gap-2 bg-teal-green/20 px-3 py-1.5 rounded-full">
                <span className="text-teal-green text-sm font-bold">+24.8%</span>
                <div className="w-2 h-2 bg-teal-green rounded-full animate-ping" />
              </div>
            </div>

            <div className="relative h-40 sm:h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-t from-teal-green/5 via-transparent to-transparent border border-teal-green/20">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 180"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0% " stopColor="#38A169" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#38A169" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <path
                  d="M10 160 Q80 140 120 115 T210 70 T310 50"
                  stroke="#38A169"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  className="draw-line"
                />

                <path
                  d="M10 160 Q80 140 120 115 T210 70 T310 50 L310 180 L10 180 Z"
                  fill="url(#glowGradient)"
                  opacity={0.3}
                />
              </svg>

              <div className="absolute top-4 right-4 bg-teal-green/20 backdrop-blur-md px-4 py-2 rounded-full border border-teal-green/30 shadow-lg">
                <span className="text-teal-green text-lg font-bold">₹4,67,890</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Today's Gain" value="+₹8,240" color="text-teal-green" badge="bg-teal-green/20" />
              <StatCard label="SIP Active" value="12" color="text-electric-orange" badge="bg-electric-orange/20" />
              <StatCard label="AI Score" value="9.2/10" color="text-teal-green" badge="bg-teal-green/20" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111111] rounded-2xl p-1 border border-cool-white/10">
            <div className="bg-[#0a0a0a] rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-teal-green rounded-full" />
                </div>
                <div className="bg-[#1f1f1f] px-4 py-1.5 rounded-full text-xs text-cool-white/60 border border-[#333]">
                  threemapp.com
                </div>
              </div>

              <div className="h-24 sm:h-28 bg-gradient-to-r from-teal-green/5 to-transparent rounded-lg border border-teal-green/20 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-teal-green/20 rounded-lg animate-pulse" />
                    <div className="w-6 h-6 bg-electric-orange/20 rounded animate-pulse delay-300" />
                    <div className="w-7 h-7 bg-teal-green/20 rounded animate-pulse delay-600" />
                  </div>
                  <span className="text-cool-white/80 text-sm font-medium">
                    Advanced Analytics Dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);