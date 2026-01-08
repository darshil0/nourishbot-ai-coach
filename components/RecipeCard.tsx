
import React from 'react';
import { RecipeData } from '../types';
import { Clock, Users, ChefHat } from 'lucide-react';

interface Props {
  recipe: RecipeData;
}

export const RecipeCard: React.FC<Props> = ({ recipe }) => {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50 rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietaryTags?.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase">
              {tag}
            </span>
          ))}
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">{recipe.title}</h2>
        <p className="text-slate-500 mb-6">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-6 mb-8 border-y border-slate-100 py-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{recipe.servings} Servings</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <ChefHat className="w-4 h-4" />
            <span className="text-sm font-medium">Chef Recommended</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Ingredients</h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Instructions</h3>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <p className="text-slate-600 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
