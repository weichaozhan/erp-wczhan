"use client"

import { FC, useRef, useState } from 'react';
import { App, Button, Divider, Popconfirm, Table } from 'antd';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { CommonTableRef } from '@/app/components/AuthTree/types';
import TableHOC from '../global/hoc/TableHOC';
import { GetGroupsReturn } from '../types/auth';
import { Group } from '../types/entity';
import { deleteGroupsApi, getGroupsApi } from '../api/group';
import GroupForm from './GroupForm';

const { Column } = Table;

const GroupTable: FC = () => {
  const { message } = App.useApp();

  const tableRef = useRef<CommonTableRef | null>(null);

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const [group, setGroup] = useState<Group | undefined>(undefined);

  const delGroup = async (record: Group) => {
    try {
      await deleteGroupsApi(record.id);

      tableRef.current?.refresh();

      message.success(`删除群组【${record.name}】成功！`);
    } catch (err) {
      message.error(Object.toString.call(err));
    }
  }

  return <>
    <Button type="default" onClick={() => setVisible(true)} >
      添加群组
    </Button>

    <Divider/>

    <TableHOC<
      Group,
      GetGroupsReturn
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
          <Column title="群名" dataIndex="name" key="name" />
          <Column title="创建者" dataIndex="createBy" key="createBy" />
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
            render={(...rest) => {
              const record = rest[1] as Group;
              return (<>
                <Button
                  className="mr-10px"
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => {
                    setGroup(record);
                    setIsEdit(true);
                    setVisible(true);
                  }}
                />

                <Popconfirm
                  title="注意"
                  description={`确认删除群组【${record.name}】？`}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  okButtonProps={{ danger: true, size: 'small' }}
                  cancelButtonProps={{ size: 'small' }}
                  onConfirm={() => delGroup(record)}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              </>)
            }}
          />
        </Table>
      )}
      getListApi={getGroupsApi}
      listKey="groups"
    />

    <GroupForm
      groupData={group}
      isOpen={visible}
      isEdit={isEdit}
      onOkSuccess={() => {
        tableRef.current?.refresh();
      }}
      closeModal={() => {
        setVisible(false);
        setIsEdit(false);
        setGroup(undefined);
      }}
    />
  </>;
};

export default GroupTable;

