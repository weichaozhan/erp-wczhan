import { TreeDataNode } from 'antd';
import { MODULE_TYPE_MAP } from '../global/constants';
import { Permission, SysModule } from './entity';

export type GetAuthListApiData = SysModule[];

export type ModuleNodeType = keyof typeof MODULE_TYPE_MAP;

export type ModuleListNode = Partial<TreeDataNode> & SysModule & Permission & {
  nodetype?: ModuleNodeType;
  children?: ModuleListNode[];
};

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
