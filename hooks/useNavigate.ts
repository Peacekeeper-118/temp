// hooks/useNavigate.ts
/**
 * Simple navigation hook for the auth flow
 * In a real app, this would use React Router
 * For now, we return a function that will be configured at app level
 */

export const useNavigate = () => {
  return (path: string, options?: { replace?: boolean }) => {
    // This will be replaced by actual navigation logic in App.tsx
    // For now, just log
    console.log(`Navigate to: ${path}`, options);
  };
};
