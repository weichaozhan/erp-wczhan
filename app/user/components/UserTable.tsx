"use client"

import { FC, useRef, useState } from 'react';
import { App, Button, Popconfirm, Table } from 'antd';
import { QuestionCircleOutlined, CheckOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { Role, User } from '@/app/types/entity';
import { GetUsersReturn } from '@/app/types/auth';
import { getUsersApi, updateUsersApi } from '@/app/api/user';
import TableHOC from '../../global/hoc/TableHOC';
import { RoleTableRef } from '@/app/components/AuthTree/types';
import RoleSetForm from './RoleSetForm';
import { USER_FIRST_ID } from '@/app/global/constants';

const { Column } = Table;

const UserTable: FC = () => {
  const { message } = App.useApp();

  const tableRef = useRef<RoleTableRef | null>(null);

  const [roleSetVisible, setRoleSetVisible] = useState(false);
  const [userData, setUserData] = useState<User>();

  const updateUser = async (user: User, frozen: boolean = false) => {
    const { username, email } = user;
    if (username && email) {
      try {
        await updateUsersApi(user.id, {
          username,
          email,
          frozen,
        });
        tableRef.current?.refresh();
        message.success(`用户【${username}】${frozen ? '冻结' : '解冻'}成功`);
      } catch (e) {
        message.error(Object.toString.call(e));
      }
    }
  };

  return <>
    <TableHOC<
      User,
      GetUsersReturn
    >
      tableRef={ref => {
        tableRef.current = ref;
      }}
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
          <Column title="角色" dataIndex="roles" key="roles" render={(roles: Role[]) => {
            return roles?.map(role => role.nameToShow).join('，');
          }} />
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
            render={(_, record: User) => {
              const txtFrozen = record.frozen ? '解冻' : '冻结';
              return record.id === USER_FIRST_ID ? <></> : (
                <>
                  <Button
                    type="primary"
                    size="small"
                    title="分配"
                    onClick={() => {
                      setUserData(record);
                      setRoleSetVisible(true);
                    }}
                  >
                    <EditOutlined />
                  </Button>
    
                  <Popconfirm
                    title="注意"
                    description={`确认${txtFrozen}用户【${record.username}】？`}
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    okButtonProps={{ danger: true, size: 'small' }}
                    cancelButtonProps={{ size: 'small' }}
                    onConfirm={() => updateUser(record, !record.frozen)}
                  >
                    <Button
                      danger={!record.frozen}
                      className="ml-10px"
                      type="primary"
                      size="small"
                      title={txtFrozen}
                    >
                      {record.frozen ? <CheckOutlined /> : <CloseOutlined />}
                    </Button>
                  </Popconfirm>
                </>
              );
            }}
          />
        </Table>
      )}
      getListApi={getUsersApi}
      listKey="users"
    />

    <RoleSetForm
      isOpen={roleSetVisible}
      userData={userData}
      closeModal={() => {
        setRoleSetVisible(false);
        setUserData(undefined);
      }}
      onOkSuccess={() => {
        setRoleSetVisible(false);
        setUserData(undefined);
        tableRef.current?.refresh();
      }}
    />
  </>;
};

export default UserTable;

