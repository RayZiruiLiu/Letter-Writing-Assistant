import {
  ScenarioItem,
  ToneOption,
  LengthOption,
  FormatStyleOption,
} from "./types";

export const SCENARIOS: ScenarioItem[] = [
  // Professional
  {
    id: "job_application",
    title: "Cover Letter / Job Application",
    category: "Professional",
    description: "Compelling introduction highlighting your strengths and enthusiasm for a role.",
    iconName: "Briefcase",
    defaultTone: "Persuasive & Compelling",
    suggestedDetails: "Target company name, job role, key experience/achievements to highlight, why I'm interested in their mission.",
    suggestedCTA: "Request an introductory interview",
  },
  {
    id: "resignation",
    title: "Formal Resignation",
    category: "Professional",
    description: "Graceful, courteous notice of departure while maintaining professional relationships.",
    iconName: "LogOut",
    defaultTone: "Polite & Diplomatic",
    suggestedDetails: "Current position, final working date (notice period), offer to assist with transition and knowledge handover.",
    suggestedCTA: "Confirm transition timeline and next steps",
  },
  {
    id: "raise_promotion",
    title: "Salary or Promotion Request",
    category: "Professional",
    description: "Evidence-based proposal outlining your recent achievements and value added.",
    iconName: "TrendingUp",
    defaultTone: "Assertive & Firm",
    suggestedDetails: "Recent milestones, exceeded KPIs, expanded responsibilities, target title or salary benchmark.",
    suggestedCTA: "Schedule a review meeting to discuss career progression",
  },
  {
    id: "professional_recommendation",
    title: "Letter of Recommendation",
    category: "Professional",
    description: "Strong endorsement of a colleague, employee, or student's work ethic and character.",
    iconName: "Award",
    defaultTone: "Warm & Sincere",
    suggestedDetails: "Person being recommended, capacity in which we worked together, specific project achievements, notable qualities.",
    suggestedCTA: "Offer to provide further details upon request",
  },
  {
    id: "business_apology",
    title: "Professional Apology / Amends",
    category: "Professional",
    description: "Take accountability for a delay or mistake with immediate corrective remedies.",
    iconName: "ShieldAlert",
    defaultTone: "Apologetic & Empathetic",
    suggestedDetails: "Specific project or delivery affected, root cause briefly acknowledged, corrective steps taken, future prevention.",
    suggestedCTA: "Offer compensation, revised delivery, or phone debrief",
  },

  // Official / Formal
  {
    id: "landlord_notice",
    title: "Landlord Notice or Repair Request",
    category: "Official",
    description: "Formal written notice regarding maintenance, lease terms, or security deposit.",
    iconName: "Home",
    defaultTone: "Formal & Dignified",
    suggestedDetails: "Apartment unit address, specific maintenance issue (e.g. leaking pipe, heating), dates issue noticed, required fix date.",
    suggestedCTA: "Request confirmation of scheduled repair within 48 hours",
  },
  {
    id: "customer_complaint",
    title: "Formal Complaint / Dispute",
    category: "Official",
    description: "Structured dispute letter demanding resolution, refund, or service rectification.",
    iconName: "FileWarning",
    defaultTone: "Assertive & Firm",
    suggestedDetails: "Order/transaction number, date of purchase, description of defect/failure, attempts made to resolve.",
    suggestedCTA: "Demand full refund or immediate replacement by specific date",
  },
  {
    id: "official_petition",
    title: "Official Request / Authority Inquiry",
    category: "Official",
    description: "Formal communication to government office, council, HOA, or regulatory body.",
    iconName: "Building2",
    defaultTone: "Formal & Dignified",
    suggestedDetails: "Relevant case reference number, specific regulation or community concern, requested relief or action.",
    suggestedCTA: "Request formal written response and review",
  },

  // Personal
  {
    id: "heartfelt_gratitude",
    title: "Heartfelt Thank You & Gratitude",
    category: "Personal",
    description: "Warm, emotional expression of appreciation for a gift, hospitality, or guidance.",
    iconName: "Heart",
    defaultTone: "Warm & Sincere",
    suggestedDetails: "Specific gift, favor, or occasion, personal meaning it had to me, memorable moment we shared.",
    suggestedCTA: "Express eagerness to reconnect soon",
  },
  {
    id: "personal_reconciliation",
    title: "Reconciliation / Sincere Amends",
    category: "Personal",
    description: "Thoughtful, gentle outreach to mend an estranged relationship or heal past hurt.",
    iconName: "Sparkles",
    defaultTone: "Apologetic & Empathetic",
    suggestedDetails: "Acknowledging past misunderstanding without defensiveness, valuing the relationship, inviting dialogue with no pressure.",
    suggestedCTA: "Open an invitation for a relaxed coffee or call when ready",
  },
  {
    id: "love_letter",
    title: "Love Letter / Anniversary",
    category: "Personal",
    description: "Poetic, meaningful testament of affection, shared milestones, and devotion.",
    iconName: "Smile",
    defaultTone: "Warm & Sincere",
    suggestedDetails: "Years together or milestone occasion, favorite shared memories, qualities I love about them, hopes for our future.",
    suggestedCTA: "Celebrate tonight together",
  },

  // Academic
  {
    id: "professor_request",
    title: "Academic Inquiry / Research Request",
    category: "Academic",
    description: "Respectful outreach to a professor, advisor, or department head.",
    iconName: "GraduationCap",
    defaultTone: "Polite & Diplomatic",
    suggestedDetails: "Course or research interest, specific paper or topic of theirs you admire, requested guidance or supervision opportunity.",
    suggestedCTA: "Inquire about office hours availability or 15-minute meeting",
  },
];

