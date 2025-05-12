
import React from "react";
import { Card } from "@/components/ui/card";
import { Building } from "lucide-react";

interface PredictionResultProps {
  prediction: number | null;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};


const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  if (prediction === null) {
    return null;
  }

  return (
    <div className="flex justify-center items-start min-h-screen">
  <Card className="glass-card p-8 w-full max-w-4xl flex flex-col items-center justify-center space-y-4">
    <Building className="h-12 w-12 text-cyan animate-pulse-cyan" />
    <h3 className="text-xl font-medium text-white">Predicted House Price</h3>
    <div className="flex items-center justify-center mt-4">
      <div className="text-4xl font-bold text-gradient-cyan animate-value-appear">
        {formatCurrency(prediction)}
      </div>
    </div>
    <p className="text-muted-foreground text-center max-w-md mt-2">
      This prediction is based on the provided house features and my machine learning model.
      Actual market prices may vary based on additional factors.
    </p>
  </Card>
</div>

  );
};

export default PredictionResult;
