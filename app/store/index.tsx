import { create } from 'zustand'

import { GOODS } from '../global/constants/goods';
import { SysModule } from '../types/entity';
import { GetMenusApiData } from '../types';
import { AUTHORIZATION } from '../global/constants';

interface State {
  // 登陆态
  isLogin: boolean;
  goods: GOODS | undefined;
  setIsLogin: (goods: State['isLogin']) => void;
  setGoods: (goods: State['goods']) => void;

  menus: GetMenusApiData;
  setMenus: (menus: State['menus']) => void;
}
// useSyncExternalStore
export const useStore = create<State>(set => ({
  isLogin: typeof window !== 'undefined' ? !!localStorage.getItem(AUTHORIZATION) : false,
  setIsLogin: (isLogin: State['isLogin']) => set(() => ({ isLogin })),
  
  goods: undefined,
  setGoods: (goods: State['goods']) => set(() => ({ goods })),

  menus: [],
  setMenus: (menus: State['menus']) => set(() => ({ menus }  )),
}));
