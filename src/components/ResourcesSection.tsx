import React from 'react';
import { BookOpen, ExternalLink, HeartHandshake, PhoneCall, ShieldCheck, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { DEVELOPMENTAL_RESOURCES } from '../data/developmentalResources';

export const ResourcesSection: React.FC = () => {
  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#182230] rounded-3xl p-5 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Gentle Support Directory</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-100">
            Developmental Support & Early Guidance
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
            Parenting comes with plenty of questions. If you ever wonder whether your child needs a little extra boost, these trusted, evidence-based public programs and pediatric resources are here to support you unconditionally.
          </p>
        </div>
      </div>

      {/* Gentle Reassurance Callout */}
      <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-3.5">
        <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
          <strong className="font-semibold block text-emerald-950 dark:text-emerald-100">
            Did you know? Early Intervention is free and requires no doctor prescription.
          </strong>
          <p className="text-emerald-900/90 dark:text-emerald-200/90">
            Under the federal Individuals with Disabilities Education Act (IDEA Part C), every community provides free developmental screenings and supportive therapies (speech, motor, feeding) for children ages 0 to 3. You can reach out directly as a parent anytime.
          </p>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DEVELOPMENTAL_RESOURCES.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-[#182230] rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  {res.type}
                </span>
                <span className="text-[11px] text-stone-600 dark:text-stone-300">
                  {res.organization}
                </span>
              </div>

              <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-1.5">
                {res.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
                {res.description}
              </p>

              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-[11px] text-stone-600 dark:text-stone-300 mb-4">
                <strong className="text-stone-800 dark:text-stone-200">Helpful for:</strong> {res.helpfulFor}
              </div>
            </div>

            <a
              href={res.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors"
            >
              <span>Visit Official Resource</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>
        ))}
      </div>

      {/* Pediatrician Communication Tips */}
      <div className="bg-white dark:bg-[#182230] rounded-2xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 space-y-3">
        <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100">
          How to Talk With Your Pediatrician (Low-Stress Script)
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          It’s completely normal to feel a little hesitant before bringing up a concern. Here is a calm, low-tone script you can use at your next appointment:
        </p>

        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs sm:text-sm italic text-amber-950 dark:text-amber-200 leading-relaxed">
          "Doctor, I’ve noticed at home that Maya hasn’t yet started [e.g. pointing to objects / pulling up]. I know ranges are broad, but what are your thoughts? Is there a playful exercise we can try at home, or should we keep an eye on it together until our next visit?"
        </div>
      </div>
    </div>
  );
};
