import React, { useState } from 'react';
import { Clock, ShieldAlert, Sparkles, Heart, CheckCircle2, ChevronDown, ChevronUp, Feather, Droplets, Info, Sliders, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { PlayActivity, ActivityDifficulty } from '../types';

interface ActivityCardProps {
  activity: PlayActivity;
  selectedObjects: string[];
  isFavorite: boolean;
  onToggleFavorite: (activity: PlayActivity, note?: string) => void;
  childName: string;
  defaultDifficulty?: ActivityDifficulty;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  selectedObjects,
  isFavorite,
  onToggleFavorite,
  childName,
  defaultDifficulty = 'just_right',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(activity.favoriteNote || '');
  const [currentDifficulty, setCurrentDifficulty] = useState<ActivityDifficulty>(
    activity.difficulty || defaultDifficulty
  );

  const handleSaveNote = () => {
    onToggleFavorite(activity, noteText);
    setShowNoteInput(false);
  };

  const getMessBadge = (mess: string) => {
    switch (mess) {
      case 'Zero mess':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Low / Easy wipe':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'Water play':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div
      id={`activity-card-${activity.id}`}
      className="bg-white dark:bg-[#182230] rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800/80 shadow-xs hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Target Age Pill, Mess Level & Favorite Action */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              Age {activity.targetAgeMonthsMin}-{activity.targetAgeMonthsMax} mo
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getMessBadge(activity.messLevel)}`}>
              <Feather className="w-3 h-3 mr-1 opacity-70" />
              {activity.messLevel}
            </span>
            {activity.id.startsWith('ai-') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 animate-in fade-in">
                <Sparkles className="w-3 h-3 text-purple-500" />
                Custom Idea
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            id={`btn-favorite-${activity.id}`}
            onClick={() => onToggleFavorite(activity)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100'
                : 'text-stone-400 hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save for later'}
            aria-label={isFavorite ? 'Saved activity' : 'Save activity'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title and one-liner */}
        <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 leading-snug mb-1">
          {activity.title}
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
          {activity.oneLiner}
        </p>

        {/* Interactive Difficulty / Ability Calibrator Pill Selector */}
        <div className="mb-4 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/50">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1.5 px-0.5">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-stone-500" />
              <span>Calibrate Level for {childName}:</span>
            </span>
            <span className="font-medium text-stone-500">
              {currentDifficulty === 'easier' ? '🌱 Gentle / Simpler' : currentDifficulty === 'more_challenging' ? '🚀 Step It Up' : '⭐ Standard'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setCurrentDifficulty('easier')}
              className={`py-1 px-1.5 rounded-lg font-medium transition-all text-center ${
                currentDifficulty === 'easier'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700/60'
              }`}
            >
              🌱 Easier
            </button>
            <button
              type="button"
              onClick={() => setCurrentDifficulty('just_right')}
              className={`py-1 px-1.5 rounded-lg font-medium transition-all text-center ${
                currentDifficulty === 'just_right'
                  ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700/60'
              }`}
            >
              ⭐ Just Right
            </button>
            <button
              type="button"
              onClick={() => setCurrentDifficulty('more_challenging')}
              className={`py-1 px-1.5 rounded-lg font-medium transition-all text-center ${
                currentDifficulty === 'more_challenging'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700/60'
              }`}
            >
              🚀 Step It Up
            </button>
          </div>

          {/* Real-time Dynamic Adaptation Callout */}
          {currentDifficulty === 'easier' && (activity.simplifyTip || activity.quickVariation) && (
            <div className="mt-2 p-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-200">
              <strong className="font-semibold block mb-0.5 flex items-center gap-1">
                <ArrowDownLeft className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Gentle Adjustment (Lower Frustration):
              </strong>
              <p className="leading-relaxed">
                {activity.simplifyTip || 'Focus on simple tactile exploration and reduce the physical demands so your child feels successful immediately.'}
              </p>
            </div>
          )}

          {currentDifficulty === 'more_challenging' && (activity.challengeTip || activity.quickVariation) && (
            <div className="mt-2 p-2 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 animate-in fade-in duration-200">
              <strong className="font-semibold block mb-0.5 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Step-Up Challenge (Higher Engagement):
              </strong>
              <p className="leading-relaxed">
                {activity.challengeTip || 'Introduce two-handed coordination, extra distance, or turn-taking to stretch their curiosity.'}
              </p>
            </div>
          )}
        </div>

        {/* Timing & Prep indicators */}
        <div className="flex items-center gap-4 text-xs text-stone-600 dark:text-stone-300 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Prep: <strong>{activity.prepMinutes} min</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Play: <strong>~{activity.playDurationMinutes} min</strong></span>
          </div>
        </div>

        {/* Materials List */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1.5">
            Materials
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activity.materialsNeeded.map((mat, idx) => {
              const matchesSelected = selectedObjects.some(
                (obj) => mat.toLowerCase().includes(obj.toLowerCase()) || obj.toLowerCase().includes(mat.toLowerCase())
              );
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    matchesSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border border-stone-200/60 dark:border-stone-700/50'
                  }`}
                >
                  {matchesSelected && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  <span>{mat}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Step-by-step Setup Guide */}
        <div className="space-y-2 mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block">
            How to Set Up (Low-Stress)
          </span>
          <ol className="space-y-2 text-xs text-stone-700 dark:text-stone-200 list-decimal list-inside pl-0.5">
            {activity.steps.map((step, idx) => (
              <li key={idx} className="leading-relaxed pl-1">
                <span className="text-stone-800 dark:text-stone-200">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Collapsible Details: Skills & Tips */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-3 text-xs animate-in fade-in duration-200">
            {/* Skills Fostered */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1.5">
                Skills Nurtured
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activity.skillsFostered.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full text-[11px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/40 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Safety & Gentle Tip */}
            {activity.safetyNote && (
              <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2 text-amber-900 dark:text-amber-200 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <strong className="font-semibold block mb-0.5">Safety & Supervision</strong>
                  <p>{activity.safetyNote}</p>
                </div>
              </div>
            )}

            {/* Quick Variation / Adaptation */}
            {activity.quickVariation && (
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 text-xs">
                <strong className="font-semibold block text-stone-800 dark:text-stone-100 mb-0.5">
                  Play Variation
                </strong>
                <p>{activity.quickVariation}</p>
              </div>
            )}

            {/* Parent Calm Tip */}
            {activity.calmTipForParent && (
              <p className="italic text-[11px] text-stone-600 dark:text-stone-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                🌱 <span className="font-medium">Mindful Parent Note:</span> {activity.calmTipForParent}
              </p>
            )}
          </div>
        )}

        {/* Saved Note section if favorite */}
        {isFavorite && (
          <div className="mt-3 pt-2.5 border-t border-rose-100 dark:border-rose-950/60 text-xs">
            {showNoteInput ? (
              <div className="space-y-1.5">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={`How did ${childName} react? (e.g., Laughed at the ripples...)`}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowNoteInput(false)}
                    className="px-2 py-1 text-stone-500 text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-medium"
                  >
                    Save Memory
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-stone-600 dark:text-stone-300 italic">
                  {activity.favoriteNote ? `"${activity.favoriteNote}"` : 'Add a quick memory or note...'}
                </p>
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium ml-2"
                >
                  {activity.favoriteNote ? 'Edit note' : '+ Add note'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expand / Collapse Details Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3.5 pt-2 flex items-center justify-center gap-1 w-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-t border-stone-100 dark:border-stone-800"
      >
        <span>{isExpanded ? 'Less details' : 'Skills, Variations & Safety Tips'}</span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
