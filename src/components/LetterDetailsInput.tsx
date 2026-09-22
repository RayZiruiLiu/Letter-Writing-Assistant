import React, { useState } from "react";
import {
  Mic,
  MicOff,
  User,
  Users,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Volume2,
} from "lucide-react";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { ScenarioItem } from "../types";

interface LetterDetailsInputProps {
  sender: string;
  onChangeSender: (sender: string) => void;
  senderAddress: string;
  onChangeSenderAddress: (addr: string) => void;
  recipient: string;
  onChangeRecipient: (recipient: string) => void;
  recipientAddress: string;
  onChangeRecipientAddress: (addr: string) => void;
  details: string;
  onChangeDetails: (details: string) => void;
  selectedScenario: ScenarioItem;
}

export const LetterDetailsInput: React.FC<LetterDetailsInputProps> = ({
  sender,
  onChangeSender,
  senderAddress,
  onChangeSenderAddress,
  recipient,
  onChangeRecipient,
  recipientAddress,
  onChangeRecipientAddress,
  details,
  onChangeDetails,
  selectedScenario,
}) => {
  const [showAddressFields, setShowAddressFields] = useState(false);

  // Handle real-time speech dictation
  const handleSpeechChunk = (chunk: string) => {
    onChangeDetails(details ? `${details} ${chunk}` : chunk);
  };

  const {
    isListening,
    interimTranscript,
    isSupported,
    errorMessage,
    toggleListening,
  } = useVoiceInput(handleSpeechChunk);

  const handleInsertSuggestedDetails = () => {
    const template = `Key details to include:
- Objective: ${selectedScenario.title}
- Background context: ${selectedScenario.suggestedDetails}
- Specific facts, dates, or numbers: (e.g. March 15th, Project Olympus, 104 Elm St)
- Key sentiment or message: 
- What I hope will happen next: ${selectedScenario.suggestedCTA}`;

    if (!details.trim()) {
      onChangeDetails(template);
    } else {
      onChangeDetails(`${details}\n\n${template}`);
    }
  };

  return (
    <div
      id="letter-details-input-section"
      className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
            <User className="w-4 h-4 text-stone-700" />
            3. Letter Parties & Core Context
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Who is this letter from, who is it to, and what specific facts or feelings must it convey?
          </p>
        </div>

        <button
          type="button"
          id="btn-toggle-addresses"
          onClick={() => setShowAddressFields(!showAddressFields)}
          className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2 self-start sm:self-center"
        >
          {showAddressFields ? "Hide addresses / letterhead info" : "+ Add formal addresses & letterhead info"}
        </button>
      </div>

      {/* Sender and Recipient Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Sender */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-stone-500" />
            Sender Name / Identity <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="input-sender-name"
            value={sender}
            onChange={(e) => onChangeSender(e.target.value)}
            placeholder="e.g. Jordan Miller, Senior Product Designer"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 bg-stone-50/50"
          />

          {showAddressFields && (
            <input
              type="text"
              id="input-sender-address"
              value={senderAddress}
              onChange={(e) => onChangeSenderAddress(e.target.value)}
              placeholder="Sender address, phone, or email (optional for formal header)"
              className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 bg-stone-50/30 text-stone-600"
            />
          )}
        </div>

        {/* Recipient */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-stone-500" />
            Recipient Name / Organization <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="input-recipient-name"
            value={recipient}
            onChange={(e) => onChangeRecipient(e.target.value)}
            placeholder="e.g. Dr. Eleanor Vance, Department Chair / Landlord Mr. Gable"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 bg-stone-50/50"
          />

          {showAddressFields && (
            <input
              type="text"
              id="input-recipient-address"
              value={recipientAddress}
              onChange={(e) => onChangeRecipientAddress(e.target.value)}
              placeholder="Recipient address, suite, or organization (optional)"
              className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 bg-stone-50/30 text-stone-600"
            />
          )}
        </div>
      </div>

      {/* Main Details Input with Voice Dictation */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <span>What do you want to say, explain, or request?</span>
            <span className="text-stone-400 font-normal">
              (Speak or type in your own natural words)
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-insert-template"
              onClick={handleInsertSuggestedDetails}
              className="flex items-center gap-1 text-xs text-amber-900 hover:text-amber-950 font-medium px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Insert Scenario Prompts
            </button>

            {/* Voice Transcription Button */}
            <button
              type="button"
              id="btn-voice-dictation"
              onClick={toggleListening}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse shadow-md"
                  : "bg-stone-900 text-stone-50 hover:bg-stone-800"
              }`}
              title={isListening ? "Click to stop recording" : "Click to speak your letter details"}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-white" />
                  <span>Listening... Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dictate by Voice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Audio Feedback Banner if listening */}
        {isListening && (
          <div className="flex items-center justify-between px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span className="font-medium">
                Microphone is active. Speak your thoughts naturally...
              </span>
            </div>
            {interimTranscript && (
              <span className="italic text-rose-700 truncate max-w-xs text-[11px]">
                "{interimTranscript}"
              </span>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            id="textarea-letter-details"
            rows={5}
            value={details}
            onChange={(e) => onChangeDetails(e.target.value)}
            placeholder={`Type or dictate freely. For example: "I need to tell my landlord Mr. Gable that our hot water heater has been leaking since Monday, March 2nd. I tried calling twice. I want him to send a licensed plumber by this Friday, and I need written confirmation."`}
            className="w-full p-3 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 bg-stone-50/50 leading-relaxed font-sans"
          />
          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 mt-1">
            <span>
              {details.length} characters{" "}
              {details.length < 30 && "(Add a few more details so the assistant can review)"}
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              The agent will review these details and ask clarifying questions if anything is missing.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
