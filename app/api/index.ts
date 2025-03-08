import { FETCH_URL } from '../global/constants';

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
