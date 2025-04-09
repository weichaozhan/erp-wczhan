import { fetchFunc } from '@/app/global/fetch';
import { CreatePermission, CreateSysModule, GetAuthListApiData } from '@/app/types/auth';
import { Permission, SysModule } from '@/app/types/entity';

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

export const createModuleApi = (body: CreateSysModule) => {
  return fetchFunc<Permission>({
    method: 'post',
    path: '/sysmodule',
    data: body,
  })
    .then(data => {
      return data;
    });
};

export const updateModuleApi = (id: SysModule['id'], body: CreateSysModule) => {
  return fetchFunc<Permission>({
    method: 'put',
    path: `/sysmodule/${id}`,
    data: body,
  })
    .then(data => {
      return data;
    });
};

export const deleteModuleApi = (id: SysModule['id']) => {
  return fetchFunc<Permission>({
    method: 'delete',
    path: `/sysmodule/${id}`,
  })
    .then(data => {
      return data;
    });
};
