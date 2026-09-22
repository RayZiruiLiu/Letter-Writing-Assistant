export type ScenarioCategory = "Professional" | "Personal" | "Official" | "Academic";

export interface ScenarioItem {
  id: string;
  title: string;
  category: ScenarioCategory;
  description: string;
  iconName: string;
  defaultTone: string;
  suggestedDetails: string;
  suggestedCTA: string;
}

export interface ToneOption {
  id: string;
  label: string;
  description: string;
  badgeColor: string;
}

export interface LengthOption {
  id: string;
  label: string;
  words: string;
  paragraphs: string;
  description: string;
}

export interface FormatStyleOption {
  id: string;
  name: string;
  description: string;
  previewBg: string;
  fontFamily: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  whyNeeded: string;
  quickOptions: string[];
  userAnswer?: string;
}

export interface ConfirmedAspect {
  label: string;
  value: string;
  category: string;
}

export interface AnalysisResult {
  isReady: boolean;
  confidenceScore: number;
  understandingSummary: string;
  confirmedAspects: ConfirmedAspect[];
  clarificationQuestions: ClarificationQuestion[];
  suggestedImprovements?: string[];
  previewOutline: string[];
}

export interface GeneratedLetter {
  id: string;
  title: string;
  date: string;
  senderName: string;
  senderTitleOrAddress?: string;
  recipientName: string;
  recipientTitleOrAddress?: string;
  subject?: string;
  salutation: string;
  paragraphs: string[];
  signOff: string;
  postScript?: string;
  keyHighlights: string[];
  deliveryTips: string[];
  scenario: string;
  tone: string;
  formatStyle: string;
  createdAt: number;
}
