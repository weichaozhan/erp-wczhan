import { fetchFunc } from '@/app/global/fetch';
import { GetGroupsReturn, PaginationDto } from '@/app/types/auth';

export interface CreateGroupDto {
  name: string;
  userIds: number[];
}

export const getGroupsApi = (body: PaginationDto) => {
  return fetchFunc<GetGroupsReturn>({
    method: 'get',
    data: body,
    path: '/group',
  })
    .then(data => {
      console.log(data);
      return data;
    });
};

export const createGroupsApi = (body: CreateGroupDto) => {
  return fetchFunc({
    method: 'post',
    data: body,
    path: '/group',
  })
    .then(data => {
      console.log(data);
      return data;
    });
};

export const updateGroupsApi = (id: number, body: CreateGroupDto) => {
  return fetchFunc({
    method: 'put',
    data: body,
    path: `/group/${id}`,
  })
    .then(data => {
      console.log(data);
      return data;
    });
};

export const deleteGroupsApi = (id: number) => {
  return fetchFunc({
    method: 'delete',
    path: `/group/${id}`,
  })
    .then(data => {
      console.log(data);
      return data;
    });
};
