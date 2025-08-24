import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Language types
export type Language = 'en' | 'zh';

// State types
interface ParentState {
  language: Language;
  user: {
    id: string;
    name: string;
    childName: string;
    kindergarten: string;
  };
  dashboard: {
    completedTasksToday: number;
    currentStreak: number;
    totalPoints: number;
    todaysTasks: Task[];
  };
  assignments: Assignment[];
  leaderboard: {
    topParents: LeaderboardEntry[];
    topKindergartens: KindergartenRanking[];
  };
}

interface Task {
  id: string;
  title: string;
  titleZh: string;
  type: 'reading' | 'math' | 'writing' | 'art';
  completed: boolean;
  points: number;
  dueDate: string;
}

interface Assignment {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  type: 'reading' | 'math' | 'writing' | 'art';
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  files?: FileUpload[];
  grade?: number;
  feedback?: string;
}

interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
}

interface LeaderboardEntry {
  id: string;
  parentName: string;
  childName: string;
  points: number;
  kindergarten: string;
  rank: number;
}

interface KindergartenRanking {
  id: string;
  name: string;
  nameZh: string;
  totalPoints: number;
  participantCount: number;
  rank: number;
}

// Actions
type ParentAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_DASHBOARD'; payload: Partial<ParentState['dashboard']> }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'UPDATE_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'UPDATE_LEADERBOARD'; payload: ParentState['leaderboard'] };

// Context
interface ParentContextType {
  state: ParentState;
  dispatch: React.Dispatch<ParentAction>;
  t: (key: string, fallback?: string) => string;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Dashboard
    'dashboard.welcome': 'Good morning',
    'dashboard.todaysTasks': "Today's Tasks",
    'dashboard.totalPoints': 'Total Points',
    'dashboard.currentStreak': 'Day Streak',
    'dashboard.completedToday': 'Completed Today',
    'dashboard.helpChild': "Let's help",
    'dashboard.learnGrow': 'learn and grow today',
    'dashboard.todaysProgress': "Today's Progress",
    'dashboard.keepGoing': "Keep going! You're doing great!",
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.urgentTasks': 'Urgent Tasks',
    'dashboard.thisWeek': 'This Week Summary',
    'dashboard.tasksCompleted': 'Tasks Completed',
    'dashboard.accuracy': 'Accuracy',
    'dashboard.ranking': 'Ranking',
    
    // Navigation
    'nav.home': 'Home',
    'nav.assignments': 'Assignments',
    'nav.chat': 'Chat',
    'nav.tasks': 'Tasks',
    'nav.progress': 'Progress',
    'nav.community': 'Community',
    'nav.rewards': 'Rewards',
    'nav.submitAssignment': 'Submit Assignment',
    'nav.chatWithReach': 'Chat with REACH',
    'nav.tasksList': 'Tasks List',
    'nav.progressView': 'Progress View',
    'nav.communityForum': 'Community Forum',
    
    // File Upload
    'upload.selectFiles': 'Select Files',
    'upload.dragDrop': 'Drag and drop files here',
    'upload.supportedFormats': 'Supported formats: Images, PDF, Word, Video',
    'upload.maxSize': 'Max file size: 10MB',
    'upload.attachFiles': 'Attach Files',
    'upload.or': 'or',
    'upload.takePhoto': 'Take Photo',
    'upload.attachedFiles': 'Attached Files',
    'upload.uploading': 'Uploading...',
    'upload.uploaded': 'Uploaded',
    'upload.processing': 'Processing files...',
    'upload.errorSize': 'File size exceeds limit',
    'upload.errorType': 'File type not supported',
    'upload.errorMaxFiles': 'Too many files',
    'upload.previewNotAvailable': 'Preview not available for this file type',
    'upload.fileSize': 'Size',
    'upload.fileType': 'Type',
    
    // Chat & Forms
    'chat.online': 'Online',
    'chat.typeMessage': 'Type a message...',
    'form.submitted': 'Form Submitted',
    'form.thankYou': 'Thank you for your feedback!',
    'form.missingRequired': 'Please fill in all required fields',
    'form.submit': 'Submit',
    'form.submitting': 'Submitting...',
    
