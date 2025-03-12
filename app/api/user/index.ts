import { fetchFunc } from '@/app/global/fetch';

interface GetUsersApi {
  page: number;
  size: number;
}

export const getUsersApi = (body: GetUsersApi) => {
  return fetchFunc({
    method: 'get',
    data: body,
    path: '/user',
  })
    .then(data => {
      console.log(data);
      return data;
    });
};

export interface CreateUsersApi {
  username: string;
  email: string;
  password: string;
  code: string;
}
interface CreateUsersApiReturn {
  code: number;
  message: string;
}
export const createUsersApi = (body: CreateUsersApi) => {
  return fetchFunc<CreateUsersApiReturn>({
    method: 'post',
    data: body,
    path: '/user',
  })
    .then(data => {
      console.log(data);
      return data;
    });
};
