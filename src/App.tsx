import React from 'react';
import { AppProvider } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { OperatingHoursBanner } from './components/OperatingHoursBanner.tsx';
import { CatalogSection } from './components/CatalogSection.tsx';
import { ServiceAreaSection } from './components/ServiceAreaSection.tsx';
import { ResponsibleConsumption } from './components/ResponsibleConsumption.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AgeVerificationModal } from './components/AgeVerificationModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { LegalModal } from './components/LegalModal.tsx';
import { MobileBottomBar } from './components/MobileBottomBar.tsx';

function MainContent() {
  return (
    <div className="min-h-screen bg-[#070809] text-[#f4efe6] selection:bg-[#d4af37]/30 selection:text-[#faebd7]">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <OperatingHoursBanner />
        <CatalogSection />
        <ServiceAreaSection />
        <ResponsibleConsumption />
        <FaqSection />
      </main>
      <Footer />

      {/* Global Modals & Drawers */}
      <AgeVerificationModal />
      <CartDrawer />
      <AdminDashboard />
      <LegalModal />
      <MobileBottomBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
