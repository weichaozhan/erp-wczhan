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
