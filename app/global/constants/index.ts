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
