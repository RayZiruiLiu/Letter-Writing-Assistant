import React from "react";
import { X, Trash2, ArrowUpRight, Calendar, Bookmark, FileText } from "lucide-react";
import { GeneratedLetter } from "../types";

interface DraftsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLetters: GeneratedLetter[];
  onSelectLetter: (letter: GeneratedLetter) => void;
  onDeleteLetter: (letterId: string) => void;
}

export const DraftsHistoryModal: React.FC<DraftsHistoryModalProps> = ({
  isOpen,
  onClose,
  savedLetters,
  onSelectLetter,
  onDeleteLetter,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-drafts-history"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-stone-900">
                Saved Letter Drafts ({savedLetters.length})
              </h2>
              <p className="text-xs text-stone-500">
                Access, edit, or re-export previously generated correspondence.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of drafts */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {savedLetters.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <FileText className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-medium text-stone-600">No saved drafts yet</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Draft a letter and click "Save Draft" to keep your letters safely in local storage.
              </p>
            </div>
          ) : (
            savedLetters.map((draft) => (
              <div
                key={draft.id}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-300/80 bg-stone-50/50 hover:bg-amber-50/20 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1 cursor-pointer" onClick={() => { onSelectLetter(draft); onClose(); }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-stone-900">
                      {draft.title || draft.scenario || "Untitled Letter"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-200 text-stone-700">
                      {draft.tone}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 flex items-center gap-3">
                    <span>
                      To: <strong className="text-stone-800">{draft.recipientName}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      From: <strong className="text-stone-800">{draft.senderName}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-1 italic">
                    "{draft.paragraphs[0]}"
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-stone-400 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(draft.createdAt).toLocaleDateString()} at{" "}
                      {new Date(draft.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => { onSelectLetter(draft); onClose(); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteLetter(draft.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
