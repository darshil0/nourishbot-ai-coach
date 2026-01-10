import React from 'react';
import { RecipeData } from '../types';
import { Clock, Users, ChefHat } from 'lucide-react';

interface Props {
  recipe: RecipeData;
}

export const RecipeCard: React.FC<Props> = ({ recipe }) => {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50 rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietaryTags?.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-200/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
          {recipe.title}
        </h2>
        <p className="text-slate-600 mb-6 max-w-2xl">{recipe.description}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 border-y border-slate-200/80 py-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold">{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold">
              {recipe.servings} Servings
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ChefHat className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold">Chef Recommended</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Ingredients
            </h3>
            <ul className="space-y-3 text-slate-600">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 text-sm pl-4">
                  <svg
                    className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Instructions
            </h3>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 ring-4 ring-white">
                    {i + 1}
                  </span>
                  <p className="text-slate-700 leading-relaxed pt-1.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
