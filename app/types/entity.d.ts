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
  createrId?: number;
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
  createrId?: number;
  isMenu?: boolean;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
  permissions?: Permission[];
}