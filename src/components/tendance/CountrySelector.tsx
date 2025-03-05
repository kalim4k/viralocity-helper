
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CountrySelectorProps {
  country: string;
  countries: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ country, countries, onChange }) => {
  return (
    <div className="w-full md:w-48">
      <Select value={country} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un pays" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {countries.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
