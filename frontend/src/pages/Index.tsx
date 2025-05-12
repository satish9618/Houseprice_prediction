
import React, { useState } from "react";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";

const Index: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);

  const handlePredict = (value: number) => {
    setPrediction(value);
    
    // Scroll to results if needed
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-cyan">
            House Price Predictor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your property details below to get an estimated market value based on my
            machine learning model.
          </p>
        </header>

        <div className="flex flex-col items-center space-y-8">
          <PredictionForm onPredict={handlePredict} />
          
          <div id="results" className="w-full mt-8">
            {prediction !== null && <PredictionResult prediction={prediction} />}
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
          <p>© 2025 House Price Predictor | AI-Powered Real Estate Analytics</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
