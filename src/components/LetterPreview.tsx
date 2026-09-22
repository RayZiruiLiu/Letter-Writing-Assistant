import React, { useState } from "react";
import {
  Copy,
  Check,
  Mail,
  Printer,
  Download,
  Bookmark,
  Sparkles,
  Edit3,
  CheckSquare,
  RefreshCw,
  Send,
  HelpCircle,
  Clock,
  Shield,
  Mic,
} from "lucide-react";
import { GeneratedLetter, FormatStyleOption } from "../types";
import { FORMAT_STYLES } from "../constants";
import { useVoiceInput } from "../hooks/useVoiceInput";

interface LetterPreviewProps {
  letter: GeneratedLetter;
  onUpdateLetter: (updated: GeneratedLetter) => void;
  onSaveToHistory: (letter: GeneratedLetter) => void;
  isSaved: boolean;
  onRefineWithAI: (instruction: string) => Promise<void>;
  isRefining: boolean;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  letter,
  onUpdateLetter,
  onSaveToHistory,
  isSaved,
  onRefineWithAI,
  isRefining,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState("");

  // Voice input for refinement prompt
  const handleVoiceRefineChunk = (chunk: string) => {
    setRefinementPrompt((prev) => (prev ? `${prev} ${chunk}` : chunk));
  };
  const { isListening: isRefineVoiceListening, toggleListening: toggleRefineVoice } =
    useVoiceInput(handleVoiceRefineChunk);

  const styleConfig: FormatStyleOption =
    FORMAT_STYLES.find((s) => s.id === letter.formatStyle) || FORMAT_STYLES[0];

