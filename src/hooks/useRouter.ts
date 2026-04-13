import { useSyncExternalStore } from 'react';
import { router } from '../router/routerService';

export function useRouter() {
    return useSyncExternalStore(router.subscribe, router.getView);
}
