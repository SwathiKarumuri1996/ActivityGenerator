import React, { useState, useMemo } from 'react';
import { Sparkles, Clock, Package, Check, Plus, RefreshCw, Wand2, Filter, Heart, ArrowRight, Lightbulb, AlertCircle, Baby, Info, Sliders, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { ChildProfile, AgeCalculation, PlayActivity, HouseholdObject, ActivityDifficulty } from '../types';
import { COMMON_HOUSEHOLD_OBJECTS } from '../data/commonObjects';
import { CURATED_ACTIVITIES } from '../data/curatedActivities';
import { ActivityCard } from './ActivityCard';

interface PlayGeneratorProps {
  childProfile: ChildProfile;
  ageInfo: AgeCalculation;
  favoriteActivities: PlayActivity[];
  onToggleFavorite: (activity: PlayActivity, note?: string) => void;
  onOpenProfile: () => void;
}

const TIME_PRESETS = [
  { minutes: 5, label: '5 min', desc: 'Instant reset' },
  { minutes: 15, label: '10–15 min', desc: 'Sweet spot' },
  { minutes: 30, label: '20–30 min', desc: 'Deep play' },
  { minutes: 45, label: '45+ min', desc: 'Big adventure' },
];

const DIFFICULTY_OPTIONS: {
  id: ActivityDifficulty;
  title: string;
  badge: string;
  icon: string;
  tagline: string;
  desc: string;
  colorClass: string;
  activeBorderClass: string;
}[] = [
  {
    id: 'easier',
    title: 'Gentle & Simpler',
    badge: 'Low Demand',
    icon: '🌱',
    tagline: 'Ease into play with zero pressure',
    desc: 'Lower motor & cognitive demand. Fewer steps, soothing exploration, and quick wins for tired or overwhelmed moments.',
    colorClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
    activeBorderClass: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/40',
  },
  {
    id: 'just_right',
    title: 'Just Right',
    badge: 'Age Standard',
    icon: '⭐',
    tagline: 'Balanced developmental flow',
    desc: 'Calibrated directly to their typical milestone emergence window with natural play progression.',
    colorClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
    activeBorderClass: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/70 dark:bg-amber-950/40',
  },
  {
    id: 'more_challenging',
    title: 'Step It Up',
    badge: 'Skill Builder',
    icon: '🚀',
    tagline: 'Stretch their focus and abilities',
    desc: 'Adds bimanual coordination, early problem solving, precision grasp, or vocabulary extensions for engaged energy.',
    colorClass: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200',
    activeBorderClass: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-950/40',
  },
];

const VIBE_OPTIONS = [
  { id: 'any', label: 'Any Vibe', icon: '✨' },
  { id: 'calm', label: 'Calm & Wind-down', icon: '☁️' },
  { id: 'active', label: 'Active Mover', icon: '🏃' },
  { id: 'sensory', label: 'Sensory & Touch', icon: '💧' },
  { id: 'independent', label: 'Quiet Focus', icon: '🧘' },
];

export const PlayGenerator: React.FC<PlayGeneratorProps> = ({
  childProfile,
  ageInfo,
  favoriteActivities,
  onToggleFavorite,
  onOpenProfile,
}) => {
  const [selectedTime, setSelectedTime] = useState<number>(15);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ActivityDifficulty>('just_right');
  const [selectedObjects, setSelectedObjects] = useState<string[]>([
    'Plastic containers & lids',
    'Wooden spoons',
    'Scarves or washcloths',
  ]);
  const [customInput, setCustomInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedVibe, setSelectedVibe] = useState<string>('any');

  // AI Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedIdeas, setAiGeneratedIdeas] = useState<PlayActivity[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessNotice, setAiSuccessNotice] = useState<string | null>(null);

  const categories = ['All', 'Kitchen', 'Paper & Cardboard', 'Soft & Textiles', 'Sensory & Water', 'Everyday Odds'];

  const filteredObjects = useMemo(() => {
    if (activeCategory === 'All') return COMMON_HOUSEHOLD_OBJECTS;
    return COMMON_HOUSEHOLD_OBJECTS.filter((obj) => obj.category === activeCategory);
  }, [activeCategory]);

  const toggleObject = (name: string) => {
    setSelectedObjects((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleAddCustomObject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !selectedObjects.includes(trimmed)) {
      setSelectedObjects((prev) => [...prev, trimmed]);
      setCustomInput('');
    }
  };

  const clearAllObjects = () => {
    setSelectedObjects([]);
  };

  // Quick preset combos
  const applyPreset = (items: string[], time: number) => {
    setSelectedObjects(items);
    setSelectedTime(time);
  };

  // Rank and match curated activities for this child's age & adjusted difficulty
  const matchedCuratedActivities = useMemo(() => {
    const baseAgeMonths = ageInfo.totalMonths;

    // Shift age target window based on difficulty preference
    // Easier: target slightly earlier milestones or simpler setup
    // More Challenging: target slightly advanced milestones
    let effectiveAgeMonths = baseAgeMonths;
    if (selectedDifficulty === 'easier') {
      effectiveAgeMonths = Math.max(2, baseAgeMonths - 2.5);
    } else if (selectedDifficulty === 'more_challenging') {
      effectiveAgeMonths = baseAgeMonths + 3;
    }

    return CURATED_ACTIVITIES.map((activity) => {
      // Age score: checks proximity to effective age
      let ageScore = 0;
      if (effectiveAgeMonths >= activity.targetAgeMonthsMin && effectiveAgeMonths <= activity.targetAgeMonthsMax) {
        ageScore = 100;
      } else {
        const diff = Math.min(
          Math.abs(effectiveAgeMonths - activity.targetAgeMonthsMin),
          Math.abs(effectiveAgeMonths - activity.targetAgeMonthsMax)
        );
        ageScore = Math.max(0, 100 - diff * 15);
      }

      // Difficulty tag bonus
      let difficultyScore = 0;
      if (activity.difficulty === selectedDifficulty) {
        difficultyScore = 30;
      } else if (activity.difficulty === 'just_right' && selectedDifficulty !== 'just_right') {
        difficultyScore = 15;
      }

      // Materials score: how many items the parent actually has
      let matchCount = 0;
      activity.materialsNeeded.forEach((mat) => {
        const has = selectedObjects.some(
          (obj) => mat.toLowerCase().includes(obj.toLowerCase()) || obj.toLowerCase().includes(mat.toLowerCase())
        );
        if (has) matchCount++;
      });

      const materialScore = activity.materialsNeeded.length > 0
        ? (matchCount / activity.materialsNeeded.length) * 50
        : 10;

      // Vibe score
      const vibeScore = selectedVibe === 'any' || activity.mood === selectedVibe ? 20 : 0;

      // Time score
      const timeDiff = Math.abs(activity.playDurationMinutes - selectedTime);
      const timeScore = Math.max(0, 20 - timeDiff);

      const totalScore = ageScore + difficultyScore + materialScore + vibeScore + timeScore;

      return {
        activity: {
          ...activity,
          difficulty: selectedDifficulty,
        },
        matchCount,
        totalScore,
      };
    })
      .filter((item) => item.totalScore > 50 || item.matchCount > 0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item) => item.activity);
  }, [ageInfo.totalMonths, selectedDifficulty, selectedObjects, selectedVibe, selectedTime]);

  // Combined activities (AI generated first, then curated matches)
  const displayActivities = useMemo(() => {
    const combined = [...aiGeneratedIdeas, ...matchedCuratedActivities];
    // deduplicate by id or title
    const seen = new Set<string>();
    return combined.filter((act) => {
      if (seen.has(act.title.toLowerCase())) return false;
      seen.add(act.title.toLowerCase());
      return true;
    });
  }, [aiGeneratedIdeas, matchedCuratedActivities]);

  // Request custom AI play ideas via server-side Gemini API with difficulty calibration
  const handleGenerateWithAi = async () => {
    if (selectedObjects.length === 0) {
      alert('Please select at least 1 household object first.');
      return;
    }

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const response = await fetch('/api/generate-play-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageInMonths: ageInfo.totalMonths,
          timeMinutes: selectedTime,
          objects: selectedObjects,
          mood: selectedVibe,
          childName: childProfile.name,
          difficulty: selectedDifficulty,
        }),
      });

      const data = await response.json();
      if (data.ideas && data.ideas.length > 0) {
        const formatted: PlayActivity[] = data.ideas.map((item: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          title: item.title,
          oneLiner: item.oneLiner,
          targetAgeMonthsMin: item.targetAgeMonthsMin || Math.max(0, ageInfo.totalMonths - 2),
          targetAgeMonthsMax: item.targetAgeMonthsMax || ageInfo.totalMonths + 3,
          prepMinutes: item.prepMinutes || 2,
          playDurationMinutes: item.playDurationMinutes || selectedTime,
          materialsNeeded: item.materialsNeeded || selectedObjects,
          steps: item.steps || [],
          skillsFostered: item.skillsFostered || ['Curiosity', 'Fine Motor'],
          messLevel: item.messLevel || 'Zero mess',
          safetyNote: item.safetyNote || 'Always supervise actively during home play.',
          quickVariation: item.quickVariation,
          simplifyTip: item.simplifyTip,
          challengeTip: item.challengeTip,
          calmTipForParent: item.calmTipForParent || 'Follow your child’s lead without rushing.',
          mood: selectedVibe as any,
          difficulty: selectedDifficulty,
        }));
        setAiGeneratedIdeas(formatted);
        setAiError(null);
        setAiSuccessNotice(
          `✨ Customized ${formatted.length} play setups for ${childProfile.name} using your exact items with ${selectedDifficulty.replace('_', ' ')} difficulty!`
        );
        setTimeout(() => {
          document.getElementById('play-results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setAiError(data.message || 'Displaying top curated recommendations for this setup.');
      }
    } catch (err: any) {
      console.warn('AI generator fallback:', err);
      // Instant client-side adaptive custom ideas using their exact chosen items
      const instantIdeas: PlayActivity[] = [
        {
          id: `ai-instant-${Date.now()}-0`,
          title: `${selectedObjects[0] || 'Household Object'} Sensory & Reach Discovery`,
          oneLiner: `A custom low-prep setup for ${childProfile.name} to explore touch, sound, and reach using your exact ${selectedObjects[0] || 'items'}.`,
          targetAgeMonthsMin: Math.max(2, ageInfo.totalMonths - 2),
          targetAgeMonthsMax: ageInfo.totalMonths + 3,
          prepMinutes: 1,
          playDurationMinutes: selectedTime,
          materialsNeeded: selectedObjects.slice(0, 3),
          steps: [
            `Sit closely on the carpet or a soft blanket with ${childProfile.name}.`,
            `Present the ${selectedObjects[0]} within reach, tapping it gently to invite curiosity.`,
            selectedDifficulty === 'easier'
              ? `Hold the item steady right at chest level so ${childProfile.name} doesn't need to balance while grabbing.`
              : selectedDifficulty === 'more_challenging'
              ? `Place it slightly behind a soft cushion to encourage crawling or reaching around obstacles.`
              : `Encourage transferring the ${selectedObjects[0]} between both hands.`,
            `Follow their gaze and celebrate any vocalizations or touches!`,
          ],
          skillsFostered: ['Hand-Eye Coordination', 'Tactile Exploration', 'Motor Planning'],
          messLevel: 'Zero mess',
          safetyNote: 'Ensure smooth edges and clean surfaces before handing over.',
          simplifyTip: 'Support their upper back with a cushion so all their energy goes into looking and touching.',
          challengeTip: `Introduce ${selectedObjects[1] || 'a second object'} to practice holding one item in each hand simultaneously.`,
          calmTipForParent: 'Simple objects offer rich sensory feedback without battery noise or overstimulation.',
          mood: selectedVibe as any,
          difficulty: selectedDifficulty,
        },
        {
          id: `ai-instant-${Date.now()}-1`,
          title: `${selectedObjects[1] || selectedObjects[0] || 'Container'} Drop & Sound Lab`,
          oneLiner: `Explore auditory cause-and-effect and motor release by dropping and tapping household objects.`,
          targetAgeMonthsMin: Math.max(3, ageInfo.totalMonths - 2),
          targetAgeMonthsMax: ageInfo.totalMonths + 3,
          prepMinutes: 2,
          playDurationMinutes: selectedTime,
          materialsNeeded: selectedObjects.slice(0, 3),
          steps: [
            `Place ${selectedObjects[1] || 'a shallow bowl or box'} between you and ${childProfile.name}.`,
            `Demonstrate dropping ${selectedObjects[0]} inside: 'Plop! Hear that?'`,
            `Hand them another item and model opening your fingers to let go.`,
            `Cheer for any attempt—voluntary object release is a big motor milestone!`,
          ],
          skillsFostered: ['Voluntary Release', 'Auditory Cause & Effect', 'Turn Taking'],
          messLevel: 'Zero mess',
          safetyNote: 'Supervise to ensure items are safe to tap and not thrown at fragile surfaces.',
          simplifyTip: 'Hold the container right underneath their fingers so gravity catches the object.',
          challengeTip: 'Step the container 2 feet away so they have to crawl or walk to drop it in.',
          calmTipForParent: 'Dropping items over and over is deep physics learning for developing brains.',
          mood: selectedVibe as any,
          difficulty: selectedDifficulty,
        }
      ];
      setAiGeneratedIdeas(instantIdeas);
      setAiError(null);
      setAiSuccessNotice(
        `✨ Tailored custom setups for ${childProfile.name} using ${selectedObjects.slice(0, 2).join(' & ')}!`
      );
      setTimeout(() => {
        document.getElementById('play-results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Reassuring Hero / Child Context Banner */}
      <section className="bg-gradient-to-br from-emerald-50/60 via-amber-50/40 to-stone-100/60 dark:from-emerald-950/20 dark:via-stone-900/60 dark:to-stone-900/40 rounded-3xl p-5 sm:p-7 border border-emerald-100/70 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 mb-3 border border-emerald-200/60 dark:border-emerald-800/40">
            <Baby className="w-3.5 h-3.5" />
            <span>Calibrated for {childProfile.name} • {ageInfo.formattedString} ({ageInfo.stageName})</span>
          </div>
          
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 dark:text-stone-100 tracking-tight leading-snug mb-2">
            What can you play right now?
          </h1>
          
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            Tell us your time, items, and desired challenge level. We’ll filter safe, clutter-free setup ideas that match {childProfile.name}’s current abilities and mood.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="text-stone-600 dark:text-stone-300 font-medium self-center">Try a quick combo:</span>
            <button
              onClick={() => applyPreset(['Plastic containers & lids', 'Wooden spoons', 'Ice cubes'], 15)}
              className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 transition-colors"
            >
              🥄 Kitchen Spoons & Ice
            </button>
            <button
              onClick={() => applyPreset(['Cardboard box', "Painter's / masking tape", 'Clean socks'], 20)}
              className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 transition-colors"
            >
              📦 Box & Sock Basketball
            </button>
            <button
              onClick={() => applyPreset(['Scarves or washcloths', 'Pillows / sofa cushions'], 10)}
              className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 transition-colors"
            >
              ☁️ Scarf & Cushion Den
            </button>
          </div>
        </div>
      </section>

      {/* STEP 1: TIME AVAILABLE */}
      <section className="bg-white dark:bg-[#182230] rounded-2xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-800 dark:text-stone-100">
              How much time do you have?
            </h2>
          </div>
          <span className="text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            Selected: <strong>{selectedTime} minutes</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TIME_PRESETS.map((preset) => {
            const isSelected = selectedTime === preset.minutes;
            return (
              <button
                key={preset.minutes}
                id={`time-btn-${preset.minutes}`}
                onClick={() => setSelectedTime(preset.minutes)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/60 dark:border-emerald-600 shadow-xs'
                    : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200/70 dark:border-stone-700/60 hover:bg-stone-100/70 dark:hover:bg-stone-800'
                }`}
              >
                <span className={`block font-semibold text-sm ${isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-stone-800 dark:text-stone-200'}`}>
                  {preset.label}
                </span>
                <span className="block text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                  {preset.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 2: OBJECTS YOU HAVE AT HOME */}
      <section className="bg-white dark:bg-[#182230] rounded-2xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-800 dark:text-stone-100">
              What objects do you have right now?
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-600 dark:text-stone-300">
              {selectedObjects.length} item{selectedObjects.length === 1 ? '' : 's'} selected
            </span>
            {selectedObjects.length > 0 && (
              <button
                onClick={clearAllObjects}
                className="text-stone-600 dark:text-stone-300 hover:text-rose-500 text-xs underline ml-1"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 font-medium'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Object Chips Grid */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filteredObjects.map((obj) => {
            const isChecked = selectedObjects.includes(obj.name);
            return (
              <button
                key={obj.id}
                id={`obj-btn-${obj.id}`}
                onClick={() => toggleObject(obj.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isChecked
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {isChecked ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{obj.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Object Input */}
        <form onSubmit={handleAddCustomObject} className="flex items-center gap-2 max-w-md">
          <input
            id="input-custom-object"
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Have something else? (e.g. colander, ping pong balls...)"
            className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors shrink-0"
          >
            + Add Item
          </button>
        </form>
      </section>

      {/* STEP 3: DIFFICULTY & ABILITY CALIBRATION */}
      <section className="bg-white dark:bg-[#182230] rounded-2xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-800 dark:text-stone-100">
              Adjust Activity Difficulty
            </h2>
          </div>
          <span className="text-xs text-stone-600 dark:text-stone-300">
            Tailor tasks beyond age for {childProfile.name}’s current energy & engagement
          </span>
        </div>

        {/* 3-Level Card Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = selectedDifficulty === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`difficulty-btn-${opt.id}`}
                onClick={() => setSelectedDifficulty(opt.id)}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? `${opt.activeBorderClass} shadow-xs`
                    : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200/70 dark:border-stone-700/60 hover:bg-stone-100/70 dark:hover:bg-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{opt.icon}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${opt.colorClass}`}>
                      {opt.badge}
                    </span>
                  </div>
                  <h3 className={`font-serif text-sm font-semibold mb-1 ${isSelected ? 'text-stone-900 dark:text-stone-100' : 'text-stone-800 dark:text-stone-200'}`}>
                    {opt.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/40 dark:border-stone-700/40 flex items-center justify-between text-[11px]">
                  <span className={`font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-600 dark:text-stone-300'}`}>
                    {isSelected ? '✓ Selected level' : 'Select'}
                  </span>
                  <span className="text-[10px] text-stone-600 dark:text-stone-300 italic">
                    {opt.tagline}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Context Feedback */}
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span>
              {selectedDifficulty === 'easier' && (
                <>Filtering for <strong>softer, lower-frustration setups</strong> with simple single-step tactile curiosity.</>
              )}
              {selectedDifficulty === 'just_right' && (
                <>Filtering for <strong>standard milestone emergence</strong> for a ~{ageInfo.totalMonths} month old.</>
              )}
              {selectedDifficulty === 'more_challenging' && (
                <>Filtering for <strong>active skill-building setups</strong> with problem solving and bimanual dexterity.</>
              )}
            </span>
          </div>
          <span className="text-[11px] text-stone-600 dark:text-stone-300 hidden md:inline">
            You can also adjust individual activities right on their cards below!
          </span>
        </div>
      </section>

      {/* STEP 4: PLAY VIBE / MOOD & AI GENERATOR BAR */}
      <section className="bg-white dark:bg-[#182230] rounded-2xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="font-serif text-base font-semibold text-stone-800 dark:text-stone-100">
              Energy & Vibe
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {VIBE_OPTIONS.map((vibe) => (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedVibe === vibe.id
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="mr-1">{vibe.icon}</span>
                {vibe.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Action Button */}
        <div className="pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
          <button
            id="btn-ask-gemini-ai"
            onClick={handleGenerateWithAi}
            disabled={isGeneratingAi || selectedObjects.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isGeneratingAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting custom ideas for {childProfile.name}...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-emerald-200 transition-transform group-hover:rotate-12" />
                <span>✨ Ask AI for Novel Custom Ideas</span>
              </>
            )}
          </button>
          <span className="block text-[11px] text-stone-600 dark:text-stone-300 mt-1 text-center md:text-right">
            Calibrates difficulty ({selectedDifficulty.replace('_', ' ')}) with OT play science
          </span>
        </div>
      </section>

      {/* RESULTS DISPLAY */}
      <section id="play-results-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-800 dark:text-stone-100">
              Suggested Play Setups for {childProfile.name}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Showing {displayActivities.length} ideas suited for ~{ageInfo.totalMonths} months old • Difficulty set to <strong>{selectedDifficulty.replace('_', ' ')}</strong>.
            </p>
          </div>
          {aiGeneratedIdeas.length > 0 && (
            <button
              onClick={() => {
                setAiGeneratedIdeas([]);
                setAiSuccessNotice(null);
              }}
              className="text-xs text-stone-600 dark:text-stone-300 hover:underline"
            >
              Reset to curated list
            </button>
          )}
        </div>

        {/* AI Success Notice */}
        {aiSuccessNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">{aiSuccessNotice}</span>
            </div>
            <button
              onClick={() => setAiSuccessNotice(null)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* AI Notification Banner if any */}
        {aiError && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Activity Cards Grid */}
        {displayActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayActivities.map((act) => {
              const isFav = favoriteActivities.some((f) => f.title === act.title);
              return (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  selectedObjects={selectedObjects}
                  isFavorite={isFav}
                  onToggleFavorite={onToggleFavorite}
                  childName={childProfile.name}
                  defaultDifficulty={selectedDifficulty}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#182230] rounded-2xl p-8 text-center border border-stone-200 dark:border-stone-800 space-y-3">
            <Package className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200">
              No matching activities found for this exact combination
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
              Try selecting a few more household objects above, or tap the button below to generate custom ideas.
            </p>
            <button
              onClick={() => setSelectedObjects(['Plastic containers & lids', 'Wooden spoons', 'Clean socks', 'Cardboard box'])}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
            >
              Reset to Popular Objects
            </button>
          </div>
        )}
      </section>

      {/* Gentle Parent Reminder Footer Note */}
      <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 flex items-start gap-3">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>A gentle reminder:</strong> If your child only plays for 2 minutes and walks away, or plays with the wrapper instead of the setup, that’s 100% normal developmental discovery! You can use the "🌱 Easier" button anytime to reduce sensory load or simplify steps.
        </p>
      </div>
    </div>
  );
};
