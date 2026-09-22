import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Compass, Heart, BookOpen, Baby, FileText, Moon, Sun, Bell } from 'lucide-react';
import { ChildProfile, Milestone, PlayActivity, AgeCalculation, MonthAlertRecord } from './types';
import {
  loadChildProfile,
  saveChildProfile,
  loadMilestones,
  saveMilestones,
  loadFavorites,
  saveFavorites,
  loadDarkMode,
  saveDarkMode,
  loadMonthAlertRecord,
  saveMonthAlertRecord,
} from './utils/storage';
import { calculateChildAge } from './utils/ageCalculator';
import { Header } from './components/Header';
import { PlayGenerator } from './components/PlayGenerator';
import { MilestoneTracker } from './components/MilestoneTracker';
import { SavedActivities } from './components/SavedActivities';
import { ResourcesSection } from './components/ResourcesSection';
import { ChildProfileModal } from './components/ChildProfileModal';
import { DoctorNotesModal } from './components/DoctorNotesModal';
import { MonthlyMilestoneAlert } from './components/MonthlyMilestoneAlert';

export default function App() {
  const [activeTab, setActiveTab] = useState<'play' | 'milestones' | 'saved' | 'resources'>('play');
  const [childProfile, setChildProfile] = useState<ChildProfile>(loadChildProfile);
  const [milestones, setMilestones] = useState<Milestone[]>(loadMilestones);
  const [favoriteActivities, setFavoriteActivities] = useState<PlayActivity[]>(loadFavorites);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(loadDarkMode);

  // Milestone Month Alert Record
  const [alertRecord, setAlertRecord] = useState<MonthAlertRecord>(loadMonthAlertRecord);
  const [isMonthAlertManuallyOpen, setIsMonthAlertManuallyOpen] = useState(false);
  const [targetMilestoneAgeBand, setTargetMilestoneAgeBand] = useState<number | undefined>(undefined);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDoctorNotesModalOpen, setIsDoctorNotesModalOpen] = useState(false);

  // Dynamic Age calculation
  const ageInfo: AgeCalculation = useMemo(() => {
    return calculateChildAge(childProfile);
  }, [childProfile]);

  // Is a new month reached and pending acknowledgment?
  const isMonthAlertPending = ageInfo.totalMonths > alertRecord.lastAcknowledgedMonth;

  // Count doctor flagged items
  const doctorNotesCount = useMemo(() => {
    return milestones.filter((m) => m.flaggedForDoctor).length;
  }, [milestones]);

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSaveProfile = (newProfile: ChildProfile) => {
    setChildProfile(newProfile);
    saveChildProfile(newProfile);
  };

  const handleUpdateMilestone = (updated: Milestone) => {
    setMilestones((prev) => {
      const next = prev.map((m) => (m.id === updated.id ? updated : m));
      saveMilestones(next);
      return next;
    });
  };

  const handleUnflagMilestone = (milestone: Milestone) => {
    handleUpdateMilestone({
      ...milestone,
      flaggedForDoctor: false,
    });
  };

  const handleToggleFavorite = (activity: PlayActivity, note?: string) => {
    setFavoriteActivities((prev) => {
      const exists = prev.some((a) => a.title === activity.title);
      let next: PlayActivity[];
      if (exists) {
        if (note !== undefined) {
          // update note only
          next = prev.map((a) => (a.title === activity.title ? { ...a, favoriteNote: note } : a));
        } else {
          // remove favorite
          next = prev.filter((a) => a.title !== activity.title);
        }
      } else {
        // add favorite
        next = [{ ...activity, isFavorite: true, favoriteNote: note || activity.favoriteNote }, ...prev];
      }
      saveFavorites(next);
      return next;
    });
  };

  const handleTriggerMonthAlertTest = () => {
    // Reset acknowledged month to trigger alert for current child age
    const updated: MonthAlertRecord = {
      ...alertRecord,
      lastAcknowledgedMonth: Math.max(0, ageInfo.totalMonths - 1),
    };
    saveMonthAlertRecord(updated);
    setAlertRecord(updated);
    setIsMonthAlertManuallyOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#121820] text-stone-800 dark:text-stone-100 transition-colors duration-300 flex flex-col selection:bg-emerald-200 dark:selection:bg-emerald-900 pb-20 sm:pb-8">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        childProfile={childProfile}
        ageInfo={ageInfo}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDoctorNotes={() => setIsDoctorNotesModalOpen(true)}
        doctorNotesCount={doctorNotesCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        savedCount={favoriteActivities.length}
        isMonthAlertPending={isMonthAlertPending}
        onOpenMonthAlert={() => setIsMonthAlertManuallyOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Monthly Milestone Visual Alert Banner */}
        <MonthlyMilestoneAlert
          childProfile={childProfile}
          ageInfo={ageInfo}
          alertRecord={alertRecord}
          onUpdateAlertRecord={setAlertRecord}
          onNavigateToMilestones={(band) => {
            setTargetMilestoneAgeBand(band || ageInfo.milestoneAgeBand);
            setActiveTab('milestones');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToPlay={() => {
            setActiveTab('play');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isManuallyOpened={isMonthAlertManuallyOpen}
          onCloseManual={() => setIsMonthAlertManuallyOpen(false)}
        />

        {activeTab === 'play' && (
          <PlayGenerator
            childProfile={childProfile}
            ageInfo={ageInfo}
            favoriteActivities={favoriteActivities}
            onToggleFavorite={handleToggleFavorite}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestoneTracker
            milestones={milestones}
            onUpdateMilestone={handleUpdateMilestone}
            childProfile={childProfile}
            ageInfo={ageInfo}
            onOpenDoctorNotes={() => setIsDoctorNotesModalOpen(true)}
            onOpenResources={() => setActiveTab('resources')}
            initialAgeBand={targetMilestoneAgeBand}
          />
        )}

        {activeTab === 'saved' && (
          <SavedActivities
            favoriteActivities={favoriteActivities}
            onToggleFavorite={handleToggleFavorite}
            childName={childProfile.name}
            onGoToGenerator={() => setActiveTab('play')}
          />
        )}

        {activeTab === 'resources' && <ResourcesSection />}
      </main>

      {/* Mobile Bottom Navigation Bar (Low Clutter) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F5]/95 dark:bg-[#121820]/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('play')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'play' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Play Setups</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium relative transition-colors ${
            activeTab === 'milestones' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Milestones</span>
          {isMonthAlertPending && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse absolute top-0 right-1 border border-white dark:border-stone-900" />
          )}
          {doctorNotesCount > 0 && !isMonthAlertPending && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0 right-3" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'saved' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Heart className={`w-5 h-5 ${favoriteActivities.length > 0 ? 'fill-current' : ''}`} />
          <span>Saved ({favoriteActivities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'resources' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Support</span>
        </button>
      </div>

      {/* Child Profile Modal */}
      <ChildProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={childProfile}
        onSaveProfile={handleSaveProfile}
        onTriggerMonthAlertTest={handleTriggerMonthAlertTest}
      />


      {/* Doctor Notes Modal */}
      <DoctorNotesModal
        isOpen={isDoctorNotesModalOpen}
        onClose={() => setIsDoctorNotesModalOpen(false)}
        milestones={milestones}
        childProfile={childProfile}
        ageInfo={ageInfo}
        onOpenResources={() => {
          setIsDoctorNotesModalOpen(false);
          setActiveTab('resources');
        }}
        onUnflagMilestone={handleUnflagMilestone}
      />
    </div>
  );
}
