import React from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@shared/constants/apiRoutes";

interface HeaderProps {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navigate = useNavigate();

  return (
    <header
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        border-b border-[#2e2e2e]  /* Always show subtle bottom border */
        ${scrolled
          ? "bg-deep-charcoal/90 backdrop-blur-md"
          : "bg-deep-charcoal/80"
        }
      `}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Brand */}
          <div className="text-xl md:text-2xl font-bold tracking-tight text-cool-white">
            three<span className="text-teal-green">M</span>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center space-x-8 text-sm"
            aria-label="Primary navigation"
          >
            {["Features", "Products", "Pricing", "Support"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-cool-white/80 hover:text-teal-green transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate({ to: ROUTES.AUTH.LOGIN })}
              className="text-teal-green hover:text-teal-green/80 font-medium transition-colors duration-200 text-sm"
            >
              Log In
            </button>
            <button
              onClick={() => navigate({ to: ROUTES.AUTH.SIGNUP.ROOT })}
              className="bg-teal-green text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-green/90 transition-transform duration-200 hover:scale-105 text-sm"
            >
              Start Free
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-cool-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-deep-charcoal border-t border-[#2e2e2e] animate-slide-down">
          <div className="px-4 py-5 space-y-4 text-sm">
            {["Features", "Products", "Pricing", "Support"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-cool-white/80 hover:text-teal-green transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}

            <hr className="border-[#2e2e2e]" />

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ to: ROUTES.AUTH.LOGIN });
              }}
              className="w-full text-teal-green hover:text-teal-green/80 py-2 font-medium transition-colors duration-200"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ to: ROUTES.AUTH.SIGNUP.ROOT });
              }}
              className="w-full bg-teal-green text-deep-charcoal py-2 rounded-lg font-semibold hover:bg-teal-green/90 transition-transform duration-200"
            >
              Start Free
            </button>
          </div>
        </div>
      )}
    </header>
  );
};