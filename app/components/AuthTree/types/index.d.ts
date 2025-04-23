export interface AuthTreeRef {
  refresh: () => void;
};

export interface CommonTableRef {
  refresh: () => void;
}

export interface RoleTableRef extends CommonTableRef {}
