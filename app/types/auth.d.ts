import { TreeDataNode } from 'antd';
import { MODULE_TYPE_MAP } from '../global/constants';
import { Permission, Role, SysModule } from './entity';

export type GetAuthListApiData = SysModule[];

export type ModuleNodeType = keyof typeof MODULE_TYPE_MAP;

export type ModuleListNode = Partial<TreeDataNode> & SysModule & Permission & {
  nodetype?: ModuleNodeType;
  children?: ModuleListNode[];
};

export interface ListProps {
  size?: number;
  total?: number;
  page?: number;
}

export interface GetUsersReturn extends ListProps {
  users?: User[];
}

export interface CreatePermission {
  name: string;
  nameDesc: string;
  parentID: number;
  description?: string;
}

export interface CreateSysModule {
  name: string;
  nameToShow: string;
  isMenu: boolean;
  parentID?: number;
  path?: string;
}

export interface CreateRoleDto {
  name: string;
  nameToShow: string;
  description?: string;
  sysModules: SysModule[];
  permissions: Permission[];
}
export interface GetRolesReturn extends ListProps {
  roles?: Role[];
}

export interface PaginationDto {
  page: number;
  size: number;
  searchKey?: string;
  searchValue?: string;
}
