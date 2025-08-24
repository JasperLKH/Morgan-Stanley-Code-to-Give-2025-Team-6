import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface TeacherState {
  user: User | null;
}

type TeacherAction = 
  | { type: 'SET_USER'; payload: User };

const initialState: TeacherState = {
  user: null,
};

const teacherReducer = (state: TeacherState, action: TeacherAction): TeacherState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const TeacherContext = createContext<{
  state: TeacherState;
  dispatch: React.Dispatch<TeacherAction>;
} | null>(null);

interface TeacherProviderProps {
  children: React.ReactNode;
  user?: User;
}

export function TeacherProvider({ children, user }: TeacherProviderProps) {
  const [state, dispatch] = useReducer(teacherReducer, initialState);

  useEffect(() => {
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
      console.log('TeacherContext - User set:', user.id);
    }
  }, [user]);

  return (
    <TeacherContext.Provider value={{ state, dispatch }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacherContext must be used within a TeacherProvider');
  }
  return context;
}
