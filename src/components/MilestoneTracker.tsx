import React, { useState, useMemo, useEffect } from 'react';
import { Compass, CheckCircle, Clock, Circle, HelpCircle, HeartHandshake, ShieldCheck, BookmarkPlus, ExternalLink, Sparkles, AlertCircle, Baby, Check, FileText } from 'lucide-react';
import { Milestone, MilestoneDomain, ChildProfile, AgeCalculation } from '../types';
import { isPastMilestoneAge, MILESTONE_AGE_BANDS } from '../utils/ageCalculator';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  onUpdateMilestone: (updated: Milestone) => void;
  childProfile: ChildProfile;
  ageInfo: AgeCalculation;
  onOpenDoctorNotes: () => void;
  onOpenResources: () => void;
  initialAgeBand?: number;
}

const DOMAIN_TABS: { id: MilestoneDomain | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Domains', icon: '🌱' },
  { id: 'social', label: 'Social & Emotional', icon: '💛' },
  { id: 'language', label: 'Language & Sound', icon: '💬' },
  { id: 'cognitive', label: 'Cognitive & Curiosity', icon: '🧠' },
  { id: 'movement', label: 'Movement & Motor', icon: '👣' },
];

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  onUpdateMilestone,
  childProfile,
  ageInfo,
  onOpenDoctorNotes,
  onOpenResources,
  initialAgeBand,
}) => {
  const [selectedAgeBand, setSelectedAgeBand] = useState<number>(initialAgeBand || ageInfo.milestoneAgeBand || 9);
  const [selectedDomain, setSelectedDomain] = useState<MilestoneDomain | 'all'>('all');

  useEffect(() => {
    if (initialAgeBand) {
      setSelectedAgeBand(initialAgeBand);
    }
  }, [initialAgeBand]);

  // Milestones in selected age band and domain
  const currentBandMilestones = useMemo(() => {
    return milestones.filter((m) => {
      const matchAge = m.ageMonths === selectedAgeBand;
      const matchDomain = selectedDomain === 'all' || m.domain === selectedDomain;
      return matchAge && matchDomain;
    });
  }, [milestones, selectedAgeBand, selectedDomain]);

  // Check if any milestones are past child's age and not reached
  const pastDueMilestones = useMemo(() => {
    const childMonths = ageInfo.totalMonths;
    return milestones.filter((m) => {
      const isPast = isPastMilestoneAge(childMonths, m.ageMonths);
      const isNotReached = m.status !== 'reached';
      return isPast && isNotReached;
    });
  }, [milestones, ageInfo.totalMonths]);

  const handleStatusChange = (milestone: Milestone, newStatus: Milestone['status']) => {
    onUpdateMilestone({
      ...milestone,
      status: newStatus,
      loggedDate: new Date().toISOString().split('T')[0],
    });
  };

  const toggleFlagDoctor = (milestone: Milestone) => {
    onUpdateMilestone({
      ...milestone,
      flaggedForDoctor: !milestone.flaggedForDoctor,
    });
  };

  // Compute progress for selected age band
  const bandProgress = useMemo(() => {
    const bandItems = milestones.filter((m) => m.ageMonths === selectedAgeBand);
    if (bandItems.length === 0) return { reached: 0, total: 0, percent: 0 };
    const reachedCount = bandItems.filter((m) => m.status === 'reached').length;
    return {
      reached: reachedCount,
      total: bandItems.length,
      percent: Math.round((reachedCount / bandItems.length) * 100),
    };
  }, [milestones, selectedAgeBand]);

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      
      {/* Header Intro */}
      <div className="bg-white dark:bg-[#182230] rounded-3xl p-5 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>CDC & AAP Evidence-Based Surveillance</span>
            </div>
            <h1 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-100">
              {childProfile.name}’s Developmental Milestones
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-xl leading-relaxed">
              Celebrate little victories without pressure. Every child blooms at their own pace, and developmental ranges are naturally wide.
            </p>
          </div>

          {/* Quick Doctor Visit Summary Button */}
          <div className="shrink-0">
            <button
              id="btn-view-doctor-notes"
              onClick={onOpenDoctorNotes}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300/70 dark:border-stone-700 transition-colors shadow-xs"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>View Doctor Visit Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* LOW TONE DOCTOR VISIT NOTIFICATION (If child is past any milestone age) */}
      {pastDueMilestones.length > 0 && (
        <section className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 flex items-center justify-center shrink-0 mt-0.5">
              <HeartHandshake className="w-4 h-4" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-serif text-base font-semibold text-rose-900 dark:text-rose-200">
                  A Gentle Note for Your Next Pediatrician Visit
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-medium">
                  {pastDueMilestones.length} item{pastDueMilestones.length === 1 ? '' : 's'} to consider discussing
                </span>
              </div>

              <p className="text-xs sm:text-sm text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
                Babies and children develop along wide, unique spectrums. Because {childProfile.name} is currently <strong>{ageInfo.formattedString}</strong>, here is a milestone that is typically emerging around an earlier stage. It can be reassuring and helpful to gently mention this at your next routine well-child checkup:
              </p>

              <div className="space-y-2 pt-1">
                {pastDueMilestones.map((pm) => (
                  <div
                    key={pm.id}
                    className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-rose-200 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                          {pm.ageMonths} Month Checkpoint ({pm.domain})
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100">
                        {pm.title}
                      </h4>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {pm.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleFlagDoctor(pm)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          pm.flaggedForDoctor
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-100 dark:hover:bg-rose-950'
                        }`}
                      >
                        {pm.flaggedForDoctor ? '✓ Added to Doctor Note' : '+ Add to Doctor Note'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gentle Resources Link */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-rose-800 dark:text-rose-300 font-medium">
                  Would you like early guidance or extra support programs?
                </span>
                <button
                  onClick={onOpenResources}
                  className="inline-flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-300 hover:underline"
                >
                  <span>Explore Free Early Intervention & Resources</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AGE BAND SELECTOR */}
      <section className="bg-white dark:bg-[#182230] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
            Age Checkpoints
          </span>
          <span className="text-xs text-stone-600 dark:text-stone-300">
            {childProfile.name} is ~{ageInfo.totalMonths} months
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {MILESTONE_AGE_BANDS.map((band) => {
            const isCurrentAgeBand = band === ageInfo.milestoneAgeBand;
            const isSelected = band === selectedAgeBand;
            const label = band < 12 ? `${band} Mo` : band === 12 ? '1 Yr' : band === 24 ? '2 Yr' : band === 36 ? '3 Yr' : band === 48 ? '4 Yr' : `${band} Mo`;

            return (
              <button
                key={band}
                id={`age-band-btn-${band}`}
                onClick={() => setSelectedAgeBand(band)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700/60'
                }`}
              >
                <span>{label}</span>
                {isCurrentAgeBand && (
                  <span
                    className={`block text-[9px] leading-tight font-normal ${
                      isSelected ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400 font-medium'
                    }`}
                  >
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Band Progress Meter */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-800 dark:text-stone-200">
              {selectedAgeBand} Month Checkpoint:
            </span>
            <span>
              {bandProgress.reached} of {bandProgress.total} milestones logged as reached ({bandProgress.percent}%)
            </span>
          </div>
          <div className="w-28 sm:w-36 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${bandProgress.percent}%` }}
            />
          </div>
        </div>
      </section>

      {/* DOMAIN FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {DOMAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedDomain(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              selectedDomain === tab.id
                ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 font-medium'
                : 'bg-white dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MILESTONE CARDS LIST */}
      <div className="space-y-4">
        {currentBandMilestones.length > 0 ? (
          currentBandMilestones.map((m) => {
            const isReached = m.status === 'reached';
            const isPracticing = m.status === 'in_progress';
            const isNotYet = m.status === 'not_yet_seen';
            const isOverdue = isPastMilestoneAge(ageInfo.totalMonths, m.ageMonths) && !isReached;

            return (
              <div
                key={m.id}
                id={`milestone-card-${m.id}`}
                className={`rounded-2xl p-5 border transition-all ${
                  isReached
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40'
                    : isOverdue
                    ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-900/40'
                    : 'bg-white dark:bg-[#182230] border-stone-200/80 dark:border-stone-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                        {m.domain} • {m.ageMonths} Months
                      </span>
                      {isReached && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Reached
                        </span>
                      )}
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                          Consider for Doctor Visit
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-800 dark:text-stone-100">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <button
                      onClick={() => handleStatusChange(m, 'reached')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isReached
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      Reached
                    </button>
                    <button
                      onClick={() => handleStatusChange(m, 'in_progress')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isPracticing
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      Practicing
                    </button>
                    <button
                      onClick={() => handleStatusChange(m, 'not_yet_seen')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isNotYet
                          ? 'bg-stone-700 text-white dark:bg-stone-300 dark:text-stone-900 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                      }`}
                    >
                      Not Yet
                    </button>
                  </div>
                </div>

                {/* What to look for & Home Play Tip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-700/40">
                    <strong className="block text-stone-800 dark:text-stone-200 font-semibold mb-0.5">
                      👀 What to look for:
                    </strong>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{m.whatToLookFor}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30">
                    <strong className="block text-emerald-900 dark:text-emerald-300 font-semibold mb-0.5">
                      🧸 How to nurture at home:
                    </strong>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{m.gentleHomePractice}</p>
                  </div>
                </div>

                {/* Flag for Doctor Option */}
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800/80">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100">
                    <input
                      type="checkbox"
                      checked={!!m.flaggedForDoctor}
                      onChange={() => toggleFlagDoctor(m)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 border-stone-300 dark:border-stone-600"
                    />
                    <span>Flag to discuss at next pediatrician checkup</span>
                  </label>

                  {m.flaggedForDoctor && (
                    <span className="text-[11px] font-medium text-rose-600 dark:text-rose-300">
                      ✓ Saved to your doctor visit checklist
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-[#182230] rounded-2xl p-8 text-center border border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-600 dark:text-stone-300">
              No milestones found for this specific domain at this age checkpoint. Select "All Domains" to see all check-ins.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
