import React, { useState } from 'react';
import { X, ClipboardList, Copy, Check, HeartHandshake, Printer, ExternalLink, Baby, Sparkles } from 'lucide-react';
import { Milestone, ChildProfile, AgeCalculation } from '../types';

interface DoctorNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Milestone[];
  childProfile: ChildProfile;
  ageInfo: AgeCalculation;
  onOpenResources: () => void;
  onUnflagMilestone: (milestone: Milestone) => void;
}

export const DoctorNotesModal: React.FC<DoctorNotesModalProps> = ({
  isOpen,
  onClose,
  milestones,
  childProfile,
  ageInfo,
  onOpenResources,
  onUnflagMilestone,
}) => {
  const [copied, setCopied] = useState(false);
  const [additionalNote, setAdditionalNote] = useState('');

  if (!isOpen) return null;

  // Collect all flagged milestones OR milestones that are marked in progress
  const flaggedItems = milestones.filter((m) => m.flaggedForDoctor);
  const inProgressItems = milestones.filter((m) => m.status === 'in_progress' && !m.flaggedForDoctor);

  const generateCopyText = () => {
    let text = `WELL-CHILD VISIT QUESTIONS FOR ${childProfile.name.toUpperCase()}\n`;
    text += `Current Age: ${ageInfo.formattedString} (Born: ${childProfile.birthDate})\n`;
    text += `Date Prepared: ${new Date().toLocaleDateString()}\n\n`;

    if (flaggedItems.length > 0) {
      text += `ITEMS WE'D LIKE TO GENTLY ASK ABOUT:\n`;
      flaggedItems.forEach((item, idx) => {
        text += `${idx + 1}. ${item.title} (${item.domain} milestone, typical around ${item.ageMonths} mo)\n`;
        text += `   - Observation: Not yet consistently observed at home.\n`;
        if (item.doctorNote) {
          text += `   - Parent Note: ${item.doctorNote}\n`;
        }
      });
      text += `\n`;
    }

    if (inProgressItems.length > 0) {
      text += `CURRENTLY PRACTICING / EMERGING SKILLS:\n`;
      inProgressItems.forEach((item, idx) => {
        text += `- ${item.title} (${item.ageMonths} mo)\n`;
      });
      text += `\n`;
    }

    if (additionalNote.trim()) {
      text += `ADDITIONAL QUESTIONS FOR THE DOCTOR:\n${additionalNote.trim()}\n\n`;
    }

    text += `Low-Tone Discussion Starter: "Doctor, I wanted to check in on a couple developmental items just to get your thoughts and see what you suggest we practice at home."`;
    return text;
  };

  const handleCopy = () => {
    const fullText = generateCopyText();
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#182230] rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 leading-snug">
                Pediatrician Visit Checklist
              </h2>
              <span className="text-xs text-stone-500">
                A gentle, low-pressure guide for {childProfile.name} ({ageInfo.formattedString})
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

        {/* Low-Tone Empathy Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
          <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Keep it relaxed & supportive</strong>
            Doctors love when parents bring observations. There is never any need to feel defensive or anxious—sharing what you see at home helps your care team celebrate your child together.
          </div>
        </div>

        {/* Flagged Milestones Section */}
        <div>
          <h3 className="font-semibold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
            Items to Gently Inquire About ({flaggedItems.length})
          </h3>

          {flaggedItems.length > 0 ? (
            <div className="space-y-2.5">
              {flaggedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300 uppercase">
                        {item.domain} • {item.ageMonths} Mo Checkpoint
                      </span>
                    </div>
                    <strong className="block text-stone-800 dark:text-stone-200">{item.title}</strong>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">{item.description}</p>
                  </div>

                  <button
                    onClick={() => onUnflagMilestone(item)}
                    className="text-[11px] text-stone-400 hover:text-rose-600 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
              No milestones currently flagged. You can check the "Flag for next doctor checkup" box on any milestone card in the Milestones tab.
            </p>
          )}
        </div>

        {/* Custom Parent Questions */}
        <div>
          <label className="block font-semibold text-xs text-stone-700 dark:text-stone-300 mb-1">
            Additional Questions You'd Like to Ask (Sleep, Feeding, Teething...)
          </label>
          <textarea
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            placeholder="e.g. Any concerns about solid food transition? Are short naps at 10 months okay?..."
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={onOpenResources}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium self-start sm:self-center"
          >
            Explore Free Early Intervention Resources →
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Questions List</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