    // Leaderboard
    'leaderboard.title': 'Leaderboard',
    'leaderboard.week': 'Week',
    'leaderboard.month': 'Month',
    'leaderboard.all': 'All Time',
    'leaderboard.topParents': 'Top Parents',
    'leaderboard.topKindergartens': 'Top Schools',
    'leaderboard.topSchools': 'Top Performing Schools',
    'leaderboard.yourRank': 'Your Current Rank',
    'leaderboard.you': 'You',
    'leaderboard.yourSchool': 'Your School',
    'leaderboard.points': 'points',
    'leaderboard.totalPoints': 'total points',
    'leaderboard.participants': 'participants',
    'leaderboard.avgPoints': 'Avg',
    'leaderboard.topThree': 'Top 3!',
    'leaderboard.keepGoing': 'Keep going!',
    'leaderboard.pointsToFirst': 'to #1',
    'leaderboard.thisWeekTop': "This Week's Top Parents",
    'leaderboard.updatesDaily': 'Updates daily',
    'leaderboard.weeklyChampion': 'Weekly Champion',
    'leaderboard.leads': 'leads with',
    'leaderboard.thisWeek': 'This week',
    'leaderboard.schoolPride': 'School Spirit!',
    'leaderboard.yourSchoolRank': 'Your school',
    'leaderboard.rankPosition': 'is ranked',
    'leaderboard.champion': 'Champion!',
    
    // Assignments
    'assignments.title': 'Assignments',
    'assignments.learningTasks': "'s learning tasks",
    'assignments.weekProgress': "This Week's Progress",
    'assignments.completedTasks': 'Completed Tasks',
    'assignments.of': 'of',
    'assignments.taskRemaining': 'task remaining',
    'assignments.pointsEarned': 'points earned',
    'assignments.pending': 'Pending',
    'assignments.submitted': 'Submitted',
    'assignments.graded': 'Graded',
    'assignments.due': 'Due',
    'assignments.points': 'points',
    'assignments.takePhoto': 'Take Photo',
    'assignments.uploadFile': 'Upload File',
    'assignments.waitingFeedback': 'Waiting for REACH teacher feedback',
    'status.pending': 'Pending',
    'status.submitted': 'Submitted',
    'status.graded': 'Graded',
    'status.unknown': 'Unknown',
    
    // Performance
    'performance.title': 'Progress Report',
    'performance.learningJourney': "'s learning journey",
    'performance.averageScore': 'Average Score',
    'performance.starsThisWeek': 'Stars This Week',
    'performance.learningProgress': 'Learning Progress',
    'performance.math': 'Math',
    'performance.reading': 'Reading',
    'performance.art': 'Art',
    'performance.subjectPerformance': 'Subject Performance',
    'performance.target': 'Target',
    'performance.recentAchievements': 'Recent Achievements',
    'performance.weeklySummary': "This Week's Summary",
    'performance.assignmentsDone': 'Assignments Done',
    'performance.dayStreak': 'Day Streak',
    'performance.excellentProgress': 'Excellent progress this week!',
    'performance.greatImprovement': 'is showing great improvement in all subjects.',
    
