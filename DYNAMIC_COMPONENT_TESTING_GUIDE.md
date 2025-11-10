# 🚀 Dynamic Component Testing Guide

## ❌ Masalah Umum Dynamic Component Testing

### 1. **Jest Module Hoisting Issues**

```typescript
// ❌ Dynamic import sulit di-mock
const DynamicComponent = dynamic(() => import('./Component'), {
  ssr: false,
});
```

### 2. **Async Loading Problems**

- Dynamic imports bersifat asynchronous
- Jest butuh menunggu component loading
- Race conditions antara mock dan actual import

### 3. **Next.js Specific Issues**

- SSR: false opsi membingungkan testing environment
- Webpack dynamic imports tidak tersedia di Node.js
- Next.js internals tidak compatible dengan Jest

---

## ✅ **Solutions & Best Practices**

### **Solution 1: Mock next/dynamic**

```typescript
// ✅ Mock next/dynamic dengan proper implementation
jest.mock('next/dynamic', () => {
  return jest.fn(() => {
    // Return mock component yang dapat di-test
    const MockComponent = () => (
      <div data-testid="dynamic-component">
        Mocked Dynamic Component
      </div>
    );
    MockComponent.displayName = 'MockDynamicComponent';
    return MockComponent;
  });
});
```

### **Solution 2: Mock Specific Dynamic Import**

```typescript
// ✅ Mock specific component yang di-import
jest.mock('@/components/HomePage', () => {
  return function MockHomePage(props: any) {
    return (
      <div data-testid="homepage-mock" {...props}>
        HomePage Component Loaded
      </div>
    );
  };
});
```

### **Solution 3: Test Actual Dynamic Component**

```typescript
import { render, screen, waitFor } from '@testing-library/react';

// ✅ Test dengan wait for dynamic loading
it('should load dynamic component', async () => {
  render(<ParentWithDynamicComponent />);

  // Wait for dynamic component to load
  await waitFor(
    () => {
      expect(screen.getByTestId('dynamic-content')).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
});
```

### **Solution 4: Extract Component for Direct Testing**

```typescript
// ✅ Test component langsung tanpa dynamic wrapper
// Instead of testing dynamic wrapper, test the actual component
import HomePage from '@/components/HomePage';

describe('HomePage Direct Test', () => {
  it('should render homepage correctly', () => {
    render(<HomePage />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```

---

## 🔧 **Implementation Examples**

### **Example 1: Complete Page Test with Dynamic Component**

```typescript
// src/app/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Homepage from '../page';

// Mock dynamic import
jest.mock('next/dynamic', () => {
  return jest.fn().mockImplementation(() => {
    const MockComponent = ({ ...props }) => (
      <div data-testid="homepage-component" {...props}>
        Dynamic Homepage Loaded
      </div>
    );
    return MockComponent;
  });
});

// Mock dependencies
jest.mock('@/presentation/hooks/useAuthCheck', () => ({
  useAuthCheck: jest.fn(() => ({
    isLoading: false,
    isAuthenticated: true,
    redirectToLogin: jest.fn(),
  })),
}));

describe('Homepage with Dynamic Component', () => {
  it('should render dynamic component when authenticated', async () => {
    render(<Homepage />);

    await waitFor(() => {
      expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    });
  });
});
```

### **Example 2: Mock with Loading States**

```typescript
jest.mock('next/dynamic', () => {
  return jest.fn().mockImplementation((importFunc, options) => {
    const MockComponent = ({ ...props }) => {
      if (options?.loading) {
        // Test loading component
        const LoadingComponent = options.loading;
        return <LoadingComponent />;
      }

      return (
        <div data-testid="loaded-component" {...props}>
          Component Loaded
        </div>
      );
    };

    MockComponent.displayName = 'MockDynamicComponent';
    return MockComponent;
  });
});
```

### **Example 3: Test Error Handling**

```typescript
// Test dynamic import failures
jest.mock('next/dynamic', () => {
  return jest.fn().mockImplementation((importFunc, options) => {
    const MockComponent = () => {
      if (options?.error) {
        const ErrorComponent = options.error;
        return <ErrorComponent error={new Error('Import failed')} />;
      }

      return <div>Default Component</div>;
    };

    return MockComponent;
  });
});
```

---

## 🎯 **Advanced Patterns**

### **Pattern 1: Conditional Dynamic Loading**

