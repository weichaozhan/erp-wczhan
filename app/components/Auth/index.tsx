"use client"
import { AUTHORIZATION } from '@/app/global/constants';
import { useStore } from '@/app/store';
import { App } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';


const Auth: FC = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();

  const prePathNameRef = useRef<string | undefined>(undefined);

  const setIsLogin = useStore(state => state.setIsLogin);

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

    console.log('pathname', pathname, 'prePathNameRef', prePathNameRef.current);
    return () => {
      prePathNameRef.current = pathname;
    }
  }, [pathname]);

  return <></>;
};

export default Auth;
