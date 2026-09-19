export type MilestoneDomain = 'social' | 'language' | 'cognitive' | 'movement';
export type MilestoneStatus = 'reached' | 'in_progress' | 'not_yet_seen';
export type MessLevel = 'Zero mess' | 'Low / Easy wipe' | 'Water play' | 'Moderate';
export type ActivityDifficulty = 'easier' | 'just_right' | 'more_challenging';

export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  isAdjustedAge?: boolean;
  dueDate?: string; // If born prematurely
  avatarColor?: string;
  notes?: string;
}

export interface AgeCalculation {
  totalMonths: number;
  years: number;
  remainingMonths: number;
  days: number;
  formattedString: string;
  stageName: 'Infant' | 'Older Infant' | 'Toddler' | 'Preschooler';
  milestoneAgeBand: number; // Closest lower or equal milestone checkpoint (e.g. 2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60)
}

export interface HouseholdObject {
  id: string;
  name: string;
  category: 'Kitchen' | 'Paper & Cardboard' | 'Soft & Textiles' | 'Sensory & Water' | 'Everyday Odds';
  icon?: string;
}

export interface PlayActivity {
  id: string;
  title: string;
  oneLiner: string;
  targetAgeMonthsMin: number;
  targetAgeMonthsMax: number;
  prepMinutes: number;
  playDurationMinutes: number;
  materialsNeeded: string[];
  steps: string[];
  skillsFostered: string[];
  messLevel: MessLevel;
  safetyNote: string;
  quickVariation?: string;
  simplifyTip?: string;
  challengeTip?: string;
  calmTipForParent?: string;
  mood?: 'calm' | 'active' | 'sensory' | 'independent' | 'any';
  difficulty?: ActivityDifficulty;
  isFavorite?: boolean;
  favoriteNote?: string;
  dateAdded?: string;
}

export interface Milestone {
  id: string;
  ageMonths: number; // e.g. 2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60
  domain: MilestoneDomain;
  title: string;
  description: string;
  whatToLookFor: string;
  gentleHomePractice: string;
  status: MilestoneStatus;
  loggedDate?: string;
  flaggedForDoctor?: boolean;
  doctorNote?: string;
}

export interface DevelopmentalResource {
  id: string;
  title: string;
  organization: string;
  description: string;
  helpfulFor: string;
  externalUrl: string;
  type: 'Free Public Program' | 'Pediatric Guide' | 'Play & Development' | 'Support Hotline';
}
