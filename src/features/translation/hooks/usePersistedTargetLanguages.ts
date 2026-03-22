import { useEffect, useState } from 'react';
import {
  loadPersistedTargetLanguages,
  persistTargetLanguages,
} from '../services/targetLanguagesPersistence';

export function usePersistedTargetLanguages() {
  const [targetLanguages, setTargetLanguages] = useState<string[]>(() => loadPersistedTargetLanguages());

  useEffect(() => {
    persistTargetLanguages(targetLanguages);
  }, [targetLanguages]);

  return [targetLanguages, setTargetLanguages] as const;
}
