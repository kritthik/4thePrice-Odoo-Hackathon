# State Management Guide

## Overview

This guide explains how state management is implemented in the FlexPrice frontend application. We use a combination of React Context and Zustand for efficient state management.

## State Management Architecture

### 1. Global State (Zustand)

We use Zustand for global state management. Here's how to implement it:

```typescript
// src/store/useStore.ts
import create from 'zustand';

interface AppState {
	user: User | null;
	setUser: (user: User | null) => void;
	theme: 'light' | 'dark';
	setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<AppState>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	theme: 'light',
	setTheme: (theme) => set({ theme }),
}));
```

### 2. Context API

For component-specific state that needs to be shared:

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## State Management Patterns

### 1. Local State

For component-specific state:

```typescript
// src/components/atoms/Button/Button.tsx
const Button = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setIsLoading(false);
    }
  };

  return <button disabled={isLoading}>Click me</button>;
};
```

### 2. Form State

Using React Hook Form for form state management:

```typescript
// src/components/molecules/Forms/LoginForm.tsx
import { useForm } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      <input {...register('password', { required: true })} />
      <button type="submit">Login</button>
    </form>
  );
};
```

## State Persistence

### 1. Local Storage

```typescript
// src/utils/storage.ts
export const storage = {
	get: (key: string) => {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	},

	set: (key: string, value: any) => {
		localStorage.setItem(key, JSON.stringify(value));
	},

	remove: (key: string) => {
		localStorage.removeItem(key);
	},
};
```

### 2. Zustand Persist

```typescript
// src/store/useStore.ts
import { persist } from 'zustand/middleware';

export const useStore = create(
	persist(
		(set) => ({
			// ... store configuration
		}),
		{
			name: 'app-storage',
		},
	),
);
```

## State Updates

### 1. Optimistic Updates

```typescript
// src/hooks/useOptimisticUpdate.ts
export const useOptimisticUpdate = () => {
	const updateStore = useStore((state) => state.updateData);

	const optimisticUpdate = async (newData: any) => {
		// Update UI immediately
		updateStore(newData);

		try {
			// Make API call
			await api.updateData(newData);
		} catch (error) {
			// Revert on error
			updateStore(previousData);
		}
	};

	return optimisticUpdate;
};
```

### 2. Batch Updates

```typescript
// src/utils/batchUpdate.ts
export const batchUpdate = (updates: Array<() => void>) => {
	ReactDOM.unstable_batchedUpdates(() => {
		updates.forEach((update) => update());
	});
};
```

## Performance Optimization

### 1. Selective Re-renders

```typescript
// src/components/atoms/Card/Card.tsx
const Card = memo(({ title, content }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
});
```

### 2. State Splitting

```typescript
// Split large state objects into smaller pieces
const useUserPreferences = create((set) => ({
	theme: 'light',
	setTheme: (theme) => set({ theme }),
}));

const useUserProfile = create((set) => ({
	name: '',
	email: '',
	setProfile: (profile) => set(profile),
}));
```

## Testing State Management

### 1. Store Testing

```typescript
// src/store/__tests__/useStore.test.ts
describe('useStore', () => {
	it('should update user state', () => {
		const { result } = renderHook(() => useStore());

		act(() => {
			result.current.setUser({ id: 1, name: 'Test' });
		});

		expect(result.current.user).toEqual({ id: 1, name: 'Test' });
	});
});
```

### 2. Context Testing

```typescript
// src/contexts/__tests__/AuthContext.test.tsx
describe('AuthContext', () => {
	it('should provide authentication state', () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		expect(result.current.isAuthenticated).toBe(false);
	});
});
```

## Best Practices

1. Keep state as local as possible
2. Use appropriate state management solutions
3. Implement proper error handling
4. Consider performance implications
5. Write tests for state management
6. Document state structure
7. Use TypeScript for type safety
8. Implement proper state persistence
9. Handle loading and error states
10. Use proper state update patterns
