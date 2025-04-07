export interface Permission {
  id?: number;
  name?: string;
  nameDesc?: string;
  parentID?: number;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
  sysModule?: SysModule;
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
  isMenu?: boolean;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
  permissions?: Permission[];
}