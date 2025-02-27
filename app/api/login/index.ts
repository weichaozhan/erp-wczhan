import { fetchFunc } from '@/app/global/fetch';

export interface LoginApi {
  username: string;
  password: string;
}

interface LoginData {
  type: string;
  accessToken: string;
}

export const loginApi = (body: LoginApi) => {
  return fetchFunc<LoginData>({
    method: 'post',
    data: body,
    path: '/auth/login',
  })
    .then((data) => {
      return data;
    });
};
