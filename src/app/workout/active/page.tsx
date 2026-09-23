"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  allExercises,
  weeklyWorkoutPlan,
} from "@/lib/seedData";
import {
  WorkoutSession,
  LoggedExercise,
  LoggedSet,
  Exercise,
  WorkoutDayPlan,
} from "@/types";
import {
  getStoredActiveWorkout,
  saveStoredActiveWorkout,
  saveWorkoutSession,
  getStoredWorkoutHistory,
  savePersonalRecord,
  getStoredPersonalRecords,
} from "@/lib/storage";
import {
  evaluateProgressiveOverload,
  calculateEstimated1RM,
  calculateTotalVolumeKg,
} from "@/lib/progressiveOverload";
import { ExerciseSetRow } from "@/components/workout/ExerciseSetRow";
import { RestTimerModal } from "@/components/workout/RestTimerModal";
import { WorkoutSummaryModal } from "@/components/workout/WorkoutSummaryModal";
import { HumanBodyCanvasHQ } from "@/components/3d/HumanBodyCanvasHQ";
import { FallbackBody2D } from "@/components/3d/FallbackBody2D";
import Image from "next/image";
import {
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Dumbbell,
  ArrowLeft,
  Flame,
  Plus,
  Info,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Box,
  RotateCw,
  Zap,
} from "lucide-react";

function ActiveWorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedDayId = searchParams.get("day") || "mon_push";

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [restTimer, setRestTimer] = useState<{ open: boolean; seconds: number; exerciseName: string }>({
    open: false,
    seconds: 90,
    exerciseName: "",
  });
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [viewMode3D, setViewMode3D] = useState(true);

  // History for comparing previous sets
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  // Initialize or restore session
  useEffect(() => {
    const loadedHistory = getStoredWorkoutHistory();
    setHistory(loadedHistory);

    const storedActive = getStoredActiveWorkout();
    if (storedActive && !storedActive.completed) {
      setSession(storedActive);
      return;
    }

    // Otherwise initialize new session based on day plan
    const dayPlan = weeklyWorkoutPlan.find((p) => p.id === requestedDayId) || weeklyWorkoutPlan[0];
    const initialExercises: LoggedExercise[] = dayPlan.exercises.map((target) => {
      const exDef = allExercises.find((e) => e.id === target.exerciseId);
      const exName = exDef?.name || target.exerciseId;

      // Find previous sets from history for pre-filling targets
      const lastSessionWithEx = loadedHistory.find((h) =>
        h.exercises.some((e) => e.exerciseId === target.exerciseId)
      );
      const prevEx = lastSessionWithEx?.exercises.find((e) => e.exerciseId === target.exerciseId);

      const sets: LoggedSet[] = Array.from({ length: target.sets }).map((_, i) => {
        const prevSet = prevEx?.sets[i];
        return {
          setNumber: i + 1,
          weightKg: prevSet?.weightKg || target.defaultWeightKg,
          reps: prevSet?.reps || 8,
          targetReps: target.repRange,
          targetWeight: prevSet?.weightKg || target.defaultWeightKg,
          completed: false,
          skipped: false,
          rpe: 8,
        };
      });

      return {
        exerciseId: target.exerciseId,
        exerciseName: exName,
        sets,
      };
    });

    const newSession: WorkoutSession = {
      id: "sess_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      dayId: dayPlan.id,
      title: `${dayPlan.dayOfWeek}: ${dayPlan.name} · ${dayPlan.focus}`,
      durationSeconds: 0,
      exercises: initialExercises,
      totalVolumeKg: 0,
      completed: false,
    };

    setSession(newSession);
    saveStoredActiveWorkout(newSession);
  }, [requestedDayId]);

  // Workout duration counter
  useEffect(() => {
    if (!session || isTimerPaused || session.completed) return;
    const interval = setInterval(() => {
      setSession((prev) => {
        if (!prev) return null;
        const updated = { ...prev, durationSeconds: prev.durationSeconds + 1 };
        saveStoredActiveWorkout(updated);
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session?.completed, isTimerPaused]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#ee4d00] animate-spin" />
          <p className="text-sm text-surface-400">Loading workout session...</p>
        </div>
      </div>
    );
  }

  const currentLoggedExercise = session.exercises[activeExerciseIdx];
  const currentExerciseDef = allExercises.find((e) => e.id === currentLoggedExercise?.exerciseId);

  // Find previous session for current exercise
  const prevSessionWithEx = history.find((h) =>
    h.exercises.some((e) => e.exerciseId === currentLoggedExercise?.exerciseId)
  );
  const prevLoggedEx = prevSessionWithEx?.exercises.find(
    (e) => e.exerciseId === currentLoggedExercise?.exerciseId
  );

  // Compute progressive overload suggestion
  const overloadAdvice = currentLoggedExercise
    ? evaluateProgressiveOverload(
        prevLoggedEx ? prevLoggedEx.sets : currentLoggedExercise.sets,
        currentExerciseDef?.repRange || "8–12",
        currentExerciseDef?.equipment || "Barbell"
      )
    : null;

  // Set management
  const updateSet = (setIdx: number, patch: Partial<LoggedSet>) => {
    if (!session || !currentLoggedExercise) return;
    const updatedSets = [...currentLoggedExercise.sets];
    updatedSets[setIdx] = { ...updatedSets[setIdx], ...patch };

    const updatedExercises = [...session.exercises];
    updatedExercises[activeExerciseIdx] = {
      ...currentLoggedExercise,
      sets: updatedSets,
    };

    const totalVol = updatedExercises.reduce(
      (sum, ex) => sum + calculateTotalVolumeKg(ex.sets),
      0
    );

    const updatedSession = { ...session, exercises: updatedExercises, totalVolumeKg: totalVol };
    setSession(updatedSession);
    saveStoredActiveWorkout(updatedSession);
  };

  const toggleCompleteSet = (setIdx: number) => {
    const currentSet = currentLoggedExercise.sets[setIdx];
    const willBeCompleted = !currentSet.completed;

    updateSet(setIdx, { completed: willBeCompleted });

    // Check if new PR
    if (willBeCompleted && currentSet.weightKg > 0 && currentSet.reps > 0) {
      const e1rm = calculateEstimated1RM(currentSet.weightKg, currentSet.reps);
      const prs = getStoredPersonalRecords();
      const existingWeightPr = prs.find(
        (p) => p.exerciseId === currentLoggedExercise.exerciseId && p.metricType === "max_weight"
      );
      if (!existingWeightPr || currentSet.weightKg > existingWeightPr.value) {
        savePersonalRecord({
          id: "pr_" + Date.now(),
          exerciseId: currentLoggedExercise.exerciseId,
          exerciseName: currentLoggedExercise.exerciseName,
          metricType: "max_weight",
          value: currentSet.weightKg,
          unit: "kg",
          date: session.date,
          achievedInSessionId: session.id,
        });
      }
    }

    // Launch rest timer on completion
    if (willBeCompleted) {
      const restSec = currentExerciseDef?.restSeconds || 90;
      setRestTimer({
        open: true,
        seconds: restSec,
        exerciseName: currentLoggedExercise.exerciseName,
      });
    }
  };

  const addSet = () => {
    if (!session || !currentLoggedExercise) return;
    const lastSet = currentLoggedExercise.sets[currentLoggedExercise.sets.length - 1];
    const newSet: LoggedSet = {
      setNumber: currentLoggedExercise.sets.length + 1,
      weightKg: lastSet?.weightKg || 30,
      reps: lastSet?.reps || 8,
      targetReps: currentExerciseDef?.repRange || "8–12",
      targetWeight: lastSet?.weightKg || 30,
      completed: false,
      skipped: false,
      rpe: 8,
    };
    const updatedSets = [...currentLoggedExercise.sets, newSet];
    const updatedExercises = [...session.exercises];
    updatedExercises[activeExerciseIdx] = { ...currentLoggedExercise, sets: updatedSets };
    const updated = { ...session, exercises: updatedExercises };
    setSession(updated);
    saveStoredActiveWorkout(updated);
  };

  const deleteSet = (setIdx: number) => {
    if (!session || !currentLoggedExercise || currentLoggedExercise.sets.length <= 1) return;
    const updatedSets = currentLoggedExercise.sets
      .filter((_, i) => i !== setIdx)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    const updatedExercises = [...session.exercises];
    updatedExercises[activeExerciseIdx] = { ...currentLoggedExercise, sets: updatedSets };
    const updated = { ...session, exercises: updatedExercises };
    setSession(updated);
    saveStoredActiveWorkout(updated);
  };

  // Complete entire workout session
  const handleFinishWorkout = () => {
    const finished: WorkoutSession = {
      ...session,
      completed: true,
      completedAt: new Date().toISOString(),
      totalVolumeKg: session.exercises.reduce(
        (sum, ex) => sum + calculateTotalVolumeKg(ex.sets),
        0
      ),
    };
    saveWorkoutSession(finished);
    saveStoredActiveWorkout(null);
    setSession(finished);
    setShowSummaryModal(true);
  };

  // Format elapsed time (HH:MM:SS)
  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Session Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[#111827] border border-[#1f293d] shadow-[0_0_25px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/workout")}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-[#111114] border border-[#26262b] hover:border-[#ee4d00]/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#ee4d00]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ee4d00] animate-pulse shadow-[0_0_8px_#ee4d00]" />
              <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                {session.title}
              </h1>
            </div>
            <p className="text-xs text-neutral-400 font-mono font-medium">
              Exercise {activeExerciseIdx + 1} of {session.exercises.length} &bull; GYM X ENGINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Elapsed Timer Ticker */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#08080a] border border-[#26262b] font-mono text-sm font-bold text-white">
            <Clock className="w-4 h-4 text-[#ee4d00]" />
            <span>{formatElapsed(session.durationSeconds)}</span>
            <button
              type="button"
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="p-1 text-neutral-400 hover:text-white transition-colors"
            >
              {isTimerPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Finish Workout Button */}
          <button
            type="button"
            onClick={handleFinishWorkout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ee4d00] text-white font-extrabold text-xs shadow-[0_0_20px_rgba(238,77,0,0.35)] hover:bg-[#ff5500] transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>

      {/* Exercise Navigation Tabs Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {session.exercises.map((ex, idx) => {
          const isCompleted = ex.sets.every((s) => s.completed || s.skipped);
          const isActive = idx === activeExerciseIdx;
          return (
            <button
              key={ex.exerciseId}
              type="button"
              onClick={() => setActiveExerciseIdx(idx)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                isActive
                  ? "bg-[#ee4d00] text-white border-[#ee4d00] shadow-[0_0_12px_rgba(238,77,0,0.35)]"
                  : isCompleted
                  ? "bg-[#ee4d00]/15 text-[#ee4d00] border-[#ee4d00]/30"
                  : "bg-[#111114] text-neutral-300 border-[#26262b] hover:border-[#ee4d00]/40"
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[140px]">{ex.exerciseName}</span>
              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
            </button>
          );
        })}
      </div>

      {/* Main Active Exercise Card & Visual Area */}
      {currentLoggedExercise && currentExerciseDef && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Set Logger & Progressive Overload Engine */}
          <div className="lg:col-span-7 space-y-5">
            {/* Header Card */}
            <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] shadow-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ee4d00]/15 text-[#ee4d00] border border-[#ee4d00]/30 shadow-[0_0_8px_rgba(238,77,0,0.2)]">
                    {currentExerciseDef.category} &bull; {currentExerciseDef.equipment}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
                    {currentExerciseDef.name}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Prescribed: <strong className="text-neutral-200">{currentExerciseDef.defaultSets} sets &times; {currentExerciseDef.repRange} reps</strong> &bull; Rest {Math.round(currentExerciseDef.restSeconds / 60)}m
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Tempo</span>
                  <p className="text-xs font-mono font-bold text-[#ee4d00]">{currentExerciseDef.tempo}</p>
                </div>
              </div>

              {/* Progressive Overload Engine Insight Box */}
              {overloadAdvice && (
                <div className="p-4 rounded-2xl bg-[#ee4d00]/10 border border-[#ee4d00]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ee4d00]" />
                      <span className="text-xs font-bold text-[#ee4d00] uppercase tracking-wider">
                        Progressive Overload Target
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ee4d00]/20 text-[#ee4d00]">
                      {overloadAdvice.trendBadge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white">{overloadAdvice.message}</p>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">{overloadAdvice.detail}</p>
                </div>
              )}
            </div>

            {/* Set Logging List */}
            <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] shadow-2xl space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Logged Sets ({currentLoggedExercise.sets.filter((s) => s.completed).length}/{currentLoggedExercise.sets.length})
                </h3>
                <button
                  type="button"
                  onClick={addSet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08080a] hover:bg-[#26262b] text-[#ee4d00] font-bold text-xs border border-[#26262b] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Set</span>
                </button>
              </div>

              {currentLoggedExercise.sets.map((set, setIdx) => (
                <ExerciseSetRow
                  key={setIdx}
                  set={set}
                  prevSet={prevLoggedEx?.sets[setIdx]}
                  onUpdate={(patch) => updateSet(setIdx, patch)}
                  onToggleComplete={() => toggleCompleteSet(setIdx)}
                  onDelete={() => deleteSet(setIdx)}
                />
              ))}

              {/* Next Exercise navigation footer */}
              <div className="pt-4 flex items-center justify-between border-t border-[#26262b] mt-4">
                <button
                  type="button"
                  disabled={activeExerciseIdx === 0}
                  onClick={() => setActiveExerciseIdx((prev) => prev - 1)}
                  className="px-4 py-2 text-xs font-bold text-neutral-400 disabled:opacity-30 hover:text-white transition-colors"
                >
                  &larr; Previous Exercise
                </button>
                <button
                  type="button"
                  disabled={activeExerciseIdx >= session.exercises.length - 1}
                  onClick={() => setActiveExerciseIdx((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08080a] hover:bg-[#26262b] text-white font-bold text-xs border border-[#26262b] disabled:opacity-30 transition-colors"
                >
                  <span>Next Exercise</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#ee4d00]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D / HQ GIF Interactive Anatomy Visualizer */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-[#111114] border border-[#26262b] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-[#ee4d00]" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    {viewMode3D ? "3D Biomechanical Execution" : "HQ Animated Loop"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode3D(!viewMode3D)}
                  className="text-[11px] font-bold text-[#ee4d00] hover:underline flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Switch to {viewMode3D ? "HQ GIF Loop" : "3D Stage"}</span>
                </button>
              </div>

              {/* Visualization Canvas */}
              {viewMode3D ? (
                <div className="rounded-2xl overflow-hidden border border-[#26262b] bg-[#08080a]">
                  <HumanBodyCanvasHQ
                    exerciseId={currentExerciseDef.id}
                    primaryMuscle={currentExerciseDef.primaryMuscle}
                    secondaryMuscles={currentExerciseDef.secondaryMuscles}
                    height="h-[400px]"
                    showControls={true}
                    enableAutoRotate={false}
                    initialPreset="front"
                  />
                </div>
              ) : (
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-[#26262b] bg-[#08080a]">
                  <Image
                    src={`/exercises/${currentExerciseDef.id}.gif`}
                    alt={currentExerciseDef.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}

              {/* Form Cues & Common Mistakes */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
                  <p className="text-xs font-bold text-[#ee4d00] uppercase tracking-wider mb-1.5">
                    Form Cues
                  </p>
                  <ul className="space-y-1">
                    {currentExerciseDef.formCues.map((cue, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="text-[#ee4d00] font-bold">&bull;</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#08080a] border border-[#26262b]">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                    Avoid Mistakes
                  </p>
                  <ul className="space-y-1">
                    {currentExerciseDef.commonMistakes.map((m, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">&times;</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={restTimer.open}
        initialSeconds={restTimer.seconds}
        exerciseName={restTimer.exerciseName}
        onFinish={() => setRestTimer((prev) => ({ ...prev, open: false }))}
        onSkip={() => setRestTimer((prev) => ({ ...prev, open: false }))}
      />

      {/* Workout Finished Celebration Modal */}
      <WorkoutSummaryModal
        isOpen={showSummaryModal}
        session={session}
        onClose={() => {
          setShowSummaryModal(false);
          router.push("/");
        }}
      />
    </div>
  );
}

export default function ActiveWorkoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#ee4d00] animate-spin" />
            <p className="text-sm text-surface-400">Loading workout session...</p>
          </div>
        </div>
      }
    >
      <ActiveWorkoutContent />
    </Suspense>
  );
}

