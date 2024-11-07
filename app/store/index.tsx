import { create } from 'zustand'

import { GOODS } from '../constants/goods';

interface State {
  goods: GOODS | undefined;
  setGoods: (goods: State['goods']) => void;
}

export const useStore = create<State>(set => ({
  goods: undefined,
  setGoods: (goods: State['goods']) => set(() => ({ goods })),
}));
