export const FETCH_URL = 'http://localhost:3001';

export const HOME_PATH_NAME = '/';
export const DESIGNER_PATH_NAME = '/designer';
export const LOGIN_PAGE = '/login';
export const ABOUT_PAGE = '/about';
export const FORBIDDEN_PAGE = '/forbidden';

export const NO_SIDER_PATHS = [HOME_PATH_NAME, DESIGNER_PATH_NAME, LOGIN_PAGE];

export const COMMON_PATHS = [
  HOME_PATH_NAME,
  DESIGNER_PATH_NAME,
  LOGIN_PAGE,
  ABOUT_PAGE,
  FORBIDDEN_PAGE,
];

// role id
export const ROLE_ADMIN_ID = 1;

// module id
export const ROOT_MODULE_ID = 1;
export const AUTH_MODULE_ID = 2;

export const AUTHORIZATION = 'Authorization';

export const HTTP_CODE = {
  Unauthorized: 401,
};

export const MODULE_TYPE_MAP = {
  module: {
    name: '模块',
    color: 'magenta',
  },
  menu: {
    name: '菜单',
    color: 'cyan',
  },
  permission: {
    name: '权限',
    color: 'orange',
  },
};

// table
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENT = 1;
