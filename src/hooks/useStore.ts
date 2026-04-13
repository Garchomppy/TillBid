import { useSyncExternalStore } from 'react';
import { store } from '../services/storeService';

export function useStore() {
    return useSyncExternalStore(store.subscribe, store.getState);
}