export const TONES: ToneOption[] = [
  {
    id: "formal_dignified",
    label: "Formal & Dignified",
    description: "Structured, refined etiquette; ideal for legal, executive, or institutional correspondence.",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
  },
  {
    id: "polite_diplomatic",
    label: "Polite & Diplomatic",
    description: "Courteous, tactful, and balanced; maintains cordiality and mutual respect.",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  {
    id: "warm_sincere",
    label: "Warm & Sincere",
    description: "Authentic, emotional resonance; perfect for thank yous, friends, and loved ones.",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-300",
  },
  {
    id: "assertive_firm",
    label: "Assertive & Firm",
    description: "Unambiguous, principled, and clear on boundaries, deadlines, or accountability.",
    badgeColor: "bg-rose-50 text-rose-900 border-rose-300",
  },
  {
    id: "persuasive_compelling",
    label: "Persuasive & Compelling",
    description: "Inspiring and benefits-oriented; crafts a strong case for applications or pitches.",
    badgeColor: "bg-blue-50 text-blue-900 border-blue-300",
  },
  {
    id: "casual_conversational",
    label: "Casual & Conversational",
    description: "Relaxed and approachable tone for informal acquaintances and friendly notes.",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-300",
  },
  {
    id: "apologetic_empathetic",
    label: "Apologetic & Empathetic",
    description: "Humble, caring, taking responsibility with genuine understanding and remedy.",
    badgeColor: "bg-purple-50 text-purple-900 border-purple-300",
  },
];

export const LENGTHS: LengthOption[] = [
  {
    id: "concise",
    label: "Concise & Direct",
    words: "120 - 180 words",
    paragraphs: "1 - 2 paragraphs",
    description: "Quick to read, focused on the immediate point and essential request.",
  },
  {
    id: "standard",
    label: "Standard & Balanced",
    words: "250 - 400 words",
    paragraphs: "3 - 4 paragraphs",
    description: "The ideal balance of warm context, core message, and courteous closing.",
  },
  {
    id: "comprehensive",
    label: "Comprehensive & Detailed",
    words: "450 - 700 words",
    paragraphs: "5+ paragraphs",
    description: "In-depth, thorough coverage with full supporting background and next steps.",
  },
];

export const FORMAT_STYLES: FormatStyleOption[] = [
  {
    id: "classic_stationery",
    name: "Classic Ivory Stationery",
    description: "Traditional letterhead layout with date, formal addresses, and elegant serif typography.",
    previewBg: "bg-[#faf8f5] border-[#e7e1d5]",
    fontFamily: "font-serif",
  },
  {
    id: "modern_executive",
    name: "Modern Executive",
    description: "Crisp corporate styling with clean typography and streamlined reference lines.",
    previewBg: "bg-white border-stone-200",
    fontFamily: "font-sans",
  },
  {
    id: "parchment_warm",
    name: "Warm Cotton Card",
    description: "Gentle soft-toned cardstock aesthetic for intimate personal and heartfelt notes.",
    previewBg: "bg-[#fdfaf3] border-[#ecdcc7]",
    fontFamily: "font-serif",
  },
  {
    id: "official_docket",
    name: "Official Formal Docket",
    description: "Structured legal/regulatory layout with official reference header and formal docket numbering.",
    previewBg: "bg-[#f8fafc] border-slate-200",
    fontFamily: "font-mono",
  },
];

export const CALL_TO_ACTIONS = [
  "Request a meeting or call",
  "Acknowledge and confirm receipt",
  "Request formal resolution or refund",
  "Express warm gratitude & stay in touch",
  "Offer assistance with transition",
  "Submit application for review",
  "Request an urgent answer by a specific deadline",
];