    // Community
    'community.title': 'Community',
    'community.subtitle': 'Connect with other REACH families',
    'community.families': 'families',
    'community.postPlaceholder': "Share your thoughts, questions, or celebrate your child's progress...",
    'community.photo': 'Photo',
    'community.video': 'Video',
    'community.post': 'Post',
    'community.reachOfficial': 'REACH Official',
    'community.videoLabel': 'Video: Phonics Fundamentals',
    'community.workshopLabel': 'Workshop Registration',
    'community.share': 'Share',
    'community.loadMore': 'Load More Posts',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    
    // Quick Actions
    'quickActions.pronunciation': 'Pronunciation Practice',
    'quickActions.assignments': 'Assignments Submission',
    'quickActions.chat': 'Chat with REACH Support',
    'quickActions.progress': 'Child Progress',
    'quickActions.rewards': 'Redeem Rewards',
    'quickActions.community': 'Community Forum',
    'quickActions.pronunciationDesc': 'Practice speaking and improve pronunciation',
    'quickActions.assignmentsDesc': 'Submit homework and track progress',
    'quickActions.chatDesc': 'Get help and support from teachers',
    'quickActions.progressDesc': 'View learning progress and achievements',
    'quickActions.rewardsDesc': 'Redeem points for exciting rewards',
    'quickActions.communityDesc': 'Connect with other REACH families',
  },
  zh: {
    // Dashboard
    'dashboard.welcome': '早上好',
    'dashboard.todaysTasks': '今日任務',
    'dashboard.totalPoints': '總積分',
    'dashboard.currentStreak': '連續天數',
    'dashboard.completedToday': '今日完成',
    'dashboard.helpChild': '讓我們幫助',
    'dashboard.learnGrow': '今天學習和成長',
    'dashboard.todaysProgress': '今日進度',
    'dashboard.keepGoing': '繼續努力！你做得很好！',
    'dashboard.quickActions': '快速操作',
    'dashboard.urgentTasks': '緊急任務',
    'dashboard.thisWeek': '本週總結',
    'dashboard.tasksCompleted': '任務完成',
    'dashboard.accuracy': '準確率',
    'dashboard.ranking': '排名',
    
    // Navigation
    'nav.home': '首頁',
    'nav.assignments': '作業',
    'nav.chat': '聊天',
    'nav.tasks': '任務',
    'nav.progress': '進度',
    'nav.community': '社區',
    'nav.rewards': '獎勵',
    'nav.submitAssignment': '提交作業',
    'nav.chatWithReach': '與REACH聊天',
    'nav.tasksList': '任務列表',
    'nav.progressView': '進度查看',
    'nav.communityForum': '社區論壇',
    
    // File Upload
    'upload.selectFiles': '選擇文件',
    'upload.dragDrop': '拖放文件到此處',
    'upload.supportedFormats': '支援格式：圖片、PDF、Word、視頻',
    'upload.maxSize': '最大文件大小：10MB',
    'upload.attachFiles': '附加文件',
    'upload.or': '或',
    'upload.takePhoto': '拍照',
    'upload.attachedFiles': '附件',
    'upload.uploading': '上傳中...',
    'upload.uploaded': '已上傳',
    'upload.processing': '處理文件中...',
    'upload.errorSize': '文件大小超出限制',
    'upload.errorType': '不支援的文件類型',
    'upload.errorMaxFiles': '文件數量過多',
    'upload.previewNotAvailable': '此文件類型無法預覽',
    'upload.fileSize': '大小',
    'upload.fileType': '類型',
    
    // Chat & Forms
    'chat.online': '在線',
    'chat.typeMessage': '輸入消息...',
    'form.submitted': '表格已提交',
    'form.thankYou': '感謝您的反饋！',
    'form.missingRequired': '請填寫所有必填項',
    'form.submit': '提交',
    'form.submitting': '提交中...',
    
    // Leaderboard
    'leaderboard.title': '排行榜',
    'leaderboard.week': '週',
    'leaderboard.month': '月',
    'leaderboard.all': '全部',
    'leaderboard.topParents': '最佳家長',
    'leaderboard.topKindergartens': '最佳學校',
    'leaderboard.topSchools': '頂級學校',
    'leaderboard.yourRank': '您的當前排名',
    'leaderboard.you': '您',
    'leaderboard.yourSchool': '您的學校',
    'leaderboard.points': '積分',
    'leaderboard.totalPoints': '總積分',
    'leaderboard.participants': '參與者',
    'leaderboard.avgPoints': '平均',
    'leaderboard.topThree': '前三名！',
    'leaderboard.keepGoing': '繼續加油！',
    'leaderboard.pointsToFirst': '到第一名',
    'leaderboard.thisWeekTop': '本週最佳家長',
    'leaderboard.updatesDaily': '每日更新',
    'leaderboard.weeklyChampion': '週冠軍',
    'leaderboard.leads': '領先',
    'leaderboard.thisWeek': '本週',
    'leaderboard.schoolPride': '學校榮譽！',
    'leaderboard.yourSchoolRank': '您的學校',
    'leaderboard.rankPosition': '排名',
    'leaderboard.champion': '冠軍！',
    
    // Assignments
    'assignments.title': '作業',
    'assignments.learningTasks': '的學習任務',
    'assignments.weekProgress': '本週進度',
    'assignments.completedTasks': '已完成任務',
    'assignments.of': '共',
    'assignments.taskRemaining': '項任務剩餘',
    'assignments.pointsEarned': '積分已獲得',
    'assignments.pending': '待完成',
    'assignments.submitted': '已提交',
    'assignments.graded': '已評分',
    'assignments.due': '到期',
    'assignments.points': '積分',
    'assignments.takePhoto': '拍照',
    'assignments.uploadFile': '上傳文件',
    'assignments.waitingFeedback': '等待REACH老師反饋',
    'status.pending': '待完成',
    'status.submitted': '已提交',
    'status.graded': '已評分',
    'status.unknown': '未知',
    
    // Performance
    'performance.title': '進度報告',
    'performance.learningJourney': '的學習歷程',
    'performance.averageScore': '平均分數',
    'performance.starsThisWeek': '本週星星數',
    'performance.learningProgress': '學習進度',
    'performance.math': '數學',
    'performance.reading': '閱讀',
    'performance.art': '藝術',
    'performance.subjectPerformance': '科目表現',
    'performance.target': '目標',
    'performance.recentAchievements': '最近成就',
    'performance.weeklySummary': '本週總結',
    'performance.assignmentsDone': '已完成作業',
    'performance.dayStreak': '連續天數',
    'performance.excellentProgress': '本週進步優秀！',
    'performance.greatImprovement': '在所有科目都表現出很大的進步。',
    
    // Community
    'community.title': '社區',
    'community.subtitle': '與其他REACH家庭聯繫',
    'community.families': '家庭',
    'community.postPlaceholder': '分享您的想法、問題或慶祝孩子的進步...',
    'community.photo': '照片',
    'community.video': '視頻',
    'community.post': '發布',
    'community.reachOfficial': 'REACH官方',
    'community.videoLabel': '視頻：語音基礎',
    'community.workshopLabel': '工作坊註冊',
    'community.share': '分享',
    'community.loadMore': '載入更多貼文',
    
    // Common
    'common.loading': '載入中...',
    'common.error': '發生錯誤',
    'common.submit': '提交',
    'common.cancel': '取消',
    'common.back': '返回',
    
    // Quick Actions
    'quickActions.pronunciation': '發音練習',
    'quickActions.assignments': '作業提交',
    'quickActions.chat': '與REACH支援聊天',
    'quickActions.progress': '孩子進度',
    'quickActions.rewards': '兌換獎勵',
    'quickActions.community': '社區論壇',
    'quickActions.pronunciationDesc': '練習說話和提高發音',
    'quickActions.assignmentsDesc': '提交作業和跟蹤進度',
    'quickActions.chatDesc': '獲得老師的幫助和支援',
    'quickActions.progressDesc': '查看學習進度和成就',
    'quickActions.rewardsDesc': '用積分兌換精彩獎勵',
    'quickActions.communityDesc': '與其他REACH家庭聯繫',
  },
};

