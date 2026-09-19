import React from 'react';
import { Sparkles, Heart, Compass, Moon, Sun, Baby, ClipboardList, BookOpen, Clock } from 'lucide-react';
import { ChildProfile, AgeCalculation } from '../types';

interface HeaderProps {
  activeTab: 'play' | 'milestones' | 'saved' | 'resources';
  onSelectTab: (tab: 'play' | 'milestones' | 'saved' | 'resources') => void;
  childProfile: ChildProfile;
  ageInfo: AgeCalculation;
  onOpenProfile: () => void;
  onOpenDoctorNotes: () => void;
  doctorNotesCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  childProfile,
  ageInfo,
  onOpenProfile,
  onOpenDoctorNotes,
  doctorNotesCount,
  isDarkMode,
  onToggleDarkMode,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 border-b border-stone-200/70 dark:border-stone-800 bg-[#FBF9F5]/90 dark:bg-[#121820]/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand & Child Status Pill */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => onSelectTab('play')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-sm transition-transform group-hover:scale-105">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-lg font-semibold tracking-tight text-stone-800 dark:text-stone-100 block leading-tight">
                  NurturePlay
                </span>
                <span className="text-[11px] text-stone-600 dark:text-stone-300 hidden sm:block">
                  Gentle home play & milestone companion
                </span>
              </div>
            </button>

            {/* Child Profile Quick Pill */}
            <button
              id="header-child-profile-pill"
              onClick={onOpenProfile}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 transition-colors shadow-xs"
              title="Click to edit child name or birth date"
            >
              <Baby className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                <strong className="font-semibold">{childProfile.name}</strong> • {ageInfo.formattedString}
              </span>
            </button>
          </div>

          {/* Right Action Icons & Dark Mode */}
          <div className="flex items-center gap-2">
            
            {/* Doctor Notes Quick Pill / Button */}
            <button
              id="header-doctor-notes-btn"
              onClick={onOpenDoctorNotes}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                doctorNotesCount > 0
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/60'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              } hover:shadow-xs`}
              title="Doctor visit checkup notes"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Doctor Notes</span>
              {doctorNotesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {doctorNotesCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="header-darkmode-toggle"
              onClick={onToggleDarkMode}
              aria-label="Toggle night mode"
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              title={isDarkMode ? 'Switch to daylight theme' : 'Switch to gentle night mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Minimalist & Low Anxiety */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm font-medium">
          <button
            id="nav-tab-play"
            onClick={() => onSelectTab('play')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
              activeTab === 'play'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Play Setup Generator</span>
          </button>

          <button
            id="nav-tab-milestones"
            onClick={() => onSelectTab('milestones')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
              activeTab === 'milestones'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Milestone Tracker</span>
            {doctorNotesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            )}
          </button>

          <button
            id="nav-tab-saved"
            onClick={() => onSelectTab('saved')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
              activeTab === 'saved'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/60'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'fill-current' : ''}`} />
            <span>Saved Activities</span>
            {savedCount > 0 && (
              <span className="text-[11px] opacity-90 px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-resources"
            onClick={() => onSelectTab('resources')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
              activeTab === 'resources'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developmental Support</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
