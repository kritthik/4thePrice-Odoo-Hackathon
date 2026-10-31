# FlexPrice Component Guidelines

## Component Creation Process

### 1. Planning Phase

Before creating a component, consider:
- Is it reusable?
- What level should it be? (atom/molecule/organism)
- What props will it need?
- What state will it manage?

### 2. Component Structure

```typescript
// Import order
import React from 'react';
import external libraries...
import local components...
import types...
import styles...

// Props interface
interface Props {
  data: SomeType;
  onAction: (id: string) => void;
  children?: React.ReactNode;
}

// Component
export const MyComponent: React.FC<Props> = ({
  data,
  onAction,
  children
}) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleClick = () => {
    onAction(data.id);
  };
  
  // Render
  return (
    <div>
      {/* Implementation */}
    </div>
  );
};
```

### 3. Component Organization

```
ComponentName/
├── ComponentName.tsx     # Main component
├── ComponentName.test.ts # Tests
├── types.ts             # Type definitions
└── index.ts            # Export file
```

## Component Categories

### 1. Atoms

Basic building blocks:
```typescript
// Button.tsx
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => (
  <button 
    className={`btn btn-${variant}`} 
    {...props}
  >
    {children}
  </button>
);
```

### 2. Molecules

Combinations of atoms:
```typescript
// SearchBar.tsx
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch
}) => {
  const [value, setValue] = useState('');
  
  return (
    <div className="flex gap-2">
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={() => onSearch(value)}>
        Search
      </Button>
    </div>
  );
};
```

### 3. Organisms

Complex UI sections:
```typescript
// Header.tsx
export const Header: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <header>
      <Logo />
      <Navigation />
      <UserMenu user={user} />
    </header>
  );
};
```

## Best Practices

### 1. Props

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
}

// Bad
interface ButtonProps {
  color: string; // Too generic
  clickHandler: any; // Avoid 'any'
}
```

### 2. State Management

```typescript
// Local state
const [isOpen, setIsOpen] = useState(false);

// Derived state
const isValid = useMemo(() => {
  return data?.length > 0;
}, [data]);

// Complex state
const [state, dispatch] = useReducer(reducer, initialState);
```

### 3. Performance

```typescript
// Memoization
const MemoizedComponent = React.memo(MyComponent);

// Callback memoization
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Value memoization
const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### 4. Error Handling

```typescript
// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    // Handle error
  }
  
  render() {
    return this.props.children;
  }
}

// Try-catch in async operations
try {
  await api.request();
} catch (error) {
  handleError(error);
}
```

## Testing Guidelines

### 1. Component Tests

```typescript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests

```typescript
describe('SearchBar', () => {
  it('integrates with search functionality', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(screen.getByText('Search'));
    
    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
```

## Accessibility

```typescript
// Keyboard navigation
const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    onAction();
  }
};

// ARIA labels
<button
  aria-label="Close dialog"
  onClick={onClose}
>
  <Icon name="close" />
</button>

// Focus management
useEffect(() => {
  if (isOpen) {
    inputRef.current?.focus();
  }
}, [isOpen]);
```

Remember: These guidelines ensure consistency and maintainability across the project. Adapt them as needed while maintaining the core principles. 