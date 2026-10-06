/**
 * Practice Sandbox Daily Queue & Rollover Engine
 * 
 * Rules:
 * 1. If student solves ALL questions assigned today: Next day brand new problems are generated.
 * 2. If any questions are left unsolved ("jo question bachta hai"): They automatically rollover
 *    into the next day's practice problem queue alongside fresh challenges.
 */

import { PRACTICE_PROBLEM_BANK } from '../data/practiceProblemBank.js';

export const DAILY_TARGET_COUNT = 3;

/**
 * Gets formatted date string YYYY-MM-DD
 */
export function getTodayDateString(offsetDays = 0) {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return d.toISOString().split('T')[0];
}

/**
 * Computes or transitions the daily practice state for a given date
 */
export function computeDailyPracticeState(targetDateStr, currentDailyState, solvedProblemIds = []) {
  const allBankIds = PRACTICE_PROBLEM_BANK.map(p => p.id);

  // If no previous state, initialize Day 1 with first 3 problems
  if (!currentDailyState || !currentDailyState.date || !currentDailyState.activeProblemIds || currentDailyState.activeProblemIds.length === 0) {
    const initialBatch = allBankIds.slice(0, DAILY_TARGET_COUNT);
    return {
      date: targetDateStr,
      activeProblemIds: initialBatch,
      rolledOverProblemIds: [],
      history: [],
      lastRolloverStatus: 'INITIALIZED'
    };
  }

  // If already at target date, return current state
  if (currentDailyState.date === targetDateStr) {
    return currentDailyState;
  }

  // Target date is different (A new day has arrived or next day simulated!)
  // 1. Check which of yesterday's active problems were solved
  const previousActive = currentDailyState.activeProblemIds || [];
  const unsolvedFromPrevious = previousActive.filter(id => !solvedProblemIds.includes(id));
  const solvedCount = previousActive.length - unsolvedFromPrevious.length;
  const allPreviousSolved = unsolvedFromPrevious.length === 0;

  let newActiveIds = [];
  let newRolledOverIds = [];
  let statusMessage = '';

  if (allPreviousSolved) {
    // SCENARIO 1: ALL QUESTIONS SOLVED!
    // Give 100% brand-new questions from the bank that haven't been solved
    const freshAvailable = allBankIds.filter(id => !solvedProblemIds.includes(id) && !previousActive.includes(id));
    const fallbackAvailable = allBankIds.filter(id => !previousActive.includes(id));

    const pool = freshAvailable.length >= DAILY_TARGET_COUNT ? freshAvailable : (fallbackAvailable.length >= DAILY_TARGET_COUNT ? fallbackAvailable : allBankIds);
    newActiveIds = pool.slice(0, DAILY_TARGET_COUNT);
    newRolledOverIds = [];
    statusMessage = `All previous challenges solved! (${solvedCount}/${previousActive.length}) 🎉 Fresh set of ${DAILY_TARGET_COUNT} new questions unlocked for today!`;
  } else {
    // SCENARIO 2: SOME QUESTIONS LEFT UNSOLVED ("jo question bachta hai use next day me add kr do")
    // Keep all unsolved questions as rolled over
    newRolledOverIds = [...unsolvedFromPrevious];

    // Find new questions to complement the backlog up to target count (or at least 1 new problem)
    const neededNewCount = Math.max(1, DAILY_TARGET_COUNT - newRolledOverIds.length);
    const availableNew = allBankIds.filter(id => !newRolledOverIds.includes(id) && !solvedProblemIds.includes(id));
    const fallbackNew = allBankIds.filter(id => !newRolledOverIds.includes(id));

    const candidatePool = availableNew.length > 0 ? availableNew : fallbackNew;
    const addedFresh = candidatePool.slice(0, neededNewCount);

    newActiveIds = [...newRolledOverIds, ...addedFresh];
    statusMessage = `Rollover Active: ${newRolledOverIds.length} unsolved problem(s) carried over from yesterday + ${addedFresh.length} new challenge added!`;
  }

  const historyEntry = {
    date: currentDailyState.date,
    assignedCount: previousActive.length,
    solvedCount: solvedCount,
    allSolved: allPreviousSolved,
    rolledOverCount: newRolledOverIds.length,
    timestamp: new Date().toISOString()
  };

  return {
    date: targetDateStr,
    activeProblemIds: newActiveIds,
    rolledOverProblemIds: newRolledOverIds,
    history: [historyEntry, ...(currentDailyState.history || [])],
    lastRolloverStatus: allPreviousSolved ? 'ALL_SOLVED_FRESH_DAY' : 'UNSOLVED_ROLLED_OVER',
    statusMessage: statusMessage
  };
}
