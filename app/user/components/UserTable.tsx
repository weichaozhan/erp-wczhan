"use client"

import { FC } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { User } from '@/app/types/entity';
import { GetUsersReturn } from '@/app/types/auth';
import { getUsersApi } from '@/app/api/user';
import TableHOC from '../../global/hoc/TableHOC';
import { RoleTableRef } from '@/app/components/AuthTree/types';

const { Column } = Table;

interface OwnProps {
  tableRef?: React.Ref<RoleTableRef>;
  onDel?: (user: User) => void;
}

const UserTable: FC<OwnProps> = ({
  tableRef,
}) => {
  return <TableHOC<
    OwnProps,
    User,
    GetUsersReturn
  >
    tableRef={tableRef}
    WrappedComponent={({
      listData,
      pagination,
      loading,
    }) => (
      <Table
        dataSource={listData}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        size="small"
      >
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="用户名" dataIndex="username" key="name" />
        <Column title="邮箱" dataIndex="email" key="email" />
        <Column title="角色" dataIndex="roles" key="roles" />
        <Column
          title="是否冻结"
          dataIndex="frozen"
          key="frozen"
          render={(value) => {
            return value ? '是' : '否';
          }}
        />
        <Column
          title="创建时间"
          dataIndex="createDate"
          key="createDate"
          render={(value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
          }}
        />
        <Column
          title="更新时间"
          dataIndex="updateDate"
          key="updateDate"
          render={(value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
          }}
        />
        <Column
          title="操作"
          key="actions" 
          render={(_, record) => (
            <>
              <Button
                type="primary"
                size="small"
                title="分配角色"
              >
                <EditOutlined />
              </Button>

              <Popconfirm
                title="注意"
                description={`确认删用户【${record.username}】？`}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                okButtonProps={{ danger: true, size: 'small' }}
                cancelButtonProps={{ size: 'small' }}
              >
                <Button
                  danger
                  className="ml-10px"
                  type="primary"
                  size="small"
                  title="删除"
                >
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </>
          )}
        />
      </Table>
    )}
    getListApi={getUsersApi}
    listKey="users"
  />;
};

export default UserTable;

