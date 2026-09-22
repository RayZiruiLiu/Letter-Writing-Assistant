import React, { useState } from "react";
import { Sliders, Sparkles, FileText, Layout, Target, Check } from "lucide-react";
import { TONES, LENGTHS, FORMAT_STYLES, CALL_TO_ACTIONS } from "../constants";
import { ToneOption, LengthOption, FormatStyleOption } from "../types";

interface CustomizationBarProps {
  selectedTone: string;
  onChangeTone: (tone: string) => void;
  selectedLength: string;
  onChangeLength: (length: string) => void;
  selectedFormatStyle: string;
  onChangeFormatStyle: (styleId: string) => void;
  selectedCTA: string;
  onChangeCTA: (cta: string) => void;
}

export const CustomizationBar: React.FC<CustomizationBarProps> = ({
  selectedTone,
  onChangeTone,
  selectedLength,
  onChangeLength,
  selectedFormatStyle,
  onChangeFormatStyle,
  selectedCTA,
  onChangeCTA,
}) => {
  const [activeTab, setActiveTab] = useState<"tone" | "length" | "style" | "cta">("tone");
  const [customCTA, setCustomCTA] = useState("");

  const currentToneObj = TONES.find((t) => t.label === selectedTone) || TONES[0];
  const currentLengthObj = LENGTHS.find((l) => l.label === selectedLength) || LENGTHS[1];
  const currentStyleObj = FORMAT_STYLES.find((s) => s.id === selectedFormatStyle) || FORMAT_STYLES[0];

  const handleCustomCTAAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCTA.trim()) {
      onChangeCTA(customCTA.trim());
      setCustomCTA("");
    }
  };

  return (
    <div
      id="customization-bar-section"
      className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-semibold text-stone-900">
              2. Customization Studio
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Fine-tune the tone, pacing, visual formatting, and target outcome of your letter.
          </p>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            id="tab-btn-tone"
            onClick={() => setActiveTab("tone")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "tone"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Tone</span>
          </button>

          <button
            type="button"
            id="tab-btn-length"
            onClick={() => setActiveTab("length")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "length"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Length</span>
          </button>

          <button
            type="button"
            id="tab-btn-style"
            onClick={() => setActiveTab("style")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "style"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Layout className="w-3.5 h-3.5 text-purple-600" />
            <span>Style & Format</span>
          </button>

          <button
            type="button"
            id="tab-btn-cta"
            onClick={() => setActiveTab("cta")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "cta"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Desired Action</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Tone */}
      {activeTab === "tone" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {TONES.map((tone: ToneOption) => {
              const isSelected = selectedTone === tone.label;
              return (
                <button
                  key={tone.id}
                  id={`tone-option-${tone.id}`}
                  type="button"
                  onClick={() => onChangeTone(tone.label)}
                  className={`text-left p-2.5 rounded-xl border transition-all relative ${
                    isSelected
                      ? "border-amber-700 bg-amber-50/60 ring-1 ring-amber-700/50"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">
                      {tone.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-tight">
                    {tone.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Length */}
      {activeTab === "length" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {LENGTHS.map((len: LengthOption) => {
            const isSelected = selectedLength === len.label;
            return (
              <button
                key={len.id}
                id={`length-option-${len.id}`}
                type="button"
                onClick={() => onChangeLength(len.label)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/40"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">{len.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-stone-600">
                  <span className="bg-stone-100 px-2 py-0.5 rounded">{len.words}</span>
                  <span className="bg-stone-100 px-2 py-0.5 rounded">{len.paragraphs}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                  {len.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 3: Style & Format */}
      {activeTab === "style" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FORMAT_STYLES.map((style: FormatStyleOption) => {
            const isSelected = selectedFormatStyle === style.id;
            return (
              <button
                key={style.id}
                id={`style-option-${style.id}`}
                type="button"
                onClick={() => onChangeFormatStyle(style.id)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600/40"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">{style.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                  {style.description}
                </p>
                <div className={`mt-2.5 h-7 rounded border ${style.previewBg} flex items-center px-2 text-[10px] text-stone-400 font-serif italic`}>
                  Stationery preview
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 4: Desired Action (Call to Action) */}
      {activeTab === "cta" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {CALL_TO_ACTIONS.map((cta) => {
              const isSelected = selectedCTA === cta;
              return (
                <button
                  key={cta}
                  type="button"
                  onClick={() => onChangeCTA(cta)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600/30 font-semibold"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {cta}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleCustomCTAAdd} className="flex gap-2 pt-1">
            <input
              type="text"
              id="input-custom-cta"
              value={customCTA}
              onChange={(e) => setCustomCTA(e.target.value)}
              placeholder="Or type a specific custom desired outcome..."
              className="flex-1 px-3 py-1.5 rounded-lg text-xs border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-stone-400 bg-stone-50/50"
            />
            <button
              type="submit"
              disabled={!customCTA.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 text-stone-50 hover:bg-stone-700 disabled:opacity-40 transition-colors"
            >
              Set Action
            </button>
          </form>
        </div>
      )}

      {/* Summary Indicator */}
      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span>Active Config:</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 font-medium text-stone-800">
            Tone: {selectedTone}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 font-medium text-stone-800">
            {selectedLength}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 font-medium text-stone-800">
            {currentStyleObj.name}
          </span>
        </div>
        {selectedCTA && (
          <span className="text-emerald-700 font-medium truncate max-w-xs">
            Goal: {selectedCTA}
          </span>
        )}
      </div>
    </div>
  );
};
