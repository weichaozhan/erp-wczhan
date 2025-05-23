export interface User {
  id: number;
  email?: string;
  userId?: string;
  username?: string;
  frozen?: boolean;
  createDate?: Date;
  updateDate?: Date;
  createBy?: string;
  creatorId?: number;
  roles?: Role[];
}

export interface Permission {
  id?: number;
  name?: string;
  nameDesc?: string;
  parentID?: number;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
  sysModule?: SysModule;
  createBy?: string;
  creatorId?: number;
}

export interface SysModule {
  id?: number;
  name?: string;
  nameToShow?: string;
  parentID?: number;
  type?: string;
  icon?: string;
  path?: string;
  createBy?: string;
  creatorId?: number;
  isMenu?: boolean;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
  permissions?: Permission[];
}

export class Role {
  id?: number;
  name?: string;
  nameToShow?: string;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
  createBy?: string;
  creatorId?: number;
  sysModules?: SysModule[];
  permissions?: Permission[];
}

export class Group {
  id: number;
  name: string;
  description: string;
  createTime: Date;
  updateTime: Date;
  createBy: string;
  creatorId: number;
  users: User[];
}

