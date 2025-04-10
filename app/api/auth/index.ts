import { fetchFunc } from '@/app/global/fetch';
import {
  CreatePermission,
  CreateRoleDto,
  CreateSysModule,
  GetAuthListApiData,
  GetRolesReturn,
  PaginationDto,
} from '@/app/types/auth';
import { Permission, Role, SysModule } from '@/app/types/entity';

export const getAuthListApi = () => {
  return fetchFunc<GetAuthListApiData>({
    method: 'get',
    path: '/system_modules',
  })
    .then(data => {
      return data;
    });
};

// permission
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

// module
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

// role
export const getRolesApi = (body: PaginationDto) => {
  return fetchFunc<GetRolesReturn>({
    method: 'get',
    path: '/role',
    data: body,
  })
    .then(data => {
      return data;
    });
};
export const createRoleApi = (body: CreateRoleDto) => {
  return fetchFunc<Role>({
    method: 'post',
    path: '/role',
    data: body,
  })
    .then(data => {
      return data;
    });
};
export const updateRoleApi = (id: Role['id'], body: CreateRoleDto) => {
  return fetchFunc<Role>({
    method: 'put',
    path: `/role/${id}`,
    data: body,
  })
    .then(data => {
      return data;
    });
};
export const delRoleApi = (id: Role['id']) => {
  return fetchFunc<Role>({
    method: 'delete',
    path: `/role/${id}`,
  })
    .then(data => {
      return data;
    });
};