// Reducer
function parentReducer(state: ParentState, action: ParentAction): ParentState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'UPDATE_DASHBOARD':
      return { ...state, dashboard: { ...state.dashboard, ...action.payload } };
    case 'COMPLETE_TASK':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          todaysTasks: state.dashboard.todaysTasks.map(task =>
            task.id === action.payload ? { ...task, completed: true } : task
          ),
          completedTasksToday: state.dashboard.completedTasksToday + 1,
        },
      };
    case 'UPDATE_ASSIGNMENTS':
      return { ...state, assignments: action.payload };
    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    default:
      return state;
  }
}

// Sample today's tasks
const sampleTodaysTasks: Task[] = [
  {
    id: '1',
    title: 'Read "The Little Red Hen"',
    titleZh: '閱讀《小紅母雞》',
    type: 'reading',
    completed: true,
    points: 10,
    dueDate: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Count to 20 practice',
    titleZh: '數到20練習',
    type: 'math',
    completed: true,
    points: 15,
    dueDate: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Draw your family',
    titleZh: '畫你的家庭',
    type: 'art',
    completed: false,
    points: 20,
    dueDate: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Practice writing letter "A"',
    titleZh: '練習寫字母"A"',
    type: 'writing',
    completed: false,
    points: 12,
    dueDate: new Date().toISOString(),
  },
];

// Initial state
const initialState: ParentState = {
  language: 'en',
  user: {
    id: '1',
    name: 'Sarah Chen',
    childName: 'Emma Chen',
    kindergarten: 'Sunshine Kindergarten',
  },
  dashboard: {
    completedTasksToday: 2,
    currentStreak: 5,
    totalPoints: 185,
    todaysTasks: sampleTodaysTasks,
  },
  assignments: [],
  leaderboard: {
    topParents: [],
    topKindergartens: [],
  },
};

// Provider component
interface ParentProviderProps {
  children: ReactNode;
}

export function ParentProvider({ children }: ParentProviderProps) {
  const [state, dispatch] = useReducer(parentReducer, initialState);

  const t = (key: string, fallback?: string): string => {
    const translation = translations[state.language][key];
    return translation || fallback || key;
  };

  return (
    <ParentContext.Provider value={{ state, dispatch, t }}>
      {children}
    </ParentContext.Provider>
  );
}

// Hook to use context
export function useUser() {
  const context = useContext(ParentContext);
  if (context === undefined) {
    throw new Error('useParentContext must be used within a ParentProvider');
  }
  return context;
}

export type { ParentState, Task, Assignment, FileUpload, LeaderboardEntry, KindergartenRanking };