"use client"

import { FC } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { Role } from '@/app/types/entity';
import { getRolesApi } from '@/app/api/auth';
import dayjs from 'dayjs';
import { RoleTableRef } from '@/app/components/AuthTree/types';
import TableHOC from '@/app/global/hoc/TableHOC';
import { GetRolesReturn } from '@/app/types/auth';

interface RoleTableProps {
  tableRef: React.Ref<RoleTableRef>;
  onDel?: (role: Role) => void;
  onEdit?: (role: Role) => void;
}

const { Column } = Table;

const RoleTable: FC<RoleTableProps> = ({
  tableRef,
  onDel,
  onEdit,
}) => {
  return <TableHOC<
    Role,
    GetRolesReturn
  >
    listKey="roles"
    tableRef={tableRef}
    getListApi={getRolesApi}
    WrappedComponent={({
      loading,
      pagination,
      listData,
    }) => (
      <Table
        dataSource={listData}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        size="small"
        expandable={{
          rowExpandable: (record) => !!record.sysModules?.length || !!record.permissions?.length,
        }}
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
          key="client-options"
          render={(...rest) => {
            const record: Role = rest[1];
            
            return <>
              <Button
                type="primary"
                size="small"
                onClick={() => onEdit?.(record)}
              >修改</Button>

              <Popconfirm
                title="注意"
                description={`确认删除角色【${record.nameToShow}】？`}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                okButtonProps={{ danger: true, size: 'small' }}
                cancelButtonProps={{ size: 'small' }}
                onConfirm={() => onDel?.(record)}
              >
                <Button
                  danger
                  className="ml-10px"
                  type="primary"
                  size="small"
                >删除</Button>
              </Popconfirm>
            </>;
          }}
        />
      </Table>
    )}
  />;
};

export default RoleTable;
