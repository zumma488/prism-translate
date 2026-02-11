import { useEffect, useRef } from 'react';

/**
 * A hook to intercept the mobile browser back button using the History API.
 * When `active` is true, it pushes a new history entry. Pressing the back
 * button on mobile will trigger the `onBack` callback.
 * 
 * If `onBack` returns true, it means the back action was "intercepted" (e.g., used for
 * internal navigation), and the hook will re-push the history entry to maintain the lock.
 * 
 * If `onBack` returns false (or void), it means the modal should close, and the history
 * entry is naturally consumed by the back action.
 *
 * @param active - Whether the back button interception is active
 * @param onBack - Callback to invoke when back button is pressed. Return true to intercept.
 * @param key - A unique key to distinguish different layers
 */
export function useBackButton(active: boolean, onBack: () => boolean | void, key: string) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!active) return;

    // Push a state entry so back button has something to pop
    // We add a random ID to ensure uniqueness if needed, though key is usually enough
    const stateKey = `back-button-${key}`;
    // Only push if we're not already in that state (to avoid loops if re-running)
    if (!window.history.state?.[stateKey]) {
        window.history.pushState({ [stateKey]: true }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      // The popstate happens AFTER the back navigation.
      // So the history entry we pushed is now GONE from the stack (it's forward now).
      
      const shouldIntercept = onBackRef.current();

      if (shouldIntercept) {
        // If intercepted (internal navigation), we must restore the history entry
        // so that the next back press can still be intercepted.
        window.history.pushState({ [stateKey]: true }, '');
      } 
      // Else: the modal is closing. The history entry is already gone, so we're good.
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Clean up: if the component unmounts (or active becomes false) 
      // BUT we are still in our state (meaning manual close, not back button),
      // we need to remove the history entry manually.
      if (window.history.state?.[stateKey]) {
        window.history.back();
      }
    };
  }, [active, key]); // Re-run only if active/key changes. Logic inside handles view changes via ref.
}

