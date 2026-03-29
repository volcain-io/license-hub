import { useSyncExternalStore, useCallback } from 'react';
import { subscribe, getProducts, getLicenses, getActivations } from '@/lib/store';

export function useStoreData() {
  const products = useSyncExternalStore(subscribe, getProducts, getProducts);
  const licenses = useSyncExternalStore(subscribe, getLicenses, getLicenses);
  const activations = useSyncExternalStore(subscribe, getActivations, getActivations);
  return { products, licenses, activations };
}
