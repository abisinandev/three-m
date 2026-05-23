export const FinalCTA: React.FC = () => {
  return (
    <section className="mt-7 py-12 px-4 sm:px-6 lg:px-8  text-center rounded-2xl border border-white/5">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight">
          Ready to Master Your{" "}
          <span className="text-teal-green">Financial Future</span>?
        </h2>

        <p className="text-sm text-cool-white/80 mb-6">
          Join over 1M+ users growing wealth with AI-powered insights and bank-level security.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-teal-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-teal-green/90 transition-all duration-200 transform hover:scale-105">
            Start Free
          </button>
          <button className="border border-teal-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-teal-green hover:text-deep-charcoal transition-colors duration-200">
            Book a Demo
          </button>
        </div>

        <p className="text-cool-white/60 text-xs mt-5">
          No credit card required • Setup in under 2 minutes
        </p>
      </div>
    </section>
  );
};
