import { create } from "zustand";

type State = {
  count: number;
  isNotesLoading: boolean;
  isNotesLoadedSuccess: boolean;
  increment: () => void;
  setNotesLoading: (loading: boolean) => void;
  setNotesLoadedSuccess: (success: boolean) => void;

  isDrawerOpen: boolean;
  setDrawerOpen: (state: boolean) => void;
};

export const useStore = create<State>((set) => ({
  count: 0,
  isNotesLoading: false,
  isNotesLoadedSuccess: false,
  setNotesLoading: (loading: boolean) => set({ isNotesLoading: loading }),
  setNotesLoadedSuccess: (success: boolean) =>
    set({ isNotesLoadedSuccess: success }),
  increment: () => set((state) => ({ count: state.count + 1 })),

  isDrawerOpen: false,
  setDrawerOpen: (state: boolean) => set({ isDrawerOpen: state }),
}));
