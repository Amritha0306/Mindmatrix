
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  explanation: string;
  sideEffects: string;
  times: string[]; // e.g., ["08:00", "20:00"]
  lastTaken?: string; // ISO string
  createdAt: string;
}

export interface AnalysisResult {
  medications: Array<Omit<Medication, 'id' | 'createdAt' | 'lastTaken'>>;
  generalAdvice?: string;
}

export type ViewState = 'dashboard' | 'add' | 'detail';
