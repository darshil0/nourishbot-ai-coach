import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  ChevronRight,
  Apple,
  CookingPot,
  Info,
  Trash2,
} from 'lucide-react';
import {
  Workflow,
  DietaryPreference,
  NutritionData,
  RecipeData,
  AgentLog,
  HistoryItem,
} from './types';
import {
  visionAgent,
  nutritionAnalyst,
  culinaryExpert,
} from './services/geminiService';
import { AgentStatus } from './components/AgentStatus';
import { NutritionAnalysis } from './components/NutritionAnalysis';
import { RecipeCard } from './components/RecipeCard';
import { HistoryLog } from './components/HistoryLog';

const STORAGE_KEY = 'nourishbot_history';
const MAX_HISTORY = 10;

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<Workflow>(Workflow.ANALYSIS);
  const [diet, setDiet] = useState<DietaryPreference>(DietaryPreference.NONE);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [nutritionResult, setNutritionResult] = useState<NutritionData | null>(
    null
  );
  const [recipeResult, setRecipeResult] = useState<RecipeData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addLog = (
    agent: string,
    message: string,
    status: AgentLog['status']
  ) => {
    setLogs((prev) => [
      {
        agentName: agent,
        message,
        status,
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setNutritionResult(null);
        setRecipeResult(null);
        setLogs([]);
        setActiveHistoryId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runMultiAgentPipeline = async () => {
    if (!image) return;

    setLoading(true);
    setLogs([]);
    setNutritionResult(null);
    setRecipeResult(null);
    setActiveHistoryId(null);

    try {
      const base64Data = image.split(',')[1];

      // Phase 1: Vision
      addLog(
        'Vision Agent',
        'Initializing neural visual processing...',
        'processing'
      );
      const ingredients = await visionAgent(base64Data);
      addLog(
        'Vision Agent',
        `Identified components: ${ingredients.join(', ')}`,
        'completed'
      );

      let finalResult: NutritionData | RecipeData;
      let label = ingredients[0] || 'Meal Analysis';

      if (workflow === Workflow.ANALYSIS) {
        // Phase 2: Analysis
        addLog(
          'Nutrition Analyst',
          'Calculating caloric density and macro profile...',
          'processing'
        );
        const nutrition = await nutritionAnalyst(ingredients);
        setNutritionResult(nutrition);
        finalResult = nutrition;
        addLog(
          'Nutrition Analyst',
          'Analysis complete. Health score generated.',
          'completed'
        );
      } else {
        // Phase 2 & 3: Recipe
        addLog(
          'Nutrition Analyst',
          'Briefly scanning macro components...',
          'processing'
        );
        await nutritionAnalyst(ingredients);
        addLog(
          'Nutrition Analyst',
          'Nutritional context passed to Culinary Agent.',
          'completed'
        );

        addLog(
          'Culinary Expert',
          `Crafting ${diet} compliant recipe...`,
          'processing'
        );
        const recipe = await culinaryExpert(ingredients, diet);
        setRecipeResult(recipe);
        finalResult = recipe;
        label = recipe.title;
        addLog('Culinary Expert', 'Recipe curation complete.', 'completed');
      }

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).slice(2, 11),
        timestamp: Date.now(),
        image,
        workflow,
        diet,
        result: finalResult,
        label,
      };

      setHistory((prev) => [newHistoryItem, ...prev].slice(0, MAX_HISTORY));
      setActiveHistoryId(newHistoryItem.id);
    } catch (error) {
      console.error('Multi-agent orchestration error:', error);
      addLog(
        'System',
        'An error occurred during multi-agent orchestration.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setImage(item.image);
    setWorkflow(item.workflow);
    setDiet(item.diet || DietaryPreference.NONE);
    setActiveHistoryId(item.id);
    setLogs([
      {
        agentName: "Coach's Log",
        message: 'Retrieved analysis from your local history.',
        status: 'completed',
        timestamp: new Date(item.timestamp),
      },
    ]);

    if (item.workflow === Workflow.ANALYSIS) {
      setNutritionResult(item.result as NutritionData);
      setRecipeResult(null);
    } else {
      setRecipeResult(item.result as RecipeData);
      setNutritionResult(null);
    }
  };

  const handleUpdateHistoryLabel = (id: string, newLabel: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeHistoryId === id) {
      reset();
    }
  };

  const reset = () => {
    setImage(null);
    setNutritionResult(null);
    setRecipeResult(null);
    setLogs([]);
    setActiveHistoryId(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(15,23,42,0.08),_transparent_55%)]">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200/70">
              <Apple className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 tracking-tight leading-tight">
                NourishBot
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-green-500/80">
                AI Nutrition Coach
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
              Coach
            </span>
            <span className="px-3 py-1 rounded-full border border-dashed border-slate-200">
              Planner
            </span>
            <span className="px-3 py-1 rounded-full border border-dashed border-slate-200">
              Journal
            </span>
          </div>
          <button className="hidden sm:inline-flex bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-300/60">
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-600" /> New Analysis
              </h2>

              {!image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all group"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="text-center px-4">
                    <p className="font-bold text-slate-600">
                      Drop food photo here
                    </p>
                    <p className="text-xs text-slate-400">
                      Capture your meal for AI analysis
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-square rounded-xl overflow-hidden group">
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    alt="Uploaded food"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                    Select Workflow
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setWorkflow(Workflow.ANALYSIS)}
                      className={`py-3 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        workflow === Workflow.ANALYSIS
                          ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-100'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <Info className="w-4 h-4" /> Analysis
                    </button>
                    <button
                      onClick={() => setWorkflow(Workflow.RECIPE)}
                      className={`py-3 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        workflow === Workflow.RECIPE
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <CookingPot className="w-4 h-4" /> Recipe
                    </button>
                  </div>
                </div>

                {workflow === Workflow.RECIPE && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                      Dietary Preference
                    </label>
                    <select
                      value={diet}
                      onChange={(e) =>
                        setDiet(e.target.value as DietaryPreference)
                      }
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
                    >
                      {Object.values(DietaryPreference).map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  disabled={!image || loading}
                  onClick={runMultiAgentPipeline}
                  className={`w-full py-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-xl ${
                    !image || loading
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 hover:-translate-y-1 active:translate-y-0'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />{' '}
                      Orchestrating...
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-5 h-5" /> Start AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            <AgentStatus logs={logs} />

            <HistoryLog
              items={history}
              onSelect={handleSelectHistory}
              onDelete={deleteHistoryItem}
              onUpdateLabel={handleUpdateHistoryLabel}
              activeId={activeHistoryId}
            />
          </div>

          <div className="lg:col-span-8">
            {!nutritionResult && !recipeResult && !loading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-white via-slate-50 to-green-50 rounded-3xl border-2 border-dashed border-slate-100/80 shadow-sm">
                <div className="w-24 h-24 bg-green-50 rounded-3xl rotate-6 flex items-center justify-center mb-8 shadow-inner shadow-green-100">
                  <Apple className="w-12 h-12 text-green-400 -rotate-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                  Your Nutrition Command Center
                </h3>
                <p className="text-slate-500 max-w-md leading-relaxed mb-4">
                  Upload a photo of your meal to get an instant nutritional
                  breakdown or AI-crafted recipe tuned to your goals.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.2em]">
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-100">
                    Vision
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-100">
                    Nutrition
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-100">
                    Culinary
                  </span>
                </div>
              </div>
            )}

            {loading && !nutritionResult && !recipeResult && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-100">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-slate-50 border-t-green-600 rounded-full animate-spin"></div>
                  <Apple className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">
                  Multi-Agent Thinking
                </h3>
                <p className="text-slate-500 max-w-sm">
                  Our specialist agents are discussing your meal's macro profile
                  and creative culinary possibilities.
                </p>
              </div>
            )}

            {(nutritionResult || recipeResult) && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {nutritionResult && workflow === Workflow.ANALYSIS && (
                  <NutritionAnalysis data={nutritionResult} />
                )}
                {recipeResult && workflow === Workflow.RECIPE && (
                  <RecipeCard recipe={recipeResult} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 py-4 hidden md:block z-40">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Agent Network Online
          </div>
          <span>&copy; 2026 NourishBot AI Coaching System</span>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-slate-900 transition-colors"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition-colors"
              aria-label="Safety Guidelines"
            >
              Safety Guidelines
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
