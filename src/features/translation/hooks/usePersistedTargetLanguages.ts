import { useEffect, useState } from 'react';
import {
  loadPersistedTargetLanguages,
  persistTargetLanguages,
} from '../services/targetLanguagesPersistence';

export function usePersistedTargetLanguages() {
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [hasLoadedPersistedLanguages, setHasLoadedPersistedLanguages] =
    useState(false);

  useEffect(() => {
    setTargetLanguages(loadPersistedTargetLanguages());
    setHasLoadedPersistedLanguages(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPersistedLanguages) {
      return;
    }

    persistTargetLanguages(targetLanguages);
  }, [hasLoadedPersistedLanguages, targetLanguages]);

  return [
    targetLanguages,
    setTargetLanguages,
    hasLoadedPersistedLanguages,
  ] as const;
}
