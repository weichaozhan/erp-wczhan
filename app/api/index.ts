import { FETCH_URL } from '../global/constants';
import { fetchFunc } from '../global/fetch';

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

interface GetEmailCaptchaApi {
  email: string;
}
interface GetEmailCaptchaApiReturn {
  code: number;
  message: string;
  data: any;
}

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
