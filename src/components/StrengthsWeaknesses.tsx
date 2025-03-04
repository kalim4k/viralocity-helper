
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ strengths, weaknesses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center mb-3">
          <div className="bg-green-500/20 p-1.5 rounded-lg mr-2">
            <ThumbsUp size={16} className="text-green-500" />
          </div>
          <h3 className="font-semibold">Points forts</h3>
        </div>
        <ul className="space-y-2">
          {strengths.map((strength, index) => (
            <li key={index} className="text-sm flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center mb-3">
          <div className="bg-tva-accent/20 p-1.5 rounded-lg mr-2">
            <ThumbsDown size={16} className="text-tva-accent" />
          </div>
          <h3 className="font-semibold">Points à améliorer</h3>
        </div>
        <ul className="space-y-2">
          {weaknesses.map((weakness, index) => (
            <li key={index} className="text-sm flex items-start">
              <span className="text-tva-accent mr-2">•</span>
              <span>{weakness}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
