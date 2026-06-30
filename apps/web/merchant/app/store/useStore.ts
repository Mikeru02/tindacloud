import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';

export interface Merchant {
  id: number;
  store_name: string;
  store_type: string;
  role: string;
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
          
          // Restore previously selected store or select first available
          const currentStore = get().currentStore;
          const restoredStore = currentStore 
            ? stores.find(s => s.id === currentStore.id) 
            : stores[0];

          set({ 
            stores, 
            currentStore: restoredStore || stores[0] || null,
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
