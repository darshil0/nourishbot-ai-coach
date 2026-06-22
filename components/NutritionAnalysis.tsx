import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionData } from '../types';

interface Props {
  data: NutritionData;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export const NutritionAnalysis: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbohydrates },
    { name: 'Fat', value: data.fat },
  ];

  // Calculate macro percentages for display
  const totalMacros = data.protein + data.carbohydrates + data.fat;
  const proteinPct = totalMacros > 0 ? Math.round((data.protein / totalMacros) * 100) : 0;
  const carbsPct = totalMacros > 0 ? Math.round((data.carbohydrates / totalMacros) * 100) : 0;
  const fatPct = totalMacros > 0 ? Math.round((data.fat / totalMacros) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
            Macro Distribution
          </h3>
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
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            <div>
              <div className="text-xs text-slate-500">Protein</div>
              <div className="font-bold text-green-600">{data.protein}g</div>
              <div className="text-xs text-green-500">{proteinPct}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Carbs</div>
              <div className="font-bold text-blue-600">{data.carbohydrates}g</div>
              <div className="text-xs text-blue-500">{carbsPct}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Fat</div>
              <div className="font-bold text-amber-600">{data.fat}g</div>
              <div className="text-xs text-amber-500">{fatPct}%</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />
          <div className="relative z-10 w-full">
            <div className="text-sm font-semibold text-emerald-50 uppercase tracking-widest mb-2">
              Total Calories
            </div>
            <div className="text-6xl font-black text-white drop-shadow-sm">
              {data.calories}
            </div>
            <div className="text-sm text-emerald-50/90 mt-2">
              kcal estimated
            </div>

            <div className="mt-8 w-full">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-emerald-50">
                  Health Score
                </span>
                <span className="text-xs font-medium text-emerald-50">
                  {data.healthScore}/100
                </span>
              </div>
              <div className="w-full bg-emerald-900/30 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-lime-300 via-emerald-200 to-emerald-50"
                  style={{ width: `${data.healthScore}%` }}
                ></div>
              </div>
            </div>

            {/* Additional nutrition details */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {data.fiber && (
                <div className="text-center">
                  <div className="text-xs text-emerald-50/80">Fiber</div>
                  <div className="font-bold text-white">{data.fiber}g</div>
                </div>
              )}
              {data.sugar && (
                <div className="text-center">
                  <div className="text-xs text-emerald-50/80">Sugar</div>
                  <div className="font-bold text-white">{data.sugar}g</div>
                </div>
              )}
              {data.sodium && (
                <div className="text-center">
                  <div className="text-xs text-emerald-50/80">Sodium</div>
                  <div className="font-bold text-white">{data.sodium}mg</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Meal Insights</h3>
        
        {/* Health notes */}
        {data.notes && (
          <p className="text-slate-600 mb-6 italic">"{data.notes}"</p>
        )}

        {/* Tags */}
        {data.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">
              Nutrition Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-100 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
