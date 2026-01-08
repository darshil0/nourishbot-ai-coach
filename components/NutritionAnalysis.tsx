
import React from 'react';
import { NutritionData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  data: NutritionData;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export const NutritionAnalysis: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.macros.protein },
    { name: 'Carbs', value: data.macros.carbs },
    { name: 'Fat', value: data.macros.fat },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Macro Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            <div>
              <div className="text-xs text-slate-500">Protein</div>
              <div className="font-bold text-green-600">{data.macros.protein}g</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Carbs</div>
              <div className="font-bold text-blue-600">{data.macros.carbs}g</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Fat</div>
              <div className="font-bold text-amber-600">{data.macros.fat}g</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Total Calories</div>
          <div className="text-6xl font-black text-slate-800">{data.totalCalories}</div>
          <div className="text-sm text-slate-400 mt-2">kcal estimated</div>
          
          <div className="mt-8 w-full">
             <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-slate-700">Health Score</span>
                <span className="text-xs font-medium text-slate-700">{data.healthScore}/100</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${data.healthScore}%` }}
                ></div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Meal Insights</h3>
        <p className="text-slate-600 mb-6 italic">"{data.healthSummary}"</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">Micronutrients</h4>
            <div className="flex flex-wrap gap-2">
              {data.micros.map((m, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs border border-slate-100">{m}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">Chef's Suggestions</h4>
            <ul className="space-y-2">
              {data.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
