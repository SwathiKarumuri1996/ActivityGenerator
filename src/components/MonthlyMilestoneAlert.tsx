import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  Compass, 
  Check, 
  X, 
  Clock, 
  Baby, 
  Calendar, 
  HeartHandshake, 
  Volume2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ChildProfile, AgeCalculation, MonthAlertRecord } from '../types';
import { acknowledgeMonthAlert, saveMonthAlertRecord } from '../utils/storage';

interface MonthlyMilestoneAlertProps {
  childProfile: ChildProfile;
  ageInfo: AgeCalculation;
  alertRecord: MonthAlertRecord;
  onUpdateAlertRecord: (record: MonthAlertRecord) => void;
  onNavigateToMilestones: (ageBand?: number) => void;
  onNavigateToPlay: () => void;
  isManuallyOpened?: boolean;
  onCloseManual?: () => void;
}

export const MonthlyMilestoneAlert: React.FC<MonthlyMilestoneAlertProps> = ({
  childProfile,
  ageInfo,
  alertRecord,
  onUpdateAlertRecord,
  onNavigateToMilestones,
  onNavigateToPlay,
  isManuallyOpened = false,
  onCloseManual,
}) => {
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [showCelebrationNotice, setShowCelebrationNotice] = useState(false);

  // Check if browser notifications are supported
  const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window;

  // Determine if this is a newly reached month that hasn't been acknowledged
  const isNewMonthReached = ageInfo.totalMonths > alertRecord.lastAcknowledgedMonth;
  const isVisible = (isNewMonthReached && !isSnoozed) || isManuallyOpened;

  // Sync notification permission state
  useEffect(() => {
    if (isNotificationSupported) {
      setNotificationPermission(Notification.permission);
    }
  }, [isNotificationSupported]);

  // Trigger browser notification if enabled and permitted when a new month is detected
  useEffect(() => {
    if (
      isNewMonthReached &&
      alertRecord.enableBrowserNotifications &&
      isNotificationSupported &&
      Notification.permission === 'granted'
    ) {
      // Ensure we don't spam notifications multiple times in the same day for the same month
      const todayStr = new Date().toISOString().split('T')[0];
      if (alertRecord.lastNotifiedDate?.startsWith(todayStr)) {
        return;
      }

      try {
        const notif = new Notification(`🎉 ${childProfile.name} is now ${ageInfo.totalMonths} months old!`, {
          body: `Tap to explore gentle ${ageInfo.milestoneAgeBand}-month milestones and low-prep home play ideas.`,
          icon: '/favicon.ico',
        });
        notif.onclick = () => {
          window.focus();
          onNavigateToMilestones(ageInfo.milestoneAgeBand);
        };
        // Update last notified date
        onUpdateAlertRecord({
          ...alertRecord,
          lastNotifiedDate: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not trigger browser notification:', err);
      }
    }
  }, [
    ageInfo.totalMonths,
    ageInfo.milestoneAgeBand,
    isNewMonthReached,
    alertRecord.enableBrowserNotifications,
    alertRecord.lastNotifiedDate,
    childProfile.name,
    isNotificationSupported,
    onNavigateToMilestones,
    onUpdateAlertRecord,
    alertRecord,
  ]);

  const handleAcknowledge = () => {
    const updated = acknowledgeMonthAlert(ageInfo.totalMonths);
    onUpdateAlertRecord(updated);
    setShowCelebrationNotice(true);
    setTimeout(() => {
      setShowCelebrationNotice(false);
      if (isManuallyOpened && onCloseManual) {
        onCloseManual();
      }
    }, 2400);
  };

  const handleSnooze = () => {
    setIsSnoozed(true);
    if (isManuallyOpened && onCloseManual) {
      onCloseManual();
    }
  };

  const handleEnableBrowserNotifications = async () => {
    if (!isNotificationSupported) return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        const updated: MonthAlertRecord = {
          ...alertRecord,
          enableBrowserNotifications: true,
          lastNotifiedDate: new Date().toISOString(),
        };
        saveMonthAlertRecord(updated);
        onUpdateAlertRecord(updated);

        // Send a friendly confirmation notification
        new Notification(`Reminders active for ${childProfile.name}! 🌱`, {
          body: `We'll gently notify you whenever ${childProfile.name} reaches a new age month.`,
          icon: '/favicon.ico',
        });
      }
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
    }
  };

  if (!isVisible && !showCelebrationNotice) {
    return null;
  }

  if (showCelebrationNotice) {
    return (
      <div 
        id="milestone-acknowledged-toast"
        className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-center justify-between shadow-xs animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold">
              Milestone check logged for {ageInfo.totalMonths} months!
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
              We'll notify you again next month when {childProfile.name} turns {ageInfo.totalMonths + 1} months old.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCelebrationNotice(false)}
          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs px-2 py-1"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      id="monthly-milestone-alert-banner"
      className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-emerald-50/40 dark:from-amber-950/30 dark:via-stone-900/50 dark:to-emerald-950/20 border border-amber-200/70 dark:border-amber-800/50 shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          
          {/* Main Info & Encouragement */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-100/90 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 shadow-xs border border-amber-200/60 dark:border-amber-800/40 text-xl">
              🎂
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  New Age Month Checkpoint
                </span>
                <span className="text-[11px] text-stone-600 dark:text-stone-300">
                  Based on birth date ({childProfile.birthDate})
                </span>
              </div>

              <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                Happy {ageInfo.totalMonths} months, {childProfile.name}! 🎉
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                {childProfile.name} is now <strong>{ageInfo.formattedString}</strong>. Every baby develops on their own peaceful timeline. This is a gentle reminder to check newly emerging communication, movement, and play milestones for this stage.
              </p>
            </div>
          </div>

          {/* Dismiss / Close Icon */}
          <div className="flex items-center gap-1 self-end sm:self-start">
            <button
              onClick={handleSnooze}
              title="Remind me later"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-4 pt-3.5 border-t border-amber-200/50 dark:border-amber-900/30 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Action: Go to Milestones */}
            <button
              id="alert-check-milestones-btn"
              onClick={() => {
                handleAcknowledge();
                onNavigateToMilestones(ageInfo.milestoneAgeBand);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Review {ageInfo.milestoneAgeBand}-Mo Milestones</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Secondary Action: Go to Play Ideas */}
            <button
              id="alert-try-play-btn"
              onClick={() => {
                onNavigateToPlay();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Explore {ageInfo.totalMonths}-Mo Play Ideas</span>
            </button>

            {/* Mark Checked Button */}
            <button
              id="alert-mark-checked-btn"
              onClick={handleAcknowledge}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Checked for {ageInfo.totalMonths} mo</span>
            </button>
          </div>

          {/* Browser Notification Opt-In / Status */}
          {isNotificationSupported && (
            <div className="flex items-center text-xs">
              {notificationPermission === 'granted' ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                  <Bell className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Monthly device reminders active
                </span>
              ) : (
                <button
                  onClick={handleEnableBrowserNotifications}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300 hover:underline"
                  title="Receive a gentle notification when turning a new month"
                >
                  <Bell className="w-3 h-3" />
                  <span>Enable monthly browser reminder</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
