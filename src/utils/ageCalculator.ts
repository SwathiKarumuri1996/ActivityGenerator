import { AgeCalculation, ChildProfile } from '../types';

export const MILESTONE_AGE_BANDS = [2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60];

export function calculateChildAge(profile: ChildProfile, referenceDate: Date = new Date()): AgeCalculation {
  const birthDateStr = profile.isAdjustedAge && profile.dueDate ? profile.dueDate : profile.birthDate;
  const birth = new Date(birthDateStr);
  const now = referenceDate;

  // Total milliseconds difference
  const diffTime = Math.max(0, now.getTime() - birth.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calendar difference
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalMonths = Math.max(0, years * 12 + months);

  // Friendly formatted string
  let formattedString = '';
  if (totalMonths < 1) {
    const weeks = Math.max(1, Math.floor(diffDays / 7));
    formattedString = `${weeks} week${weeks === 1 ? '' : 's'} old (${diffDays} days)`;
  } else if (totalMonths < 12) {
    formattedString = `${totalMonths} month${totalMonths === 1 ? '' : 's'} old`;
  } else if (totalMonths < 24) {
    const remaining = totalMonths % 12;
    formattedString = remaining === 0 
      ? '1 year old (12 months)' 
      : `1 yr, ${remaining} mo old (${totalMonths} months)`;
  } else {
    const rem = totalMonths % 12;
    formattedString = rem === 0 
      ? `${years} years old` 
      : `${years} yrs, ${rem} mo old`;
  }

  // Determine stage
  let stageName: AgeCalculation['stageName'] = 'Infant';
  if (totalMonths < 6) {
    stageName = 'Infant';
  } else if (totalMonths < 12) {
    stageName = 'Older Infant';
  } else if (totalMonths < 36) {
    stageName = 'Toddler';
  } else {
    stageName = 'Preschooler';
  }

  // Find the closest standard milestone checkpoint
  let milestoneAgeBand = MILESTONE_AGE_BANDS[0];
  for (const band of MILESTONE_AGE_BANDS) {
    if (totalMonths >= band) {
      milestoneAgeBand = band;
    } else {
      break;
    }
  }

  return {
    totalMonths,
    years,
    remainingMonths: months,
    days: diffDays,
    formattedString,
    stageName,
    milestoneAgeBand,
  };
}

/**
 * Checks if a child is past the typical window for a milestone.
 * For example, if milestone is expected around 9 months, and child is >= 11 months,
 * we consider it past the milestone checkpoint so parent can gently ask pediatrician.
 */
export function isPastMilestoneAge(childAgeMonths: number, milestoneAgeMonths: number): boolean {
  // Grace margin: typically 1.5 - 2 months past milestone age checkpoint
  const margin = milestoneAgeMonths <= 6 ? 1.5 : milestoneAgeMonths <= 18 ? 2 : 3;
  return childAgeMonths >= milestoneAgeMonths + margin;
}
