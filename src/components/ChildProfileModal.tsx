import React, { useState } from 'react';
import { X, Baby, Calendar, Check, Info, Bell } from 'lucide-react';
import { ChildProfile, AgeCalculation } from '../types';
import { calculateChildAge } from '../utils/ageCalculator';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ChildProfile;
  onSaveProfile: (profile: ChildProfile) => void;
  onTriggerMonthAlertTest?: () => void;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onTriggerMonthAlertTest,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [birthDate, setBirthDate] = useState(currentProfile.birthDate);
  const [isAdjustedAge, setIsAdjustedAge] = useState(!!currentProfile.isAdjustedAge);
  const [dueDate, setDueDate] = useState(currentProfile.dueDate || '');
  const [notes, setNotes] = useState(currentProfile.notes || '');

  if (!isOpen) return null;

  // Preview age calculation based on current form values
  const previewProfile: ChildProfile = {
    ...currentProfile,
    name: name || 'Child',
    birthDate: birthDate || currentProfile.birthDate,
    isAdjustedAge,
    dueDate,
  };
  const previewAge = calculateChildAge(previewProfile);

  // Quick age setter helper (subtracts months from today)
  const setQuickAgeMonths = (monthsAgo: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    setBirthDate(d.toISOString().split('T')[0]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...currentProfile,
      name: name.trim() || 'My Child',
      birthDate,
      isAdjustedAge,
      dueDate: isAdjustedAge ? dueDate : undefined,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#182230] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 flex items-center justify-center">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100">
                Child Profile & Age
              </h2>
              <span className="text-xs text-stone-500">
                Age automatically determines all play & milestones
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Child Name */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Child's First Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Maya, Liam, Nora..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Birth Date */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-stone-700 dark:text-stone-300">
                Birth Date
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Current age: {previewAge.formattedString}
              </span>
            </div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            {/* Quick Age Shortcuts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-stone-400 self-center">Quick set:</span>
              {[
                { label: '4 mo', m: 4 },
                { label: '6 mo', m: 6 },
                { label: '9 mo', m: 9 },
                { label: '12 mo', m: 12 },
                { label: '18 mo', m: 18 },
                { label: '2 yr', m: 24 },
                { label: '3 yr', m: 36 },
              ].map((q) => (
                <button
                  type="button"
                  key={q.m}
                  onClick={() => setQuickAgeMonths(q.m)}
                  className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px]"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Premature Birth / Adjusted Age Option */}
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={isAdjustedAge}
                onChange={(e) => setIsAdjustedAge(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span className="font-medium">Born early? Use adjusted age for milestones</span>
            </label>

            {isAdjustedAge && (
              <div className="pt-2">
                <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">
                  Original Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Pediatric guidelines recommend using adjusted age through 24 months for premature infants.
                </span>
              </div>
            )}
          </div>

          {/* Notes or Sensory Preferences */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Child's Play Preferences or Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loves sensory water play; gets startled by loud sounds; practicing cruising on furniture..."
              rows={2}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            {onTriggerMonthAlertTest ? (
              <button
                type="button"
                onClick={() => {
                  onTriggerMonthAlertTest();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 hover:underline self-start sm:self-auto"
                title="Preview what parents see when a child reaches a new age month"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Preview/Test Monthly Milestone Alert</span>
              </button>
            ) : <div />}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs transition-colors"
              >
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
