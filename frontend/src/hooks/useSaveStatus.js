import { useState, useEffect, useRef } from "react";

/**
 * Manages save button visual state: null | 'success' | 'error'
 * Auto-reverts after successDelay (1s) or errorDelay (3s).
 * Cleans up timers on unmount.
 */
export function useSaveStatus({ successDelay = 1000, errorDelay = 3000 } = {}) {
  const [saveStatus, setSaveStatus] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerSuccess = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("success");
    timerRef.current = setTimeout(() => setSaveStatus(null), successDelay);
  };

  const triggerError = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("error");
    timerRef.current = setTimeout(() => setSaveStatus(null), errorDelay);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus(null);
  };

  return { saveStatus, triggerSuccess, triggerError, reset };
}