```typescript
// ✅ Test different loading conditions
const mockDynamic = jest.fn();
jest.mock('next/dynamic', () => mockDynamic);

describe('Conditional Loading', () => {
  it('should handle client-side only components', () => {
    mockDynamic.mockImplementation(() => {
      const Component = () => <div>Client Component</div>;
      return Component;
    });

    render(<PageWithDynamicComponent />);
    expect(screen.getByText('Client Component')).toBeInTheDocument();
  });
});
```

### **Pattern 2: Multiple Dynamic Components**

```typescript
// ✅ Handle multiple dynamic imports
jest.mock('next/dynamic', () => {
  return jest.fn().mockImplementation((importFunc) => {
    // Extract module path for conditional mocking
    const importPath = importFunc.toString();

    if (importPath.includes('HomePage')) {
      return () => <div data-testid="homepage">HomePage</div>;
    }

    if (importPath.includes('Dashboard')) {
      return () => <div data-testid="dashboard">Dashboard</div>;
    }

    return () => <div>Unknown Component</div>;
  });
});
```

### **Pattern 3: Real Dynamic Import Testing**

```typescript
// ✅ Test actual dynamic behavior (integration test)
import dynamic from 'next/dynamic';

// Don't mock dynamic for integration tests
describe('Real Dynamic Loading', () => {
  it('should actually load component dynamically', async () => {
    const RealDynamicComponent = dynamic(
      () => import('@/components/TestComponent'),
      { ssr: false }
    );

    render(<RealDynamicComponent />);

    // Wait longer for actual import
    await waitFor(
      () => {
        expect(screen.getByText('Real Component')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
```

---

## 📋 **Testing Checklist**

### ✅ **Mock Strategy**

- [ ] Mock `next/dynamic` with proper return
- [ ] Mock all component dependencies
- [ ] Handle loading states
- [ ] Handle error states

### ✅ **Test Cases**

- [ ] Component renders after loading
- [ ] Loading state displays correctly
- [ ] Error states are handled
- [ ] Props are passed correctly
- [ ] Authentication flows work
- [ ] Navigation works

### ✅ **Performance**

- [ ] Tests run quickly (< 5s)
- [ ] No actual network requests
- [ ] Proper cleanup after tests
- [ ] Mock implementations are efficient

---

## 🚨 **Common Pitfalls**

### ❌ **Avoid These Mistakes**

```typescript
// ❌ Don't mock like this - too simplistic
jest.mock('next/dynamic', () => jest.fn());

// ❌ Don't forget displayName
const MockComponent = () => <div>Mock</div>;
// Missing: MockComponent.displayName = 'MockComponent';

// ❌ Don't forget async testing
render(<DynamicComponent />);
expect(screen.getByText('Content')).toBeInTheDocument(); // May fail

// ❌ Don't test implementation details
expect(mockDynamic).toHaveBeenCalledWith(
  expect.any(Function),
  { ssr: false }
); // Too coupled to implementation
```

### ✅ **Best Practices**

```typescript
// ✅ Comprehensive mock
jest.mock('next/dynamic', () => {
  return jest.fn().mockImplementation(() => {
    const Component = (props: any) => (
      <div data-testid="mock-component" {...props}>
        Mocked Content
      </div>
    );
    Component.displayName = 'MockDynamicComponent';
    return Component;
  });
});

// ✅ Test behavior, not implementation
it('should display content when loaded', async () => {
  render(<ParentComponent />);

  await waitFor(() => {
    expect(screen.getByText('Expected Content')).toBeInTheDocument();
  });
});
```

---

## 🎯 **Summary**

**Dynamic component sulit di-test karena:**

1. Jest module hoisting conflicts
2. Async loading complexity
3. Next.js specific implementations
4. Webpack vs Node.js environment differences

**Solusi utama:**

1. **Mock next/dynamic** dengan implementation yang proper
2. **Test component langsung** tanpa dynamic wrapper
3. **Gunakan waitFor** untuk async operations
4. **Mock semua dependencies** dengan konsisten

**Best practice:**

- Mock dynamic pada level page/integration tests
- Test actual component pada unit tests
- Gunakan data-testid untuk reliable selection
- Test loading dan error states
- Keep tests fast dan reliable

Dengan approach ini, Anda bisa test dynamic components dengan confidence! 🚀
