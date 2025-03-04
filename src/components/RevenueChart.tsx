
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  name: string;
  min: number;
  max: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  currency?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  currency = '€' 
}) => {
  // Formater les valeurs pour l'affichage
  const formatValue = (value: number) => {
    return `${value.toFixed(0)}${currency}`;
  };

  // Style personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-2 text-sm border border-tva-border">
          <p className="text-tva-text font-medium">{payload[0].payload.name}</p>
          <p className="text-tva-primary">{`Min: ${formatValue(payload[0].value)}`}</p>
          <p className="text-tva-secondary">{`Max: ${formatValue(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          barGap={0}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#f1f5f9', fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: '#f1f5f9', fontSize: 12 }}
            tickFormatter={(value) => value === 0 ? '0' : `${value}€`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="min" 
            name="Minimum" 
            fill="rgba(59, 130, 246, 0.8)" 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="max" 
            name="Maximum" 
            fill="rgba(168, 85, 247, 0.8)" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
