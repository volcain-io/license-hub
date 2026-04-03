import { useSyncExternalStore } from 'react';
import { subscribe, getProducts, getLicenses, getGrants, getActivations, getResponseLogs, getHistoryLogs } from '@/lib/store';

export function useStoreData() {
  const products = useSyncExternalStore(subscribe, getProducts, getProducts);
  const licenses = useSyncExternalStore(subscribe, getLicenses, getLicenses);
  const grants = useSyncExternalStore(subscribe, getGrants, getGrants);
  const activations = useSyncExternalStore(subscribe, getActivations, getActivations);
  const responseLogs = useSyncExternalStore(subscribe, getResponseLogs, getResponseLogs);
  const historyLogs = useSyncExternalStore(subscribe, getHistoryLogs, getHistoryLogs);
  return { products, licenses, grants, activations, responseLogs, historyLogs };
}
