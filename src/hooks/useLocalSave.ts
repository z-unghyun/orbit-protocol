import { useSyncExternalStore } from 'react';
import { getSnapshot, subscribe, type LocalSave } from '../lib/local-save';

export function useLocalSave(): LocalSave {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
