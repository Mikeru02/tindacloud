import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';

export interface Merchant {
  id: number;
  store_name: string;
  store_type: string;
  role: string;
  status: string;
}

interface StoreState {
  currentStore: Merchant | null;
  stores: Merchant[];
  isLoading: boolean;
  loadStores: () => Promise<void>;
  selectStore: (store: Merchant) => void;
  createStore: (store: Merchant) => void;
  refreshStores: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentStore: null,
      stores: [],
      isLoading: false,

      loadStores: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get('/merchants/my');
          const stores: Merchant[] = response.data;
          
          // Filter to only show active merchant memberships
          const activeStores = stores.filter(store => store.status === 'active');
          
          const currentStore = get().currentStore;
          
          // Restore previously selected store or select first available (from active stores only)
          const foundStore = currentStore ? activeStores.find(s => s.id === currentStore.id) : null;
          const restoredStore = foundStore || activeStores[0] || null;

          set({ 
            stores: activeStores, 
            currentStore: restoredStore,
            isLoading: false 
          });
        } catch (error) {
          console.error('Error loading stores:', error);
          set({ isLoading: false });
        }
      },

      selectStore: (store: Merchant) => {
        set({ currentStore: store });
      },

      createStore: (store: Merchant) => {
        const { stores } = get();
        set({ 
          stores: [...stores, store],
          currentStore: store 
        });
      },

      refreshStores: async () => {
        await get().loadStores();
      },
    }),
    {
      name: 'merchant-storage',
      partialize: (state) => ({ 
        currentStore: state.currentStore,
        stores: state.stores 
      }),
    }
  )
);