  const fullLetterText = [
    letter.subject ? `Subject: ${letter.subject}\n` : "",
    letter.date ? `Date: ${letter.date}\n` : "",
    letter.senderTitleOrAddress ? `From: ${letter.senderName} (${letter.senderTitleOrAddress})\n` : "",
    letter.recipientTitleOrAddress ? `To: ${letter.recipientName} (${letter.recipientTitleOrAddress})\n` : "",
    letter.salutation,
    "",
    letter.paragraphs.join("\n\n"),
    "",
    letter.signOff,
    letter.senderName,
    letter.postScript ? `\nP.S. ${letter.postScript}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSendEmail = () => {
    const subjectParam = encodeURIComponent(letter.subject || `Letter from ${letter.senderName}`);
    const bodyParam = encodeURIComponent(fullLetterText);
    window.location.href = `mailto:?subject=${subjectParam}&body=${bodyParam}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([fullLetterText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${letter.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementPrompt.trim() && !isRefining) {
      onRefineWithAI(refinementPrompt.trim());
      setRefinementPrompt("");
    }
  };

  const quickRefinements = [
    "Make it slightly more polite and appreciative",
    "Make it more assertive and emphasize the deadline",
    "Shorten by 20% to be more concise",
    "Add a warmer personal closing paragraph",
    "Ensure legal tone is strictly preserved",
  ];

  return (
    <div id="letter-preview-section" className="space-y-4">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-stone-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            Tailored Letter Draft Ready
          </span>
          <span className="text-xs text-stone-500 hidden sm:inline">
            ({letter.paragraphs.length} paragraphs • {letter.tone})
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Toggle Edit Mode */}
          <button
            type="button"
            id="btn-toggle-edit"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isEditing
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            {isEditing ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                <span>Finish Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Text</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            id="btn-copy-letter"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Send via Email */}
          <button
            type="button"
            id="btn-send-email"
            onClick={handleSendEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span>Send via Email</span>
          </button>

          {/* Print / PDF */}
          <button
            type="button"
            id="btn-print-letter"
            onClick={handlePrint}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Download Text */}
          <button
            type="button"
            id="btn-download-txt"
            onClick={handleDownloadTxt}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
            title="Download Plain Text"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Save to Drafts */}
          <button
            type="button"
            id="btn-save-draft"
            onClick={() => onSaveToHistory(letter)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSaved
                ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-700 text-amber-700" : ""}`} />
            <span>{isSaved ? "Saved" : "Save Draft"}</span>
          </button>
        </div>
      </div>

      {/* The Printable Letter Paper */}
      <div
        id="printable-letter-paper"
        className={`p-8 sm:p-14 rounded-2xl border shadow-sm transition-all duration-300 ${styleConfig.previewBg} ${styleConfig.fontFamily} print:border-none print:shadow-none print:p-0 print:m-0`}
      >
        {/* Letterhead Header */}
        <div className="border-b border-stone-300/70 pb-6 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            {/* Sender block */}
            <div className="font-semibold text-stone-900 text-base">
              {isEditing ? (
                <input
                  type="text"
                  value={letter.senderName}
                  onChange={(e) => onUpdateLetter({ ...letter, senderName: e.target.value })}
                  className="border-b border-amber-600 bg-transparent px-1 focus:outline-hidden"
                />
              ) : (
                letter.senderName
              )}
            </div>
            {letter.senderTitleOrAddress && (
              <p className="text-xs text-stone-600 mt-0.5 whitespace-pre-line">
                {letter.senderTitleOrAddress}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-500 font-mono block">
              {letter.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {letter.formatStyle === "official_docket" && (
              <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                REF: {letter.id.slice(0, 8).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Recipient block */}
        <div className="mb-6 space-y-0.5">
          <div className="font-semibold text-stone-900 text-sm">
            {isEditing ? (
              <input
                type="text"
                value={letter.recipientName}
                onChange={(e) => onUpdateLetter({ ...letter, recipientName: e.target.value })}
                className="border-b border-amber-600 bg-transparent px-1 focus:outline-hidden"
              />
            ) : (
              letter.recipientName
            )}
          </div>
          {letter.recipientTitleOrAddress && (
            <p className="text-xs text-stone-600 whitespace-pre-line">
              {letter.recipientTitleOrAddress}
            </p>
          )}
        </div>

        {/* Subject line if present */}
        {letter.subject && (
          <div className="mb-6">
            <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
              Subject:{" "}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={letter.subject}
                onChange={(e) => onUpdateLetter({ ...letter, subject: e.target.value })}
                className="w-full text-sm font-semibold border-b border-amber-600 bg-transparent px-1 focus:outline-hidden"
              />
            ) : (
              <span className="text-sm font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4">
                {letter.subject}
              </span>
            )}
          </div>
        )}

        {/* Salutation */}
        <div className="mb-6 text-sm sm:text-base font-medium text-stone-900">
          {isEditing ? (
            <input
              type="text"
              value={letter.salutation}
              onChange={(e) => onUpdateLetter({ ...letter, salutation: e.target.value })}
              className="w-full text-sm font-medium border-b border-amber-600 bg-transparent px-1 focus:outline-hidden"
            />
          ) : (
            letter.salutation
          )}
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-4 text-stone-800 text-sm sm:text-base leading-relaxed">
          {letter.paragraphs.map((p, pIdx) => (
            <div key={pIdx}>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const newPars = [...letter.paragraphs];
                    newPars[pIdx] = e.target.value;
                    onUpdateLetter({ ...letter, paragraphs: newPars });
                  }}
                  className="w-full p-2 text-sm border border-stone-300 rounded-lg bg-white/70 focus:outline-hidden focus:ring-2 focus:ring-amber-600/40"
                />
              ) : (
                <p className="text-justify font-normal">{p}</p>
              )}
            </div>
          ))}
        </div>

        {/* Sign-Off & Signature */}
        <div className="mt-8 pt-4 space-y-1">
          <div className="text-sm text-stone-800">
            {isEditing ? (
              <input
                type="text"
                value={letter.signOff}
                onChange={(e) => onUpdateLetter({ ...letter, signOff: e.target.value })}
                className="border-b border-amber-600 bg-transparent px-1 focus:outline-hidden"
              />
            ) : (
              letter.signOff
            )}
          </div>
          <div className="pt-6 font-semibold text-stone-900 text-sm sm:text-base">
            {letter.senderName}
          </div>
        </div>

        {/* Post Script (P.S.) */}
        {letter.postScript && (
          <div className="mt-8 pt-4 border-t border-stone-200 text-xs italic text-stone-600">
            <strong>P.S. </strong>
            {isEditing ? (
              <input
                type="text"
                value={letter.postScript}
                onChange={(e) => onUpdateLetter({ ...letter, postScript: e.target.value })}
                className="w-full border-b border-amber-600 bg-transparent px-1 focus:outline-hidden text-xs"
              />
            ) : (
              letter.postScript
            )}
          </div>
        )}
      </div>

      {/* AI Refinement & Revision Bar (hidden in print) */}
      <div
        id="ai-refinement-controls"
        className="p-4 bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 shadow-md space-y-3 print:hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-white">
              Agent Refinement & Polishing
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">
            Request adjustments to tone, phrasing, or length
          </span>
        </div>

        {/* Quick Refine Pills */}
        <div className="flex flex-wrap gap-1.5">
          {quickRefinements.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isRefining}
              onClick={() => onRefineWithAI(qr)}
              className="px-2.5 py-1 rounded-lg text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors disabled:opacity-50"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Custom Refinement Input with Voice */}
        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <input
            type="text"
            id="input-ai-refinement"
            value={refinementPrompt}
            onChange={(e) => setRefinementPrompt(e.target.value)}
            placeholder="e.g. 'Add a sentence expressing gratitude for their 5 years of partnership' or speak..."
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
          />

          <button
            type="button"
            id="btn-voice-refine"
            onClick={toggleRefineVoice}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isRefineVoiceListening
                ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
            }`}
            title="Dictate refinement instruction"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!refinementPrompt.trim() || isRefining}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-40 transition-colors"
          >
            {isRefining ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Apply</span>
          </button>
        </form>
      </div>

      {/* Insights & Delivery Etiquette (hidden in print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
        {/* Key Highlights */}
        {letter.keyHighlights && letter.keyHighlights.length > 0 && (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
            <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Strategic Highlights in this Draft
            </h4>
            <ul className="text-xs text-stone-600 space-y-1.5 pl-4 list-disc">
              {letter.keyHighlights.map((hl, idx) => (
                <li key={idx}>{hl}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery Tips */}
        {letter.deliveryTips && letter.deliveryTips.length > 0 && (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
            <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Delivery & Follow-Up Etiquette
            </h4>
            <ul className="text-xs text-stone-600 space-y-1.5 pl-4 list-disc">
              {letter.deliveryTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
