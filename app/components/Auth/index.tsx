"use client"
import { getMenusApi } from '@/app/api';
import { AUTHORIZATION, COMMON_PATHS } from '@/app/global/constants';
import { useStore } from '@/app/store';
import { App } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { once } from 'lodash';
import { isBrowserEnv } from '@/app/global/tools';


const Auth: FC = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();

  const isBrowser  = isBrowserEnv();

  const prePathNameRef = useRef<string | undefined>(undefined);

  const { setIsLogin, isLogin, setMenus, menus } = useStore(state => state);

  const [isAfterGetManu, setIsAfterGetManu] = useState(false);

  const userPaths = useMemo(() => {
    const paths = [...COMMON_PATHS];
    menus?.forEach(menu => {
      const { path } = menu;
      if (path) {
        paths.push(path);
      }
    });
    return paths;
  }, [menus]);

  // get menu data, excute once
  const handleMenus = useCallback(once(() => {
    if (isBrowser && isLogin && !isAfterGetManu) {
      getMenusApi()
        .then(data => {
          console.log('getMenusApi', data);
          setMenus(data ?? []);
        })
        .finally(() => {
          setIsAfterGetManu(true);
        });
    }
  }), [isLogin, isAfterGetManu, isBrowser]);

  useEffect(() => {
    handleMenus();
  }, [isLogin]);

  useEffect(() => {
    console.log('isBrowser && isAfterGetManuRef.current', isBrowser, isAfterGetManu)
    if (isBrowser && isAfterGetManu) {
      console.log('userPaths', userPaths, 'pathname', pathname);
      if (!userPaths.includes(pathname)) {
        router.push('/forbidden');
      }
    }
  }, [userPaths, pathname, isAfterGetManu]);

  useEffect(() => {
    const authStr = localStorage.getItem(AUTHORIZATION);

    if (authStr) {
      setIsLogin(true);
    } else {
      if (pathname !== '/login') {
        const urlStr = `${location.href.replace(location.origin, '')}`;
        const urlStrEncode = urlStr ? encodeURIComponent(urlStr) : '';
        
        if (prePathNameRef.current !== undefined) {
          message.error('未授权，请先登录！');
        }
        router.push(`/login${urlStr ? `?url=${urlStrEncode}` : ''}`);
      }
    }

    // console.log('pathname', pathname, 'prePathNameRef', prePathNameRef.current);
    return () => {
      prePathNameRef.current = pathname;
    }
  }, [pathname]);

  return <></>;
};

export default Auth;
