import React, { useState } from 'react';
import { HistoryItem, Workflow, NutritionData, RecipeData } from '../types';
import { History, Trash2, ChevronRight, Apple, CookingPot, Edit2, Check, X } from 'lucide-react';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onUpdateLabel: (id: string, newLabel: string) => void;
  activeId?: string | null;
}

export const HistoryLog: React.FC<Props> = ({ items, onSelect, onDelete, onUpdateLabel, activeId }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-dashed border-slate-200 p-4 text-xs text-slate-500 flex items-center gap-2">
        <History className="w-4 h-4 text-slate-300" />
        <span>No saved meals yet. Run an analysis and your history will appear here.</span>
      </div>
    );
  }

  const startEditing = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditValue(item.label);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditValue("");
  };

  const handleSave = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editValue.trim()) {
      onUpdateLabel(id, editValue.trim());
    }
    setEditingId(null);
  };

  const renderConciseSummary = (item: HistoryItem) => {
    if (item.workflow === Workflow.ANALYSIS) {
      const data = item.result as NutritionData;
      return (
        <div className="mt-1 text-[11px] text-slate-600 leading-tight">
          <span className="font-bold text-slate-800">Calories:</span> {data.totalCalories}, 
          <span className="font-bold text-slate-800 ml-1">Macros:</span> P:{data.macros.protein}g, C:{data.macros.carbs}g, F:{data.macros.fat}g
        </div>
      );
    } else {
      const data = item.result as RecipeData;
      return (
        <div className="mt-1 text-[11px] text-slate-600 leading-tight">
          <span className="font-bold text-slate-800">Recipe:</span> {data.title}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Food Log</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded-full">
          {items.length} Entries
        </span>
      </div>
      <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <div 
              key={item.id}
              className={`group flex flex-col transition-all cursor-pointer border-l-4 ${isActive ? 'bg-green-50/30 border-green-500' : 'hover:bg-slate-50 border-transparent'}`}
              onClick={() => onSelect(item)}
              onDoubleClick={(e) => startEditing(e, item)}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-0 right-0 p-0.5 bg-black/50 text-[8px] text-white backdrop-blur-sm rounded-bl-lg">
                    {item.workflow === Workflow.ANALYSIS ? <Apple className="w-2.5 h-2.5" /> : <CookingPot className="w-2.5 h-2.5" />}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                      <input
                        autoFocus
                        className="w-full text-sm font-bold text-slate-800 bg-white border-2 border-green-400 rounded-md px-2 py-0.5 outline-none focus:ring-2 focus:ring-green-100"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(e, item.id);
                          if (e.key === 'Escape') cancelEditing(e as any);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Edit label"
                      />
                      <div className="flex gap-0.5">
                        <button 
                          onClick={(e) => handleSave(e, item.id)} 
                          className="p-1 text-green-600 hover:bg-green-100 rounded-md transition-colors" 
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEditing} className="p-1 text-slate-400 hover:bg-slate-100 rounded-md transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <p className={`text-sm font-bold truncate leading-tight transition-colors ${isActive ? 'text-green-700' : 'text-slate-800 group-hover:text-green-700'}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                  {renderConciseSummary(item)}
                </div>

                <div className="flex items-center gap-0.5">
                  {!editingId && (
                    <>
                      <button 
                        onClick={(e) => startEditing(e, item)}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        title="Edit Label"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${isActive ? 'rotate-90 text-green-500' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>

              {isActive && !editingId && (
                <div className="px-3 pb-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-white rounded-lg border border-slate-100 p-2.5 shadow-sm">
                    {renderConciseSummary(item)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
