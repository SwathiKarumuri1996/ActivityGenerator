import React, { useState } from 'react';
import { Heart, Clock, Sparkles, Trash2, Edit3, Check, Search, BookOpen } from 'lucide-react';
import { PlayActivity } from '../types';
import { ActivityCard } from './ActivityCard';

interface SavedActivitiesProps {
  favoriteActivities: PlayActivity[];
  onToggleFavorite: (activity: PlayActivity, note?: string) => void;
  childName: string;
  onGoToGenerator: () => void;
}

export const SavedActivities: React.FC<SavedActivitiesProps> = ({
  favoriteActivities,
  onToggleFavorite,
  childName,
  onGoToGenerator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMess, setFilterMess] = useState<string>('All');

  const filtered = favoriteActivities.filter((act) => {
    const matchSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.oneLiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.favoriteNote && act.favoriteNote.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchMess = filterMess === 'All' || act.messLevel === filterMess;
    return matchSearch && matchMess;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#182230] rounded-3xl p-5 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Saved For Later</span>
            </div>
            <h1 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-100">
              {childName}’s Favorite Play Setups
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-lg">
              Your quick collection of go-to recipes, parent notes, and memorable moments.
            </p>
          </div>

          <button
            onClick={onGoToGenerator}
            className="px-4 py-2.5 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors self-start sm:self-center"
          >
            + Find New Play Setups
          </button>
        </div>

        {/* Search & Filter Bar */}
        {favoriteActivities.length > 0 && (
          <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your saved setups or notes..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
              {['All', 'Zero mess', 'Water play', 'Low / Easy wipe'].map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMess(m)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    filterMess === m
                      ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 font-medium'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Saved Activities */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              selectedObjects={act.materialsNeeded}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              childName={childName}
            />
          ))}
        </div>
      ) : favoriteActivities.length > 0 ? (
        <div className="bg-white dark:bg-[#182230] rounded-2xl p-8 text-center border border-stone-200 dark:border-stone-800">
          <p className="text-xs text-stone-600 dark:text-stone-300">
            No saved activities match your current search or filter.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#182230] rounded-3xl p-10 text-center border border-stone-200 dark:border-stone-800 space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100">
            No saved activities yet
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            When you see a play setup idea you love, tap the heart icon to save it here for peaceful mornings or rainy days!
          </p>
          <button
            onClick={onGoToGenerator}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
          >
            Explore Play Generator
          </button>
        </div>
      )}
    </div>
  );
};
