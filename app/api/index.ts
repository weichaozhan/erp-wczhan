import { FETCH_URL } from '../global/constants';
import { fetchFunc } from '../global/fetch';
import { GetEmailCaptchaApi, GetEmailCaptchaApiReturn, GetMenusApiData } from '../types';

export const getCaptchaApi = () => {
  return fetch(
    `${FETCH_URL}/captcha`,
    {
      method: 'get',
      credentials: 'include',
      mode: 'cors',
    }
  )
    .then(data => data.text())
    // .then(str => new window.DOMParser().parseFromString(str, "text/html"))
    .then(data => {
      return data;
    });
};

export const getEmailCaptchaApi = (body: GetEmailCaptchaApi) => {
  return fetchFunc<GetEmailCaptchaApiReturn>({
    method: 'post',
    data: body,
    path: '/captcha/email',
  })
    .then(data => {
      console.log(data);
      return data as GetEmailCaptchaApiReturn;
    });
};

export const getMenusApi = () => {
  return fetchFunc<GetMenusApiData>({
    method: 'get',
    path: '/menus',
  })
    .then(data => {
      return data;
    });
};
