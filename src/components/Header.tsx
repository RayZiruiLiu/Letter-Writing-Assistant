import React from "react";
import { Feather, History, PlusCircle, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  onNewLetter: () => void;
  onOpenHistory: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewLetter,
  onOpenHistory,
  savedCount,
}) => {
  return (
    <header
      id="app-header"
      className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-50 flex items-center justify-center shadow-xs">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight">
                Letter Writing Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                Verified Intent Engine
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Thoughtfully verified, beautifully drafted correspondence
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-saved-drafts"
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors"
          >
            <History className="w-4 h-4 text-stone-500" />
            <span>Saved Drafts</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[10px] font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="btn-new-letter"
            type="button"
            onClick={onNewLetter}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Letter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
