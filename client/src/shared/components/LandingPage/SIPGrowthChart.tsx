export const SIPGrowthChart: React.FC = () => {
  return (
    <div className="rounded-2xl p-8 border border-cool-white/20 animate-fade-in">
      <h5 className="text-lg font-semibold mb-6 text-center">SIP Growth Projection</h5>
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 400 250">
          <defs>
            <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 25"
                fill="none"
                stroke="#2D3748"
                strokeWidth="1"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path
            d="M40 200 Q100 180 160 140 Q220 100 280 60 Q340 30 360 20"
            stroke="#38A169"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="hover:stroke-teal-green/80 transition-colors duration-200"
          />
          <path
            d="M40 200 L360 180"
            stroke="#FF9800"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            className="hover:stroke-electric-orange/80 transition-colors duration-200"
          />
          <circle cx="40" cy="200" r="4" fill="#38A169" className="hover:fill-teal-green/80" />
          <circle cx="160" cy="140" r="4" fill="#38A169" className="hover:fill-teal-green/80" />
          <circle cx="280" cy="60" r="4" fill="#38A169" className="hover:fill-teal-green/80" />
          <circle cx="360" cy="20" r="4" fill="#38A169" className="hover:fill-teal-green/80" />
          <text x="40" y="220" fill="#E2E8F0" textAnchor="middle" fontSize="12">
            Year 1
          </text>
          <text x="160" y="220" fill="#E2E8F0" textAnchor="middle" fontSize="12">
            Year 5
          </text>
          <text x="280" y="220" fill="#E2E8F0" textAnchor="middle" fontSize="12">
            Year 10
          </text>
          <text x="360" y="220" fill="#E2E8F0" textAnchor="middle" fontSize="12">
            Year 15
          </text>
          <text x="370" y="25" fill="#38A169" fontSize="14" fontWeight="bold">
            ₹47L
          </text>
          <text x="370" y="185" fill="#FF9800" fontSize="12">
            ₹18L Invested
          </text>
        </svg>
      </div>
      <div className="mt-4 text-center">
        <p className="text-cool-white/60 text-sm">
          Monthly SIP: ₹10,000 | Expected Return: 12% p.a.
        </p>
        <p className="text-teal-green font-semibold mt-2">
          Compound Interest Magic: ₹29L Extra Wealth
        </p>
      </div>
    </div>
  );
};