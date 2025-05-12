import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Bath, Ruler, Layers, Building, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

interface FormInput {
  bedrooms: string;
  bathrooms: string;
  sqft_living: string;
  sqft_lot: string;
  floors: string;
  condition: string;
  grade: string;
  yr_built: string;
  zipcode: string;
  lat: string;
  long: string;
  sqft_living15: string;
  sqft_lot15: string;
}

interface PredictionFormProps {
  onPredict: (prediction: number) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict }) => {
  const [formData, setFormData] = useState<FormInput>({
    bedrooms: "",
    bathrooms: "",
    sqft_living: "",
    sqft_lot: "",
    floors: "",
    condition: "",
    grade: "",
    yr_built: "",
    zipcode: "",
    lat: "",
    long: "",
    sqft_living15: "",
    sqft_lot15: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = Object.entries(formData);
    const emptyFields = requiredFields.filter(([_, value]) => !value);

    if (emptyFields.length > 0) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://houseprice-prediction-77ez.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      onPredict(result.predicted_price);
      toast.success("Prediction generated successfully");
    } catch (error) {
      toast.error("Failed to generate prediction");
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "bedrooms", label: "Bedrooms", icon: Bed },
    { name: "bathrooms", label: "Bathrooms", icon: Bath },
    { name: "sqft_living", label: "Living Area (sqft)", icon: Ruler },
    { name: "sqft_lot", label: "Lot Size (sqft)", icon: Ruler },
    { name: "floors", label: "Floors", icon: Layers },
    { name: "zipcode", label: "Zipcode", icon: MapPin },
    { name: "lat", label: "Latitude", icon: MapPin },
    { name: "long", label: "Longitude", icon: MapPin },
    { name: "sqft_living15", label: "Nbhd Living Area (sqft)", icon: Ruler },
    { name: "sqft_lot15", label: "Nbhd Lot Size (sqft)", icon: Ruler },
    { name: "yr_built", label: "Year Built", icon: Calendar }
  ];

  return (
    <Card className="glass-card p-6 w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map(({ name, label, icon: Icon }) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-cyan" />
                <Label htmlFor={name}>{label}</Label>
              </div>
              <Input
                id={name}
                name={name}
                type={name === "yr_built" || name === "bedrooms" || name === "bathrooms" ? "number" : "text"}
                placeholder={label}
                value={formData[name as keyof FormInput]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label>Condition</Label>
            <Select onValueChange={(value) => handleSelectChange(value, "condition")} value={formData.condition}>
              <SelectTrigger className="input-glass">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} - {num === 1 ? "Poor" : num === 2 ? "Fair" : num === 3 ? "Average" : num === 4 ? "Good" : "Excellent"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Grade</Label>
            <Select onValueChange={(value) => handleSelectChange(value, "grade")} value={formData.grade}>
              <SelectTrigger className="input-glass">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button type="submit" disabled={loading} className="bg-cyan">
            {loading ? "Predicting..." : "Predict House Price"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PredictionForm;
