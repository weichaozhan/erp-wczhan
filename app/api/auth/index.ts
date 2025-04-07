import { fetchFunc } from '@/app/global/fetch';
import { GetAuthListApiData } from '@/app/types/auth';

export const getAuthListApi = () => {
  return fetchFunc<GetAuthListApiData>({
    method: 'get',
    path: '/system_modules',
  })
    .then(data => {
      return data;
    });
};
