import { SysModule } from './entity';

export interface ApiReturn<T> {
  code: number;
  message: string;
  data: T;
}

export interface GetEmailCaptchaApi {
  email: string;
}
export type GetEmailCaptchaApiReturn = ApiReturn<any>;

export type MenuListNode = SysModule & { children?: MenuListNode[] };

export type GetMenusApiData = MenuListNode[];

