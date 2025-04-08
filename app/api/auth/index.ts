import { fetchFunc } from '@/app/global/fetch';
import { CreatePermission, GetAuthListApiData } from '@/app/types/auth';
import { Permission } from '@/app/types/entity';

export const getAuthListApi = () => {
  return fetchFunc<GetAuthListApiData>({
    method: 'get',
    path: '/system_modules',
  })
    .then(data => {
      return data;
    });
};

export const createPermissionApi = (body: CreatePermission) => {
  return fetchFunc<Permission>({
    method: 'post',
    path: '/permission',
    data: body,
  })
    .then(data => {
      return data;
    });
};

export const delPermissionApi = (id: Permission['id']) => {
  return fetchFunc({
    method: 'delete',
    path: `/permission/${id}`,
  })
    .then(data => {
      return data;
    });
};
