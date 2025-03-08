import message from 'antd/lib/message';

import { AUTHORIZATION, FETCH_URL, HTTP_CODE } from '../constants';

export interface ApiResponse {
  code: number;
  message: string;
  data?: any;
  [key: string]: any;
}

interface FetchCustom {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data: object;
  path: string;
  timeout?: number;
}
export async function fetchFunc<T>(params: FetchCustom) {
  const { data, method, path, timeout = 5000 } = params;
  const isGet = params.method === 'get';

  const opts: RequestInit = {
    method,
    mode: 'cors',
  };

  opts.headers = {};

  const authStr = localStorage.getItem(AUTHORIZATION);
  if (authStr) {
    opts.headers[AUTHORIZATION] = authStr;
  }
  
  if (!isGet) {
    opts.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    opts.credentials = 'include';
    opts.body = JSON.stringify(data);
  }

  let query = '';

  if (isGet) {
    const kvList = Object.entries(data);
    for (let i = 0; i < kvList.length; i++) {
      const [key, val] = kvList[i];

      query += `${i === 0 ? '' : '&'}${key}=${val}`;
    }
  }

  const url = `${FETCH_URL}${path}${isGet ? `?${query}` : ''}`;

  return new Promise<T | undefined>((resolve) => {
    fetch(url, opts)
      .then(res => res.json())
      .then((res: ApiResponse) => {
        const { code, message: msg } = res;
        if (code !== 0) {
          if (code === HTTP_CODE.Unauthorized) {
            message.error('未授权，请先登录账号');
            if (window) {
              window.open('/login', '_self');
            }
          } else {
            message.error(msg);
          }

          resolve(undefined);
        }
        resolve(res.data);
      })
      .catch(err => {
        message.error(`${err}`);
        console.error(err.toString());
        resolve(undefined);
      });
  });
};
