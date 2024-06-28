import {create} from 'zustand';

interface UserState {
  userId: string | null;
  setUserId: (id: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (id: string) => set({ userId: id }),
}));

export default useUserStore;