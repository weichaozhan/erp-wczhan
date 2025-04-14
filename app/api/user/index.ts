import { fetchFunc } from '@/app/global/fetch';
import { GetUsersReturn, PaginationDto } from '@/app/types/auth';
import { Role } from '@/app/types/entity';

export interface CreateUsersApi {
  username: string;
  email: string;
  password: string;
  code: string;
}

export const getUsersApi = (body: PaginationDto) => {
  return fetchFunc<GetUsersReturn>({
    method: 'get',
    data: body,
    path: '/user',
  })
    .then(data => {
      console.log(data);
      return data;
    });
};

export const createUsersApi = (body: CreateUsersApi) => {
  return fetchFunc({
    method: 'post',
    data: body,
    path: '/user',
  })
    .then(data => {
      console.log(data);
      return data;
    });
};

type UpdateUsersApi = Pick<CreateUsersApi, 'username' | 'email'> & {
  frozen?: boolean;
  roles?: Role[];
}
export const updateUsersApi = (id: number, body: UpdateUsersApi) => {
  return fetchFunc({
    method: 'put',
    data: body,
    path: `/user/${id}`,
  })
    .then(data => {
      console.log(data);
      return data;
    });
};
