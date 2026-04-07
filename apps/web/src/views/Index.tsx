"use client";

import { LandingFunnel } from "@/components/landing/LandingFunnel";
import { IndexExploreSection } from "@/components/landing/IndexExploreSection";

const Index = () => {
  return (
    <div className="min-h-full bg-background">
      <LandingFunnel />
      <IndexExploreSection />
    </div>
  );
};

export default Index;
