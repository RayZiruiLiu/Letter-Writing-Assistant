import React, { useState } from "react";
import {
  Briefcase,
  LogOut,
  TrendingUp,
  Award,
  ShieldAlert,
  Home,
  FileWarning,
  Building2,
  Heart,
  Sparkles,
  Smile,
  GraduationCap,
  Check,
  Compass,
} from "lucide-react";
import { SCENARIOS } from "../constants";
import { ScenarioCategory, ScenarioItem } from "../types";

interface ScenarioSelectorProps {
  selectedScenarioId: string;
  onSelectScenario: (scenario: ScenarioItem) => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-4 h-4" />,
  LogOut: <LogOut className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  FileWarning: <FileWarning className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Smile: <Smile className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
};

const CATEGORIES: Array<"All" | ScenarioCategory> = [
  "All",
  "Professional",
  "Official",
  "Personal",
  "Academic",
];

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenarioId,
  onSelectScenario,
}) => {
  const [activeCategory, setActiveCategory] = useState<"All" | ScenarioCategory>("All");

  const filteredScenarios =
    activeCategory === "All"
      ? SCENARIOS
      : SCENARIOS.filter((s) => s.category === activeCategory);

  return (
    <div id="scenario-selector-container" className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-stone-600" />
            1. Select Letter Scenario & Purpose
          </label>
          <p className="text-xs text-stone-500">
            Choose what type of letter you wish to draft to calibrate tone and structure.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase()}`}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-stone-900 text-stone-50"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredScenarios.map((scenario) => {
          const isSelected = selectedScenarioId === scenario.id;
          return (
            <button
              key={scenario.id}
              id={`scenario-card-${scenario.id}`}
              type="button"
              onClick={() => onSelectScenario(scenario)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "border-amber-700 bg-amber-50/50 ring-1 ring-amber-700/50 shadow-xs"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-amber-800 text-amber-50"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {ICONS_MAP[scenario.iconName] || <Compass className="w-4 h-4" />}
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                    {scenario.category}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-stone-900 line-clamp-1">
                  {scenario.title}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-500 truncate">
                  Default tone: <strong className="text-stone-700 font-medium">{scenario.defaultTone.split("&")[0]}</strong>
                </span>
                {isSelected && (
                  <span className="flex items-center gap-0.5 text-amber-700 font-medium shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
