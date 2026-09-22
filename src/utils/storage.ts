import { ChildProfile, Milestone, PlayActivity, MonthAlertRecord } from '../types';
import { OFFICIAL_MILESTONES } from '../data/milestonesData';
import { CURATED_ACTIVITIES } from '../data/curatedActivities';

const STORAGE_KEYS = {
  CHILD_PROFILE: 'nurtureplay_active_child_profile',
  CHILD_PROFILES_LIST: 'nurtureplay_all_child_profiles',
  MILESTONES: 'nurtureplay_milestones',
  FAVORITES: 'nurtureplay_favorite_activities',
  DARK_MODE: 'nurtureplay_dark_mode',
  DOCTOR_NOTES: 'nurtureplay_doctor_notes',
  MONTH_ALERT: 'nurtureplay_month_alert_record',
};

// Default child profile (e.g. 10 months old based on 2026 current date)
export const DEFAULT_CHILD_PROFILE: ChildProfile = {
  id: 'child-default-1',
  name: 'Maya',
  birthDate: '2025-11-15', // ~10 months old relative to 2026-09
  isAdjustedAge: false,
  notes: 'Loves curious sensory play, music rhythms, and pulling up on the coffee table.',
};

export function loadChildProfile(): ChildProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHILD_PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error loading child profile from storage', e);
  }
  return DEFAULT_CHILD_PROFILE;
}

export function saveChildProfile(profile: ChildProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHILD_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.warn('Error saving child profile', e);
  }
}

export function loadMilestones(): Milestone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with official list in case of updates
      const savedMap = new Map<string, Milestone>(parsed.map((m: Milestone) => [m.id, m]));
      return OFFICIAL_MILESTONES.map((m) => {
        const saved = savedMap.get(m.id);
        return saved ? { ...m, status: saved.status, flaggedForDoctor: saved.flaggedForDoctor, doctorNote: saved.doctorNote, loggedDate: saved.loggedDate } : m;
      });
    }
  } catch (e) {
    console.warn('Error loading milestones', e);
  }
  return OFFICIAL_MILESTONES;
}

export function saveMilestones(milestones: Milestone[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  } catch (e) {
    console.warn('Error saving milestones', e);
  }
}

export function loadFavorites(): PlayActivity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (raw) {
      return JSON.parse(raw);
    }
    // Default 2 starter favorites so the favorites tab isn't empty
    return [
      { ...CURATED_ACTIVITIES[3], isFavorite: true, favoriteNote: 'Loved this on Sunday morning!' },
      { ...CURATED_ACTIVITIES[4], isFavorite: true, favoriteNote: 'So quiet and calming while cooking.' },
    ];
  } catch (e) {
    console.warn('Error loading favorites', e);
  }
  return [];
}

export function saveFavorites(favorites: PlayActivity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (e) {
    console.warn('Error saving favorites', e);
  }
}

export function loadDarkMode(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (raw !== null) {
      return raw === 'true';
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  } catch (e) {
    console.warn('Error loading dark mode setting', e);
  }
  return false;
}

export function saveDarkMode(isDark: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark ? 'true' : 'false');
  } catch (e) {
    console.warn('Error saving dark mode setting', e);
  }
}

export function loadMonthAlertRecord(): MonthAlertRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MONTH_ALERT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error loading month alert record', e);
  }
  return {
    lastAcknowledgedMonth: 0,
    enableBrowserNotifications: false,
  };
}

export function saveMonthAlertRecord(record: MonthAlertRecord): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MONTH_ALERT, JSON.stringify(record));
  } catch (e) {
    console.warn('Error saving month alert record', e);
  }
}

export function acknowledgeMonthAlert(month: number): MonthAlertRecord {
  const current = loadMonthAlertRecord();
  const updated: MonthAlertRecord = {
    ...current,
    lastAcknowledgedMonth: Math.max(current.lastAcknowledgedMonth, month),
    lastNotifiedDate: new Date().toISOString(),
  };
  saveMonthAlertRecord(updated);
  return updated;
}
