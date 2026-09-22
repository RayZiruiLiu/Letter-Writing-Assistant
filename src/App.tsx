import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { CustomizationBar } from "./components/CustomizationBar";
import { LetterDetailsInput } from "./components/LetterDetailsInput";
import { AgentReviewGate } from "./components/AgentReviewGate";
import { LetterPreview } from "./components/LetterPreview";
import { DraftsHistoryModal } from "./components/DraftsHistoryModal";
import { SCENARIOS } from "./constants";
import {
  ScenarioItem,
  AnalysisResult,
  GeneratedLetter,
} from "./types";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Sliders,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const STORAGE_KEY = "letter_writing_assistant_drafts_v1";

export default function App() {
  // 1. Core State
  const [selectedScenario, setSelectedScenario] = useState<ScenarioItem>(SCENARIOS[0]);
  const [selectedTone, setSelectedTone] = useState<string>(SCENARIOS[0].defaultTone);
  const [selectedLength, setSelectedLength] = useState<string>("Standard & Balanced");
  const [selectedFormatStyle, setSelectedFormatStyle] = useState<string>("classic_stationery");
  const [selectedCTA, setSelectedCTA] = useState<string>(SCENARIOS[0].suggestedCTA);

  const [sender, setSender] = useState<string>("");
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  // Clarification questions answered by user
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});

  // Workflow steps: "compose" -> "review" -> "letter"
  const [activeStep, setActiveStep] = useState<"compose" | "review" | "letter">("compose");

  // API State
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Result letter & Saved history
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);
  const [savedLetters, setSavedLetters] = useState<GeneratedLetter[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load saved drafts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedLetters(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read localStorage drafts:", e);
    }
  }, []);

  // Save drafts to localStorage helper
  const handleSaveToHistory = (letterToSave: GeneratedLetter) => {
    try {
      const existing = savedLetters.filter((l) => l.id !== letterToSave.id);
      const updated = [letterToSave, ...existing];
      setSavedLetters(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }
  };

  const handleDeleteSavedLetter = (letterId: string) => {
    const updated = savedLetters.filter((l) => l.id !== letterId);
    setSavedLetters(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to delete from localStorage:", e);
    }
  };

  // Scenario change handler
  const handleSelectScenario = (scenario: ScenarioItem) => {
    setSelectedScenario(scenario);
    setSelectedTone(scenario.defaultTone);
    setSelectedCTA(scenario.suggestedCTA);
    // Invalidate stale analysis
    setAnalysis(null);
  };

  // 1. Analyze and Check Details before generating
  const handleCheckDetails = async () => {
    setGeneralError(null);
    if (!recipient.trim() && !details.trim()) {
      setGeneralError("Please provide at least the recipient name or what you want to say so the agent can review your letter.");
      return;
    }

    setIsAnalyzing(true);
    setActiveStep("review");

    try {
      const response = await fetch("/api/check-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: sender.trim(),
          recipient: recipient.trim(),
          scenario: selectedScenario.title,
          tone: selectedTone,
          length: selectedLength,
          formatStyle: selectedFormatStyle,
          callToAction: selectedCTA,
          details: details.trim(),
          answeredQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error("Check letter failed:", err);
      setGeneralError("Unable to analyze details. You may proceed directly to draft the letter.");
      // Fallback analysis structure so user is never blocked
      setAnalysis({
        isReady: true,
        confidenceScore: 80,
        understandingSummary: `Drafting a ${selectedTone.toLowerCase()} letter for ${recipient || "the recipient"} regarding ${selectedScenario.title}.`,
        confirmedAspects: [
          { label: "Scenario", value: selectedScenario.title, category: "Scenario" },
          { label: "Tone", value: selectedTone, category: "Tone" },
          { label: "Recipient", value: recipient || "Specified Recipient", category: "Recipient" },
        ],
        clarificationQuestions: [],
        previewOutline: ["Opening & Context", "Primary Details", "Call to Action & Closing"],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle answering clarification questions
  const handleAnswerQuestion = (questionId: string, answer: string) => {
    const updated = { ...answeredQuestions, [questionId]: answer };
    setAnsweredQuestions(updated);

    if (analysis) {
      const updatedQuestions = analysis.clarificationQuestions.map((q) =>
        q.id === questionId ? { ...q, userAnswer: answer } : q
      );

      const unansweredLeft = updatedQuestions.filter((q) => !q.userAnswer || !q.userAnswer.trim()).length;
      setAnalysis({
        ...analysis,
        clarificationQuestions: updatedQuestions,
        isReady: unansweredLeft === 0,
        confidenceScore: Math.min(100, analysis.confidenceScore + 15),
      });
    }
  };

  // 2. Generate Full Letter
  const handleGenerateLetter = async (force: boolean = false) => {
    setIsGenerating(true);
    setGeneralError(null);

    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: sender.trim() || "The Writer",
          recipient: recipient.trim() || "The Recipient",
          scenario: selectedScenario.title,
          tone: selectedTone,
          length: selectedLength,
          formatStyle: selectedFormatStyle,
          callToAction: selectedCTA,
          details: details.trim(),
          answeredQuestions,
          confirmedAspects: analysis?.confirmedAspects || [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const newLetter: GeneratedLetter = {
        id: "letter_" + Date.now(),
        title: `${selectedScenario.title} - ${recipient || "Recipient"}`,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        senderName: data.senderName || sender || "Sincerely,",
        senderTitleOrAddress: senderAddress,
        recipientName: recipient || "Recipient",
        recipientTitleOrAddress: recipientAddress,
        subject: data.subject || "",
        salutation: data.salutation || "Dear Recipient,",
        paragraphs: data.paragraphs || [],
        signOff: data.signOff || "Sincerely,",
        postScript: data.postScript || "",
        keyHighlights: data.keyHighlights || [],
        deliveryTips: data.deliveryTips || [],
        scenario: selectedScenario.title,
        tone: selectedTone,
        formatStyle: selectedFormatStyle,
        createdAt: Date.now(),
      };

      setGeneratedLetter(newLetter);
      setActiveStep("letter");
      // Auto-save to history
      handleSaveToHistory(newLetter);
    } catch (err: any) {
      console.error("Failed to generate letter:", err);
      setGeneralError(err.message || "Failed to generate letter. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. AI Refinement
  const handleRefineWithAI = async (instruction: string) => {
    if (!generatedLetter) return;
    setIsRefining(true);
    setGeneralError(null);

    try {
      const response = await fetch("/api/refine-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLetter: generatedLetter,
          instruction,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refine letter`);
      }

      const data = await response.json();
      const updatedLetter: GeneratedLetter = {
        ...generatedLetter,
        subject: data.subject !== undefined ? data.subject : generatedLetter.subject,
        salutation: data.salutation || generatedLetter.salutation,
        paragraphs: data.paragraphs || generatedLetter.paragraphs,
        signOff: data.signOff || generatedLetter.signOff,
        senderName: data.senderName || generatedLetter.senderName,
        postScript: data.postScript !== undefined ? data.postScript : generatedLetter.postScript,
      };

      setGeneratedLetter(updatedLetter);
      handleSaveToHistory(updatedLetter);
    } catch (err: any) {
      console.error("Refinement error:", err);
      setGeneralError("Refinement request failed. Please retry.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleResetNewLetter = () => {
    setSelectedScenario(SCENARIOS[0]);
    setSelectedTone(SCENARIOS[0].defaultTone);
    setSelectedLength("Standard & Balanced");
    setSelectedFormatStyle("classic_stationery");
    setSelectedCTA(SCENARIOS[0].suggestedCTA);
    setSender("");
    setSenderAddress("");
    setRecipient("");
    setRecipientAddress("");
    setDetails("");
    setAnsweredQuestions({});
    setAnalysis(null);
    setGeneratedLetter(null);
    setActiveStep("compose");
    setGeneralError(null);
  };

  const isCurrentLetterSaved = Boolean(
    generatedLetter && savedLetters.some((l) => l.id === generatedLetter.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f6] text-stone-900 font-sans">
      {/* App Header */}
      <Header
        onNewLetter={handleResetNewLetter}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedLetters.length}
      />

      {/* Main Workflow Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Step Indicator */}
        <nav
          aria-label="Workflow progress"
          className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setActiveStep("compose")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeStep === "compose"
                  ? "bg-stone-900 text-stone-50 shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>1. Configure & Details</span>
            </button>

            <span className="text-stone-300">/</span>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (analysis) setActiveStep("review");
                else handleCheckDetails();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeStep === "review"
                  ? "bg-amber-800 text-amber-50 shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Detail Verification</span>
              {analysis && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-700 text-amber-100">
                  {analysis.confidenceScore}%
                </span>
              )}
            </button>

            <span className="text-stone-300">/</span>

            {/* Step 3 */}
            <button
              type="button"
              disabled={!generatedLetter}
              onClick={() => setActiveStep("letter")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeStep === "letter"
                  ? "bg-emerald-800 text-emerald-50 shadow-xs"
                  : generatedLetter
                  ? "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  : "text-stone-400 opacity-50 cursor-not-allowed"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>3. Finished Letter</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden md:inline">
              Scenario: <strong className="text-stone-800 font-medium">{selectedScenario.title}</strong>
            </span>
          </div>
        </nav>

        {/* Global Error Banner if any */}
        {generalError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{generalError}</span>
            </div>
            <button
              type="button"
              onClick={() => setGeneralError(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STEP 1: Compose, Select Scenario, Customize Tone, Dictate/Type */}
        {activeStep === "compose" && (
          <div className="space-y-6">
            {/* Section 1: Scenario Selector */}
            <ScenarioSelector
              selectedScenarioId={selectedScenario.id}
              onSelectScenario={handleSelectScenario}
            />

            {/* Section 2: Customization Bar (Tone, Length, Style, CTA) */}
            <CustomizationBar
              selectedTone={selectedTone}
              onChangeTone={setSelectedTone}
              selectedLength={selectedLength}
              onChangeLength={setSelectedLength}
              selectedFormatStyle={selectedFormatStyle}
              onChangeFormatStyle={setSelectedFormatStyle}
              selectedCTA={selectedCTA}
              onChangeCTA={setSelectedCTA}
            />

            {/* Section 3: Letter Details & Voice Input */}
            <LetterDetailsInput
              sender={sender}
              onChangeSender={setSender}
              senderAddress={senderAddress}
              onChangeSenderAddress={setSenderAddress}
              recipient={recipient}
              onChangeRecipient={setRecipient}
              recipientAddress={recipientAddress}
              onChangeRecipientAddress={setRecipientAddress}
              details={details}
              onChangeDetails={setDetails}
              selectedScenario={selectedScenario}
            />

            {/* Bottom Proceed Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">
                  Ready for the Assistant to Review?
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  The agent will inspect all details, confirm the intent, and check for any missing nuances before crafting.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-review-proceed"
                  onClick={handleCheckDetails}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-md transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Check Details & Consult Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Agent Consultation & Detail Verification */}
        {activeStep === "review" && (
          <div className="space-y-6">
            <AgentReviewGate
              analysis={analysis}
              isLoading={isAnalyzing}
              onAnswerQuestion={handleAnswerQuestion}
              onGenerateLetter={handleGenerateLetter}
              onRecheckDetails={handleCheckDetails}
              isGenerating={isGenerating}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveStep("compose")}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Back to Adjust Components</span>
              </button>

              {generatedLetter && (
                <button
                  type="button"
                  onClick={() => setActiveStep("letter")}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <span>View Current Letter Draft</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Letter Preview, Direct Edit, Refinement, Send & Print */}
        {activeStep === "letter" && generatedLetter && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <button
                type="button"
                onClick={() => setActiveStep("review")}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Back to Agent Verification</span>
              </button>

              <button
                type="button"
                onClick={handleResetNewLetter}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-100/70 hover:bg-amber-200/70 border border-amber-300 rounded-xl transition-colors"
              >
                <span>Draft Another Letter</span>
              </button>
            </div>

            <LetterPreview
              letter={generatedLetter}
              onUpdateLetter={setGeneratedLetter}
              onSaveToHistory={handleSaveToHistory}
              isSaved={isCurrentLetterSaved}
              onRefineWithAI={handleRefineWithAI}
              isRefining={isRefining}
            />
          </div>
        )}
      </main>

      {/* Saved Drafts History Slide-over/Modal */}
      <DraftsHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedLetters={savedLetters}
        onSelectLetter={(letter) => {
          setGeneratedLetter(letter);
          setSelectedTone(letter.tone);
          setSelectedFormatStyle(letter.formatStyle);
          setSender(letter.senderName);
          setRecipient(letter.recipientName);
          setActiveStep("letter");
        }}
        onDeleteLetter={handleDeleteSavedLetter}
      />
    </div>
  );
}
