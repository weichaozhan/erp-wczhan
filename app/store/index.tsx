import { create } from 'zustand'

import { GOODS } from '../global/constants/goods';

interface State {
  // 登陆态
  isLogin: boolean;
  goods: GOODS | undefined;
  setIsLogin: (goods: State['isLogin']) => void;
  setGoods: (goods: State['goods']) => void;
}

export const useStore = create<State>(set => ({
  isLogin: false,
  setIsLogin: (isLogin: State['isLogin']) => set(() => ({ isLogin })),
  goods: undefined,
  setGoods: (goods: State['goods']) => set(() => ({ goods })),
}));
