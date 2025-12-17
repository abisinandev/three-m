import React, { useState, useEffect } from 'react';
import { BlockchainSection } from '@shared/components/LandingPage/BlockchainSection';
import { FeaturesSection } from '@shared/components/LandingPage/FeaturesSection';
import { FinalCTA } from '@shared/components/LandingPage/FinalCTA';
import { Header } from '@shared/components/LandingPage/Header';
import { HeroSection } from '@shared/components/LandingPage/HeroSection';
import { PricingSection } from '@shared/components/LandingPage/PricingSection';
import { Footer } from '@shared/components/LandingPage/Footer';
 

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-deep-charcoal text-cool-white min-h-screen font-sans">
      <Header
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <HeroSection />
      <FeaturesSection />
      <BlockchainSection />
      <PricingSection />
      <FinalCTA />
      <Footer/>
    </div>
  );
};














