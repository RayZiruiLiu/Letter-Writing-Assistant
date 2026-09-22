import React, { useState } from "react";
import {
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  MessageSquare,
  FileCheck,
  Check,
  Mic,
  Lightbulb,
} from "lucide-react";
import { AnalysisResult, ClarificationQuestion } from "../types";
import { useVoiceInput } from "../hooks/useVoiceInput";

interface AgentReviewGateProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  onAnswerQuestion: (questionId: string, answer: string) => void;
  onGenerateLetter: (force?: boolean) => void;
  onRecheckDetails: () => void;
  isGenerating: boolean;
}

export const AgentReviewGate: React.FC<AgentReviewGateProps> = ({
  analysis,
  isLoading,
  onAnswerQuestion,
  onGenerateLetter,
  onRecheckDetails,
  isGenerating,
}) => {
  const [activeVoiceQuestionId, setActiveVoiceQuestionId] = useState<string | null>(null);

  // Hook for voice answering clarification questions
  const handleVoiceAnswer = (text: string) => {
    if (activeVoiceQuestionId) {
      onAnswerQuestion(activeVoiceQuestionId, text);
      setActiveVoiceQuestionId(null);
    }
  };

  const { isListening, toggleListening } = useVoiceInput(handleVoiceAnswer);

  if (isLoading) {
    return (
      <div
        id="agent-review-loading"
        className="p-8 bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 shadow-md text-center space-y-4 animate-pulse"
      >
        <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">
            Agent is Verifying Your Letter's Context...
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
            Analyzing recipient etiquette, scenario nuances, and checking for any missing critical details to ensure the letter accomplishes your exact goals.
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const unansweredCount = analysis.clarificationQuestions.filter(
    (q) => !q.userAnswer || q.userAnswer.trim() === ""
  ).length;

  const isFullyReady = analysis.isReady && unansweredCount === 0;

  return (
    <div
      id="agent-review-gate-section"
      className="p-5 bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 shadow-lg space-y-5"
    >
      {/* Top Header & Readiness Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Agent Consultation & Detail Verification
            </h2>
          </div>
          <p className="text-xs text-stone-400">
            {isFullyReady
              ? "All critical details are verified! Your custom letter is ready to be drafted."
              : "The agent needs to check a few specific details before drafting to guarantee perfection."}
          </p>
        </div>

        {/* Readiness Confidence Meter */}
        <div className="flex items-center gap-3 bg-stone-800/80 px-3.5 py-2 rounded-xl border border-stone-700/60 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              Confidence Score
            </span>
            <span className="text-sm font-bold text-amber-400">
              {analysis.confidenceScore}% Ready
            </span>
          </div>
          <div className="w-16 h-2 rounded-full bg-stone-700 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFullyReady ? "bg-emerald-500" : "bg-amber-400"
              }`}
              style={{ width: `${analysis.confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Understanding Summary */}
      <div className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-700/50 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agent's Comprehension of Your Request:</span>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed italic">
          "{analysis.understandingSummary}"
        </p>
      </div>

      {/* Two Columns: Confirmed Aspects & Clarification Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Confirmed Checklist (5 cols) */}
        <div className="lg:col-span-5 bg-stone-800/40 p-4 rounded-xl border border-stone-800 space-y-3">
          <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified Aspects
          </h3>

          <div className="space-y-2">
            {analysis.confirmedAspects.length > 0 ? (
              analysis.confirmedAspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-stone-900/50 border border-stone-800/60 text-xs"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 font-medium block text-[11px]">
                      {aspect.label}:
                    </span>
                    <span className="text-stone-200 font-medium">{aspect.value}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 italic">
                Enter your details above to confirm aspects.
              </p>
            )}
          </div>

          {/* Letter Structure Preview Outline */}
          {analysis.previewOutline.length > 0 && (
            <div className="pt-2 border-t border-stone-800 space-y-1.5">
              <h4 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Drafting Structure Outline:
              </h4>
              <ul className="text-[11px] text-stone-400 space-y-1 pl-3 list-disc">
                {analysis.previewOutline.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Clarification Questions (7 cols) */}
        <div className="lg:col-span-7 bg-stone-800/40 p-4 rounded-xl border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              Agent Questions & Clarifications ({unansweredCount} pending)
            </h3>
            <button
              type="button"
              onClick={onRecheckDetails}
              className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Re-analyze
            </button>
          </div>

          {analysis.clarificationQuestions.length > 0 ? (
            <div className="space-y-3">
              {analysis.clarificationQuestions.map((q: ClarificationQuestion) => {
                const isAnswered = Boolean(q.userAnswer && q.userAnswer.trim());
                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isAnswered
                        ? "bg-emerald-950/20 border-emerald-800/40"
                        : "bg-stone-900/80 border-amber-500/40 ring-1 ring-amber-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-start gap-1.5">
                        <HelpCircle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isAnswered ? "text-emerald-400" : "text-amber-400"
                          }`}
                        />
                        <span className="text-xs font-semibold text-white">
                          {q.question}
                        </span>
                      </div>
                      {isAnswered ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 font-medium">
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300 font-medium">
                          Needs Answer
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-400 ml-5 mb-2.5">
                      <strong className="text-stone-400 font-medium">Why the agent asks:</strong> {q.whyNeeded}
                    </p>

                    {/* Quick Choice Buttons */}
                    {q.quickOptions && q.quickOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 ml-5 mb-2">
                        {q.quickOptions.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => onAnswerQuestion(q.id, opt)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                              q.userAnswer === opt
                                ? "bg-amber-500 text-stone-950 border-amber-400 font-semibold"
                                : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Freeform Answer Input / Voice Input */}
                    <div className="flex items-center gap-1.5 ml-5">
                      <input
                        type="text"
                        value={q.userAnswer || ""}
                        onChange={(e) => onAnswerQuestion(q.id, e.target.value)}
                        placeholder="Or type/speak specific details..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-stone-950 border border-stone-700 text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVoiceQuestionId(q.id);
                          toggleListening();
                        }}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isListening && activeVoiceQuestionId === q.id
                            ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                            : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
                        }`}
                        title="Answer this question with your voice"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-center space-y-2">
              <FileCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs text-stone-300">
                No outstanding clarification questions! Everything required to craft your letter is clearly understood.
              </p>
            </div>
          )}

          {/* Suggested Improvements if any */}
          {analysis.suggestedImprovements && analysis.suggestedImprovements.length > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Agent Tip for Maximum Effectiveness:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                {analysis.suggestedImprovements.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-stone-400">
          {unansweredCount > 0 ? (
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {unansweredCount} question{unansweredCount > 1 ? "s" : ""} remaining for full clarity.
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verification complete. Ready to synthesize your custom letter.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {unansweredCount > 0 && (
            <button
              type="button"
              id="btn-force-generate"
              onClick={() => onGenerateLetter(true)}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-700 transition-colors"
            >
              Draft with current details
            </button>
          )}

          <button
            type="button"
            id="btn-generate-confirmed-letter"
            onClick={() => onGenerateLetter(false)}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
              isFullyReady
                ? "bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold hover:scale-[1.02]"
                : "bg-amber-600 hover:bg-amber-500 text-stone-950"
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Drafting Letter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isFullyReady ? "Generate Verified Letter" : "Confirm & Generate Letter"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
