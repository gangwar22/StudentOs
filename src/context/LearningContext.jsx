import React, { createContext, useContext, useState, useEffect } from 'react';
import initialCourses from '../data/dummyCourses.json';
import initialSkills from '../data/dummySkills.json';
import { curriculumPhases as initialCurriculumPhases } from '../data/curriculumPhases';
import { useAuth } from './AuthContext';
import { apiRequest } from '../services/api';

const LearningContext = createContext();

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function LearningProvider({ children }) {
  const { user } = useAuth();
  const userKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'guest';

  const [curriculumPhases, setCurriculumPhases] = useState(initialCurriculumPhases);
  const [courses, setCourses] = useState(initialCourses);
  const [skills, setSkills] = useState(initialSkills);

  // Fetch curriculum phases from backend MongoDB Atlas API on mount
  useEffect(() => {
    let isCancelled = false;
    const fetchCurriculum = async () => {
      try {
        const response = await fetch('/api/curriculum');
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && Array.isArray(resData.data) && resData.data.length > 0 && !isCancelled) {
            setCurriculumPhases(resData.data);
          }
        }
      } catch (err) {
        console.warn('Backend curriculum phases fetch error, falling back to local data:', err.message);
      }
    };
    fetchCurriculum();
    return () => { isCancelled = true; };
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);

  // Track completed lessons by ID
  const [completedLessonIds, setCompletedLessonIds] = useState([]);

  // Track completed phase numbers (e.g. [1] unlocks Phase 2, [1, 2] unlocks Phase 2.5)
  const [completedPhaseNumbers, setCompletedPhaseNumbers] = useState([]);

  // Track phase start dates per phase
  const [phaseStartDates, setPhaseStartDates] = useState({});

  // Track phase completion dates per phase
  const [phaseCompletionDates, setPhaseCompletionDates] = useState({});

  // Track days spent by student on each phase
  const [phaseDaysSpent, setPhaseDaysSpent] = useState({
    1: 0,
    2: 0,
    2.5: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0
  });

  // Phase Deadlines (in Days)
  const phaseDeadlines = {
    1: 7,
    2: 10,
    2.5: 7,
    3: 12,
    4: 14,
    5: 14,
    6: 14,
    7: 21
  };

  // Mini Projects Submission state (GitHub + Live Deploy link per mini project)
  const [submittedMiniProjects, setSubmittedMiniProjects] = useState({});

  // Track daily goals with automatic next-day rollover logic
  const [dailyGoals, setDailyGoals] = useState([]);

  // Weekly Goals state
  const [weeklyGoals, setWeeklyGoals] = useState([]);

  // Monthly Goals state
  const [monthlyGoals, setMonthlyGoals] = useState([]);

  // Saved Reflection Logs History
  const [reflectionLogs, setReflectionLogs] = useState([]);

  // Assessment Attempts Tracker per Phase
  const [assessmentAttempts, setAssessmentAttempts] = useState([]);

  // AI Mentor Chat Conversation History
  const [aiMentorHistory, setAiMentorHistory] = useState([]);

  // Solved Practice Problem IDs & Total XP
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const [totalXP, setTotalXP] = useState(0);

  // Practice Sandbox Daily Rollover State
  const [practiceDailyState, setPracticeDailyState] = useState(null);

  // Asked Question IDs (Prevents MCQ question repetition)
  const [askedQuestionIds, setAskedQuestionIds] = useState([]);

  const recordAskedQuestions = (newIds = []) => {
    if (!Array.isArray(newIds) || newIds.length === 0) return;
    setAskedQuestionIds(prev => {
      const setObj = new Set(prev);
      let hasNew = false;
      newIds.forEach(id => {
        if (id && !setObj.has(id)) {
          setObj.add(id);
          hasNew = true;
        }
      });
      return hasNew ? Array.from(setObj) : prev;
    });
  };

  // Student Activity Logs (Stores all platform events in MongoDB Atlas)
  const [activityLogs, setActivityLogs] = useState([]);

  const logActivity = (activity) => {
    const entry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type: activity.type || 'general',
      title: activity.title,
      detail: activity.detail || ''
    };
    setActivityLogs(prev => [entry, ...prev]);
  };

  // Load state whenever userKey changes
  // Load user data on user change (MongoDB Atlas first, fallback to localStorage)
  useEffect(() => {
    let isCancelled = false;
    setIsLoaded(false);
    if (!userKey || !user?.email) return;

    const loadUserData = async () => {
      try {
        const resData = await apiRequest('/api/user/data/me');
        if (resData.success && resData.data && !isCancelled) {
            const dbData = resData.data;
            if (dbData.completedLessonIds) setCompletedLessonIds(dbData.completedLessonIds);
            if (dbData.completedPhaseNumbers) setCompletedPhaseNumbers(dbData.completedPhaseNumbers);
            if (dbData.phaseStartDates) setPhaseStartDates(dbData.phaseStartDates);
            if (dbData.phaseCompletionDates) setPhaseCompletionDates(dbData.phaseCompletionDates);
            if (dbData.phaseDaysSpent) setPhaseDaysSpent(dbData.phaseDaysSpent);
            if (dbData.submittedMiniProjects) setSubmittedMiniProjects(dbData.submittedMiniProjects);
            if (dbData.dailyGoals) setDailyGoals(dbData.dailyGoals);
            if (dbData.weeklyGoals) setWeeklyGoals(dbData.weeklyGoals);
            if (dbData.monthlyGoals) setMonthlyGoals(dbData.monthlyGoals);
            if (dbData.reflectionLogs) setReflectionLogs(dbData.reflectionLogs);
            if (dbData.assessmentAttempts) setAssessmentAttempts(dbData.assessmentAttempts);
            if (dbData.aiMentorHistory) setAiMentorHistory(dbData.aiMentorHistory);
            if (dbData.solvedProblemIds) setSolvedProblemIds(dbData.solvedProblemIds);
            if (typeof dbData.totalXP === 'number') setTotalXP(dbData.totalXP);
            if (dbData.activityLogs) setActivityLogs(dbData.activityLogs);
            if (dbData.askedQuestionIds) setAskedQuestionIds(dbData.askedQuestionIds);
            if (dbData.practiceDailyState) setPracticeDailyState(dbData.practiceDailyState);

            setPhaseStartDates(prev => {
              const dates = dbData.phaseStartDates && Object.keys(dbData.phaseStartDates).length > 0 ? dbData.phaseStartDates : prev;
              if (!dates || !dates[1]) {
                return { ...(dates || {}), 1: user?.createdAt || new Date().toISOString() };
              }
              return dates;
            });

            setIsLoaded(true);
            return;
        }
      } catch (err) {
        console.warn('MongoDB load user data fallback to local storage:', err.message);
      }

      if (isCancelled) return;
      const savedLessons = localStorage.getItem(`student_os_${userKey}_completed_lessons`);
      setCompletedLessonIds(savedLessons ? JSON.parse(savedLessons) : []);

      const savedPhases = localStorage.getItem(`student_os_${userKey}_completed_phases`);
      setCompletedPhaseNumbers(savedPhases ? JSON.parse(savedPhases) : []);

      const savedDays = localStorage.getItem(`student_os_${userKey}_phase_days`);
      setPhaseDaysSpent(savedDays ? JSON.parse(savedDays) : { 1: 0, 2: 0, 2.5: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 });

      const savedMiniProjects = localStorage.getItem(`student_os_${userKey}_submitted_mini_projects`);
      setSubmittedMiniProjects(savedMiniProjects ? JSON.parse(savedMiniProjects) : {});

      const savedDaily = localStorage.getItem(`student_os_${userKey}_daily_goals`);
      setDailyGoals(savedDaily ? JSON.parse(savedDaily) : []);

      const savedWeekly = localStorage.getItem(`student_os_${userKey}_weekly_goals`);
      setWeeklyGoals(savedWeekly ? JSON.parse(savedWeekly) : []);

      const savedMonthly = localStorage.getItem(`student_os_${userKey}_monthly_goals`);
      setMonthlyGoals(savedMonthly ? JSON.parse(savedMonthly) : []);

      const savedReflections = localStorage.getItem(`student_os_${userKey}_reflection_logs`);
      setReflectionLogs(savedReflections ? JSON.parse(savedReflections) : []);

      const savedAttempts = localStorage.getItem(`student_os_${userKey}_assessment_attempts`);
      setAssessmentAttempts(savedAttempts ? JSON.parse(savedAttempts) : []);

      const savedMentor = localStorage.getItem(`student_os_${userKey}_ai_mentor_history`);
      setAiMentorHistory(savedMentor ? JSON.parse(savedMentor) : []);

      const savedSolved = localStorage.getItem(`student_os_${userKey}_solved_problem_ids`);
      setSolvedProblemIds(savedSolved ? JSON.parse(savedSolved) : []);

      const savedXP = localStorage.getItem(`student_os_${userKey}_total_xp`);
      setTotalXP(savedXP ? JSON.parse(savedXP) : 0);

      const savedActivityLogs = localStorage.getItem(`student_os_${userKey}_activity_logs`);
      setActivityLogs(savedActivityLogs ? JSON.parse(savedActivityLogs) : []);

      const savedAskedQuestions = localStorage.getItem(`student_os_${userKey}_asked_question_ids`);
      setAskedQuestionIds(savedAskedQuestions ? JSON.parse(savedAskedQuestions) : []);

      const savedPracticeDaily = localStorage.getItem(`student_os_${userKey}_practice_daily_state`);
      setPracticeDailyState(savedPracticeDaily ? JSON.parse(savedPracticeDaily) : null);

      const savedStartDates = localStorage.getItem(`student_os_${userKey}_phase_start_dates`);
      let startDatesObj = savedStartDates ? JSON.parse(savedStartDates) : {};

      const savedCompDates = localStorage.getItem(`student_os_${userKey}_phase_completion_dates`);
      let compDatesObj = savedCompDates ? JSON.parse(savedCompDates) : {};

      if (!startDatesObj[1]) {
        startDatesObj[1] = user?.createdAt || new Date().toISOString();
      }

      setPhaseStartDates(startDatesObj);
      setPhaseCompletionDates(compDatesObj);
      setIsLoaded(true);
    };

    loadUserData();

    return () => { isCancelled = true; };
  }, [userKey, user?.email]);

  // Note: Automatic daily goal generation disabled per design (AI only suggests goals on user click)

  // Persist state changes per userKey to LocalStorage & Sync to MongoDB Atlas
  useEffect(() => {
    if (!isLoaded || !userKey) return;

    localStorage.setItem(`student_os_${userKey}_completed_lessons`, JSON.stringify(completedLessonIds));
    localStorage.setItem(`student_os_${userKey}_completed_phases`, JSON.stringify(completedPhaseNumbers));
    localStorage.setItem(`student_os_${userKey}_phase_start_dates`, JSON.stringify(phaseStartDates));
    localStorage.setItem(`student_os_${userKey}_phase_completion_dates`, JSON.stringify(phaseCompletionDates));
    localStorage.setItem(`student_os_${userKey}_phase_days`, JSON.stringify(phaseDaysSpent));
    localStorage.setItem(`student_os_${userKey}_submitted_mini_projects`, JSON.stringify(submittedMiniProjects));
    localStorage.setItem(`student_os_${userKey}_daily_goals`, JSON.stringify(dailyGoals));
    localStorage.setItem(`student_os_${userKey}_weekly_goals`, JSON.stringify(weeklyGoals));
    localStorage.setItem(`student_os_${userKey}_monthly_goals`, JSON.stringify(monthlyGoals));
    localStorage.setItem(`student_os_${userKey}_reflection_logs`, JSON.stringify(reflectionLogs));
    localStorage.setItem(`student_os_${userKey}_assessment_attempts`, JSON.stringify(assessmentAttempts));
    localStorage.setItem(`student_os_${userKey}_ai_mentor_history`, JSON.stringify(aiMentorHistory));
    localStorage.setItem(`student_os_${userKey}_solved_problem_ids`, JSON.stringify(solvedProblemIds));
    localStorage.setItem(`student_os_${userKey}_total_xp`, JSON.stringify(totalXP));
    localStorage.setItem(`student_os_${userKey}_activity_logs`, JSON.stringify(activityLogs));
    localStorage.setItem(`student_os_${userKey}_asked_question_ids`, JSON.stringify(askedQuestionIds));
    localStorage.setItem(`student_os_${userKey}_practice_daily_state`, JSON.stringify(practiceDailyState));

    if (user?.email) {
      const timeoutId = setTimeout(() => {
        apiRequest('/api/user/sync', {
          method: 'POST',
          body: JSON.stringify({
            email: user.email,
            completedLessonIds,
            completedPhaseNumbers,
            phaseStartDates,
            phaseCompletionDates,
            phaseDaysSpent,
            submittedMiniProjects,
            dailyGoals,
            weeklyGoals,
            monthlyGoals,
            reflectionLogs,
            assessmentAttempts,
            aiMentorHistory,
            solvedProblemIds,
            totalXP,
            activityLogs,
            askedQuestionIds,
            practiceDailyState
          })
        }).catch(err => console.warn('MongoDB sync error:', err));
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [
    isLoaded,
    userKey,
    user?.email,
    completedLessonIds,
    completedPhaseNumbers,
    phaseStartDates,
    phaseDaysSpent,
    submittedMiniProjects,
    dailyGoals,
    weeklyGoals,
    monthlyGoals,
    reflectionLogs,
    assessmentAttempts,
    aiMentorHistory,
    solvedProblemIds,
    totalXP,
    activityLogs,
    askedQuestionIds,
    practiceDailyState
  ]);

  const recordAssessmentAttempt = ({ phaseNumber, phaseTitle, score, passingScore, passed, correctCount, totalQuestions }) => {
    const attemptRecord = {
      id: `attempt-${Date.now()}`,
      phaseNumber,
      phaseTitle: phaseTitle || `Phase ${phaseNumber}`,
      score,
      passingScore: passingScore || 80,
      passed,
      correctCount,
      totalQuestions,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    setAssessmentAttempts(prev => [attemptRecord, ...prev]);
    logActivity({
      type: 'assessment',
      title: `Took Assessment: Phase ${phaseNumber}`,
      detail: `Score: ${score}% (${passed ? 'PASSED ✓' : 'FAILED ✗'})`
    });
  };

  const getAssessmentAttemptsForPhase = (phaseNumber) => {
    return assessmentAttempts.filter(a => Number(a.phaseNumber) === Number(phaseNumber));
  };

  const getAttemptCountForPhase = (phaseNumber) => {
    return getAssessmentAttemptsForPhase(phaseNumber).length;
  };

  const getBestScoreForPhase = (phaseNumber) => {
    const attempts = getAssessmentAttemptsForPhase(phaseNumber);
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map(a => a.score));
  };

  const getLastAttemptForPhase = (phaseNumber) => {
    const attempts = getAssessmentAttemptsForPhase(phaseNumber);
    return attempts.length > 0 ? attempts[0] : null;
  };

  const submitMiniProject = ({ phaseNumber, projectTitle, githubUrl, deployUrl }) => {
    const key = `p${phaseNumber}_${projectTitle.replace(/\s+/g, '_')}`;
    setSubmittedMiniProjects(prev => ({
      ...prev,
      [key]: {
        phaseNumber,
        projectTitle,
        githubUrl,
        deployUrl,
        submittedAt: new Date().toISOString()
      }
    }));
    logActivity({
      type: 'project',
      title: `Submitted Project: ${projectTitle}`,
      detail: `Phase ${phaseNumber} Mini-Project`
    });
  };

  const getMiniProjectSubmission = (phaseNumber, projectTitle) => {
    const key = `p${phaseNumber}_${projectTitle.replace(/\s+/g, '_')}`;
    return submittedMiniProjects[key] || null;
  };

  // State Simulation Flags for testing Loading / Empty / Error states
  const [simulatedLoading, setSimulatedLoading] = useState(false);
  const [simulatedError, setSimulatedError] = useState(false);
  const [simulatedEmpty, setSimulatedEmpty] = useState(false);

  // Sidebar Collapsed / Expanded state for Responsive Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('student_os_sidebar_collapsed');
    if (saved !== null) return JSON.parse(saved);
    return false;
  });

  useEffect(() => {
    localStorage.setItem('student_os_sidebar_collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Global Search state
  const [searchQuery, setSearchQuery] = useState('');

  const isPhaseUnlocked = (phaseNumber) => {
    if (phaseNumber === 1 || phaseNumber === 1.0) return true;
    if (phaseNumber === 2) return completedPhaseNumbers.includes(1);
    if (phaseNumber === 2.5) return completedPhaseNumbers.includes(2);
    if (phaseNumber === 3) return completedPhaseNumbers.includes(2.5) || completedPhaseNumbers.includes(2);
    if (phaseNumber === 4) return completedPhaseNumbers.includes(3);
    if (phaseNumber === 5) return completedPhaseNumbers.includes(4);
    if (phaseNumber === 6) return completedPhaseNumbers.includes(5);
    if (phaseNumber === 7) return completedPhaseNumbers.includes(6);
    return false;
  };

  const getActivePhaseNumber = () => {
    if (completedPhaseNumbers.includes(6)) return 7;
    if (completedPhaseNumbers.includes(5)) return 6;
    if (completedPhaseNumbers.includes(4)) return 5;
    if (completedPhaseNumbers.includes(3)) return 4;
    if (completedPhaseNumbers.includes(2.5)) return 3;
    if (completedPhaseNumbers.includes(2)) return 2.5;
    if (completedPhaseNumbers.includes(1)) return 2;
    return 1;
  };

  const getActivePhaseDetails = () => {
    const num = getActivePhaseNumber();
    const phaseTitles = {
      1: 'Phase 1: Foundations of Web (HTML/CSS & DOM)',
      2: 'Phase 2: Master JavaScript & Problem Solving',
      2.5: 'Phase 2.5: DOM Mini Projects & API Integration',
      3: 'Phase 3: React 18 & Frontend Architecture',
      4: 'Phase 4: Node.js, Express & Server Backend',
      5: 'Phase 5: Full Stack MERN & AI Systems',
      6: 'Phase 6: Your First Database with MongoDB & Mongoose! 💾',
      7: 'Phase 7: Final Full-Stack Capstone Project with AI Integration 🚀'
    };
    return {
      number: num,
      title: phaseTitles[num] || `Phase ${num}`,
      isAllCompleted: completedPhaseNumbers.includes(7)
    };
  };

  const getNextPhaseNumber = (currentPhaseNumber) => {
    const num = Number(currentPhaseNumber);
    if (num === 1) return 2;
    if (num === 2) return 2.5;
    if (num === 2.5) return 3;
    if (num === 3) return 4;
    if (num === 4) return 5;
    if (num === 5) return 6;
    if (num === 6) return 7;
    return null;
  };

  const getPhaseCompletionRequirements = (phaseNumber) => {
    const pNum = Number(phaseNumber);
    const phaseObj = curriculumPhases.find(p => p.phaseNumber === pNum || Math.floor(p.phaseNumber) === Math.floor(pNum)) || curriculumPhases[0];
    const miniProjects = phaseObj?.miniProjects || [];
    
    // 1. Mini Projects Check (Both GitHub Repo and Live Deploy Links required)
    const totalMiniProjects = miniProjects.length;
    let submittedMiniProjectsCount = 0;
    const miniProjectStatus = miniProjects.map(proj => {
      const key = `p${pNum}_${proj.title.replace(/\s+/g, '_')}`;
      const sub = submittedMiniProjects[key];
      const isSubmitted = Boolean(sub && sub.githubUrl && sub.githubUrl.trim() && sub.deployUrl && sub.deployUrl.trim());
      if (isSubmitted) submittedMiniProjectsCount++;
      return {
        title: proj.title,
        isSubmitted,
        githubUrl: sub?.githubUrl || '',
        deployUrl: sub?.deployUrl || ''
      };
    });

    const allMiniProjectsSubmitted = totalMiniProjects === 0 || submittedMiniProjectsCount >= totalMiniProjects;

    // 2. Assessment Quiz Check (Pass score >= 80%)
    const attempts = assessmentAttempts.filter(a => Number(a.phaseNumber) === pNum);
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
    const quizPassed = attempts.some(a => a.passed || a.score >= (a.passingScore || 80));

    // 3. Overall canComplete status
    const canComplete = allMiniProjectsSubmitted && quizPassed;

    const missingRequirements = [];
    if (!allMiniProjectsSubmitted) {
      const remaining = totalMiniProjects - submittedMiniProjectsCount;
      missingRequirements.push(`Submit both GitHub Repo & Live Deploy links for all ${totalMiniProjects} Mini Projects (${remaining} remaining)`);
    }
    if (!quizPassed) {
      missingRequirements.push(`Pass Phase ${pNum} Assessment Quiz with score >= 80% (Current Best: ${bestScore}%)`);
    }

    return {
      phaseNumber: pNum,
      canComplete,
      totalMiniProjects,
      submittedMiniProjectsCount,
      allMiniProjectsSubmitted,
      miniProjectStatus,
      quizPassed,
      bestScore,
      missingRequirements
    };
  };

  const completePhase = (phaseNumber) => {
    const reqs = getPhaseCompletionRequirements(phaseNumber);
    if (!reqs.canComplete) {
      alert(`Cannot complete Phase ${phaseNumber} yet!\n\nPlease fulfill all missing requirements:\n• ` + reqs.missingRequirements.join('\n• '));
      return false;
    }

    const nowIso = new Date().toISOString();

    setPhaseCompletionDates(prev => ({
      ...(prev || {}),
      [phaseNumber]: prev?.[phaseNumber] || nowIso
    }));

    setCompletedPhaseNumbers(prev => {
      if (!prev.includes(phaseNumber)) {
        const nextPhase = getNextPhaseNumber(phaseNumber);
        if (nextPhase) {
          setPhaseStartDates(sd => ({
            ...(sd || {}),
            [nextPhase]: sd?.[nextPhase] || nowIso
          }));
        }
        return [...prev, phaseNumber];
      }
      return prev;
    });
    return true;
  };

  useEffect(() => {
    if (!isLoaded) return;
    const activeNum = getActivePhaseNumber();
    if (!activeNum) return;

    setPhaseStartDates(prev => {
      const dates = prev || {};
      if (dates[activeNum]) return dates;

      const startDate = (activeNum === 1 || activeNum === 1.0)
        ? (user?.createdAt || new Date().toISOString())
        : new Date().toISOString();

      return {
        ...dates,
        [activeNum]: startDate
      };
    });
  }, [isLoaded, completedPhaseNumbers, user?.createdAt]);

  const resetPhaseProgression = () => {
    setCompletedPhaseNumbers([]);
    setPhaseCompletionDates({});
    setPhaseStartDates({ 1: user?.createdAt || new Date().toISOString() });
  };

  const incrementPhaseDays = (phaseNumber) => {
    setPhaseDaysSpent(prev => ({
      ...prev,
      [phaseNumber]: (prev[phaseNumber] || 0) + 1
    }));
  };

  const getPhaseDeadline = (phaseNumber) => {
    return phaseDeadlines[phaseNumber] || 7;
  };

  const isNonWorkingSaturday = (dateObj) => {
    if (dateObj.getDay() !== 6) return false;
    const dayOfMonth = dateObj.getDate();
    // Exclude 1st Saturday (1st-7th of month) and 3rd Saturday (15th-21st of month)
    return dayOfMonth <= 7 || (dayOfMonth >= 15 && dayOfMonth <= 21);
  };

  const getPhaseDaysSpent = (phaseNumber) => {
    const num = Number(phaseNumber);
    
    // If phase is NOT unlocked, 0 days spent (deadline timer has NOT started yet!)
    if (!isPhaseUnlocked(num)) {
      return 0;
    }

    const startDateStr = phaseStartDates[num] || (num === 1 ? (user?.createdAt || new Date().toISOString()) : null);
    if (!startDateStr) return 0;

    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return 0;

    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    // Determine End Date:
    // If phase is COMPLETED, freeze end date at completion date (DEADLINE STOPS!)
    let end = new Date();
    if (completedPhaseNumbers.includes(num) || (phaseCompletionDates && phaseCompletionDates[num])) {
      const compDateStr = phaseCompletionDates[num] || new Date().toISOString();
      const compDate = new Date(compDateStr);
      if (!isNaN(compDate.getTime())) {
        end = compDate;
      }
    }

    const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    // Count working days between startMidnight and endMidnight (Excluding 1st & 3rd Saturdays)
    let workingDaysCount = 0;
    const curr = new Date(startMidnight.getTime());

    while (curr.getTime() <= endMidnight.getTime()) {
      if (!isNonWorkingSaturday(curr)) {
        workingDaysCount++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    return Math.max(1, workingDaysCount);
  };

  const toggleLessonCompletion = (lessonId) => {
    setCompletedLessonIds(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessonIds.includes(lessonId);
  };

  const getCourseProgress = (courseId) => {
    const course = courses.find(c => c.id === courseId || c.slug === courseId);
    if (!course) return 0;
    
    let totalLessons = 0;
    let completedCount = 0;

    course.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        totalLessons++;
        if (completedLessonIds.includes(les.id)) {
          completedCount++;
        }
      });
    });

    if (totalLessons === 0) return 0;
    return Math.round((completedCount / totalLessons) * 100);
  };



  // Automatic rollover check for incomplete goals
  const performGoalRollover = () => {
    const todayStr = getLocalDateKey();
    setDailyGoals(prevGoals => {
      let updated = [...prevGoals];
      let hasChanges = false;

      updated.forEach(g => {
        if (g.date !== todayStr && !g.completed && g.progress < 100 && !g.rolledOver) {
          hasChanges = true;
          g.rolledOver = true;

          const remaining = 100 - (g.progress || 0);
          const newRolledOverGoal = {
            id: `goal-rolled-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: g.title.includes('Remaining') ? g.title : `${g.title} (Remaining ${remaining}%)`,
            date: todayStr,
            progress: 0,
            completed: false,
            rolledOverFrom: g.date
          };
          updated.push(newRolledOverGoal);
        }
      });

      return hasChanges ? updated : prevGoals;
    });
  };

  useEffect(() => {
    performGoalRollover();
  }, []);

  const addDailyGoal = (title, initialProgress = 0) => {
    if (!title.trim()) return;
    const todayStr = getLocalDateKey();
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      date: todayStr,
      progress: Math.min(100, Math.max(0, initialProgress)),
      completed: initialProgress >= 100,
      rolledOver: false
    };
    setDailyGoals(prev => [newGoal, ...prev]);
  };

  const updateGoalProgress = (goalId, newProgress) => {
    const val = Math.min(100, Math.max(0, Number(newProgress)));
    setDailyGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          progress: val,
          completed: val === 100
        };
      }
      return g;
    }));
  };

  const toggleGoalComplete = (goalId) => {
    setDailyGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const isDone = !g.completed;
        return {
          ...g,
          completed: isDone,
          progress: isDone ? 100 : (g.progress === 100 ? 0 : g.progress)
        };
      }
      return g;
    }));
  };

  const deleteDailyGoal = (goalId) => {
    setDailyGoals(prev => prev.filter(g => g.id !== goalId));
  };

  // Forward incomplete daily goals to next day (called during/after reflection)
  const forwardIncompleteDailyGoals = (sourceDateStr = null) => {
    const fromDate = sourceDateStr || getLocalDateKey();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const toDate = tomorrow.toISOString().split('T')[0];

    const incomplete = dailyGoals.filter(g => 
      (g.date === fromDate || !g.date) && 
      !g.completed && 
      (g.progress || 0) < 100 && 
      !g.rolledOver
    );

    if (incomplete.length === 0) return [];

    const forwarded = incomplete.map((g, idx) => ({
      id: `goal-fwd-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      title: g.title.includes('(Rolled Over)') ? g.title : `${g.title} (Rolled Over)`,
      date: toDate,
      progress: 0,
      completed: false,
      rolledOverFrom: fromDate,
      forwardedFromReflection: true
    }));

    setDailyGoals(prevGoals => {
      const updatedPrev = prevGoals.map(g => {
        if (incomplete.some(inc => inc.id === g.id)) {
          return { ...g, rolledOver: true };
        }
        return g;
      });
      return [...updatedPrev, ...forwarded];
    });

    return forwarded;
  };

  // Weekly Goals Helpers
  const addWeeklyGoal = (title) => {
    if (!title.trim()) return;
    setWeeklyGoals(prev => [{ id: `wgoal-${Date.now()}`, title: title.trim(), progress: 0, completed: false }, ...prev]);
  };

  const updateWeeklyGoalProgress = (id, progress) => {
    const val = Math.min(100, Math.max(0, Number(progress)));
    setWeeklyGoals(prev => prev.map(g => g.id === id ? { ...g, progress: val, completed: val === 100 } : g));
  };

  const toggleWeeklyGoalComplete = (id) => {
    setWeeklyGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : (g.progress === 100 ? 0 : g.progress) } : g));
  };

  const deleteWeeklyGoal = (id) => {
    setWeeklyGoals(prev => prev.filter(g => g.id !== id));
  };

  // Monthly Goals Helpers
  const addMonthlyGoal = (title) => {
    if (!title.trim()) return;
    setMonthlyGoals(prev => [{ id: `mgoal-${Date.now()}`, title: title.trim(), progress: 0, completed: false }, ...prev]);
  };

  const updateMonthlyGoalProgress = (id, progress) => {
    const val = Math.min(100, Math.max(0, Number(progress)));
    setMonthlyGoals(prev => prev.map(g => g.id === id ? { ...g, progress: val, completed: val === 100 } : g));
  };

  const toggleMonthlyGoalComplete = (id) => {
    setMonthlyGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : (g.progress === 100 ? 0 : g.progress) } : g));
  };

  const deleteMonthlyGoal = (id) => {
    setMonthlyGoals(prev => prev.filter(g => g.id !== id));
  };

  // Saved Reflection Logs Helper
  const saveDailyReflection = ({ date, studentReflection, goalsSnapshot, aiFeedback, modelUsed }) => {
    const newLog = {
      id: `ref-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      studentReflection,
      goalsSnapshot: goalsSnapshot || [],
      aiFeedback,
      modelUsed: modelUsed || 'NVIDIA NIM Voice AI',
      timestamp: new Date().toISOString()
    };
    setReflectionLogs(prev => [newLog, ...prev]);
  };

  const deleteReflectionLog = (id) => {
    setReflectionLogs(prev => prev.filter(r => r.id !== id));
  };

  const forceRolloverNextDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setDailyGoals(prev => {
      let updated = prev.map(g => ({ ...g }));
      let newGoals = [];

      updated.forEach(g => {
        if (!g.completed && g.progress < 100 && !g.rolledOver) {
          g.rolledOver = true;
          const remaining = 100 - (g.progress || 0);
          newGoals.push({
            id: `goal-sim-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: g.title.includes('Remaining') ? g.title : `${g.title} (Remaining ${remaining}%)`,
            date: tomorrowStr,
            progress: 0,
            completed: false,
            rolledOverFrom: g.date
          });
        }
      });

      return [...newGoals, ...updated];
    });
  };

  const triggerStateSimulation = (type) => {
    if (type === 'loading') {
      setSimulatedLoading(true);
      setTimeout(() => setSimulatedLoading(false), 2000);
    } else if (type === 'error') {
      setSimulatedError(prev => !prev);
    } else if (type === 'empty') {
      setSimulatedEmpty(prev => !prev);
    }
  };

  const syncActivePhaseAgenda = async () => {
    const todayStr = getLocalDateKey();
    const activeNum = getActivePhaseNumber();
    const daysSpent = getPhaseDaysSpent(activeNum);
    const { getPhaseDailyAgendaTitles } = await import('../services/nvidiaVoiceMentorService');
    const agendaTitles = getPhaseDailyAgendaTitles(activeNum, daysSpent);

    const generatedGoals = agendaTitles.map((title, idx) => ({
      id: `goal-auto-${Date.now()}-${idx}`,
      title,
      date: todayStr,
      progress: 0,
      completed: false,
      rolledOver: false
    }));

    setDailyGoals(prev => {
      const existingTitles = prev.filter(g => g.date === todayStr).map(g => g.title);
      const newItems = generatedGoals.filter(g => !existingTitles.includes(g.title));
      return [...newItems, ...prev];
    });
  };

  return (
    <LearningContext.Provider value={{
      curriculumPhases,
      courses,
      skills,
      completedLessonIds,
      toggleLessonCompletion,
      isLessonCompleted,
      completedPhaseNumbers,
      completePhase,
      getPhaseCompletionRequirements,
      isPhaseUnlocked,
      getActivePhaseNumber,
      getActivePhaseDetails,
      resetPhaseProgression,
      phaseDaysSpent,
      phaseDeadlines,
      getPhaseDeadline,
      getPhaseDaysSpent,
      incrementPhaseDays,
      getCourseProgress,
      submittedMiniProjects,
      submitMiniProject,
      getMiniProjectSubmission,
      dailyGoals,
      addDailyGoal,
      updateGoalProgress,
      toggleGoalComplete,
      deleteDailyGoal,
      forwardIncompleteDailyGoals,
      weeklyGoals,
      addWeeklyGoal,
      updateWeeklyGoalProgress,
      toggleWeeklyGoalComplete,
      deleteWeeklyGoal,
      monthlyGoals,
      addMonthlyGoal,
      updateMonthlyGoalProgress,
      toggleMonthlyGoalComplete,
      deleteMonthlyGoal,
      reflectionLogs,
      saveDailyReflection,
      deleteReflectionLog,
      assessmentAttempts,
      recordAssessmentAttempt,
      getAssessmentAttemptsForPhase,
      getAttemptCountForPhase,
      getBestScoreForPhase,
      getLastAttemptForPhase,
      aiMentorHistory,
      setAiMentorHistory,
      solvedProblemIds,
      setSolvedProblemIds,
      totalXP,
      setTotalXP,
      practiceDailyState,
      setPracticeDailyState,
      activityLogs,
      logActivity,
      askedQuestionIds,
      recordAskedQuestions,
      forceRolloverNextDay,
      syncActivePhaseAgenda,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebarCollapse,
      searchQuery,
      setSearchQuery,
      simulatedLoading,
      simulatedError,
      simulatedEmpty,
      setSimulatedError,
      setSimulatedEmpty,
      triggerStateSimulation
    }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
