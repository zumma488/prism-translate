import { useEffect, useRef } from 'react';

/**
 * A hook to intercept the mobile browser back button using the History API.
 * When `active` is true, it pushes a new history entry. Pressing the back
 * button on mobile will trigger the `onBack` callback instead of navigating
 * away from the page.
 *
 * @param active - Whether the back button interception is active
 * @param onBack - Callback to invoke when back button is pressed
 * @param key - A unique key to distinguish different layers (e.g., 'settings', 'settings-connect')
 */
export function useBackButton(active: boolean, onBack: () => void, key: string) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!active) return;

    // Push a state entry so back button has something to pop
    const stateKey = `back-button-${key}`;
    window.history.pushState({ [stateKey]: true }, '');

    const handlePopState = (event: PopStateEvent) => {
      // Check if this popstate event is relevant to our layer
      // When user hits back, the state we pushed gets popped
      // We call onBack to handle it (close modal, go to prev view, etc.)
      onBackRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Clean up: if the component unmounts while active, we need to remove
      // the history entry we pushed. We do this by going back if the current
      // state contains our key.
      if (window.history.state?.[stateKey]) {
        window.history.back();
      }
    };
  }, [active, key]);
}
