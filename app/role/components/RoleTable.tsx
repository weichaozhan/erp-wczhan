"use client"

import { FC, useEffect, useState } from 'react';
import { App, Button, Table, TablePaginationConfig } from 'antd';

import { isBrowserEnv } from '@/app/global/tools';
import { Role } from '@/app/types/entity';
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE, ROLE_ADMIN_ID } from '@/app/global/constants';
import { getRolesApi } from '@/app/api/auth';
import dayjs from 'dayjs';

const { Column } = Table;

const RoleTable: FC = () => {
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<Pick<TablePaginationConfig, 'current' | 'pageSize'>>({
    current: DEFAULT_CURRENT,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [total, setTotal] = useState<number>();
  const [roleList, setRoleList] = useState<Role[]>();

  const onChangePagination: TablePaginationConfig['onChange'] = (page, pageSize) => {
    setPagination({
      pageSize,
      current: page,
    });
  };

  const getRolelist = async () => {
    const { pageSize, current } = pagination;

    if (pageSize && current) {
      setLoading(true);

      try {
        const data = await getRolesApi({ page: current, size: pageSize });
  
        setTotal(data?.total);
        setRoleList(data?.roles);
      } catch (err) {
        message.error(Object.toString.call(err));
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (isBrowserEnv()) {
      getRolelist();
    }
  }, []);

  return !!roleList && <Table
    dataSource={roleList}
    rowKey="id"
    pagination={{
      defaultCurrent: DEFAULT_CURRENT,
      defaultPageSize: DEFAULT_PAGE_SIZE,
      position: ['bottomRight'],
      pageSize: pagination.pageSize,
      current: pagination.current,
      total: total,
      onChange: onChangePagination,
    }}
    loading={loading}
  >
    <Column title="ID" dataIndex="id" />
    <Column title="名称" dataIndex="name" />
    <Column title="key 值" dataIndex="nameToShow" />
    <Column title="描述" dataIndex="description" />
    <Column title="创建时间" dataIndex="createTime" render={value => dayjs(value).format('YYYY-MM-DD HH:mm:ss')} />
    <Column title="更新时间" dataIndex="updateTime" render={value => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'} />
    <Column title="创建者" dataIndex="createBy" />
    <Column
      title="操作"
      dataIndex="client-options"
      render={(...rest) => {
        const record: Role = rest[1];
        console.log('rec', record);
        return record.id !== ROLE_ADMIN_ID && <>
          <Button type="primary" size="small">修改</Button>
          <Button className="ml-10px" type="primary" size="small" danger>删除</Button>
        </>;
      }}
    />
  </Table>;
};

export default RoleTable;
