import { fetchFunc } from '@/app/global/fetch';
import { GetUsersReturn, PaginationDto } from '@/app/types/auth';

export const getUsersApi = (body: PaginationDto) => {
  return fetchFunc<GetUsersReturn>({
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
export const createUsersApi = (body: CreateUsersApi) => {
  return fetchFunc({
    method: 'post',
    data: body,
    path: '/user',
  })
    .then(data => {
      console.log(data);
      return data;
    });
};
