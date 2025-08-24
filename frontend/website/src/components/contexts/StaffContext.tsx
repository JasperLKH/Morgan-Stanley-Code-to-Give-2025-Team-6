import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// State types
interface StaffState {
  user: {
    id: string;
    name: string;
    role: string;
    username: string;
  };
}

// Actions
type StaffAction =
  | { type: 'SET_USER'; payload: { id: string; name: string; role: string; username?: string } };

// Context
interface StaffContextType {
  state: StaffState;
  dispatch: React.Dispatch<StaffAction>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

// Reducer
function staffReducer(state: StaffState, action: StaffAction): StaffState {
  switch (action.type) {
    case 'SET_USER':
      console.log('StaffContext reducer - Setting user to:', action.payload);
      return { 
        ...state, 
        user: {
          id: action.payload.id,
          name: action.payload.name,
          role: action.payload.role,
          username: action.payload.username || `staff_${action.payload.name.toLowerCase().replace(' ', '_')}`
        }
      };
    default:
      return state;
  }
}

// Initial state
const initialState: StaffState = {
  user: {
    id: '3',
    name: 'David Lee',
    role: 'staff',
    username: 'staff1',
  },
};

// Provider component
interface StaffProviderProps {
  children: ReactNode;
  user?: { id: string; name: string; role: string; username?: string };
}

export function StaffProvider({ children, user }: StaffProviderProps) {
  const [state, dispatch] = useReducer(staffReducer, initialState);

  // Update user when prop changes
  React.useEffect(() => {
    if (user) {
      console.log('StaffContext - Setting user:', user);
      dispatch({
        type: 'SET_USER',
        payload: {
          id: user.id,
          name: user.name,
          role: user.role,
          username: user.username
        }
      });
    }
  }, [user]);

  return (
    <StaffContext.Provider value={{ state, dispatch }}>
      {children}
    </StaffContext.Provider>
  );
}

// Hook to use context
export function useStaffContext() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaffContext must be used within a StaffProvider');
  }
  return context;
}

export type { StaffState };
