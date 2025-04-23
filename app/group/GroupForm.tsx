"use client";

import { getRolesApi } from '@/app/api/auth';
// import { getGroupsApi } from '@/app/api/group';
import { getUsersApi } from '@/app/api/user';
import SelectAsync from '@/app/components/SelectAsync';
import { Group, User } from '@/app/types/entity';
import { App, Form, Input, Modal, Select } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CreateGroupDto, createGroupsApi, updateGroupsApi } from '../api/group';

interface FormProps {
  groupData?: Group;
  isOpen?: boolean;
  isEdit?: boolean;
  closeModal?: () => void;
  onOkSuccess?: () => void;
}

const FormItem = Form.Item;
const { Option } = Select;

const GroupForm: FC<FormProps> = ({
  groupData,
  isOpen = false,
  isEdit = false,
  closeModal,
  onOkSuccess,
}) => {
  const { message } = App.useApp();

  const [form] = Form.useForm<CreateGroupDto>();

  const [okLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    closeModal?.();
  };

  const clickOk = async () => {
    await form.validateFields();

    const values: CreateGroupDto = form.getFieldsValue();
    
    try {
      if (isEdit) {
        const { id } = groupData ?? {};
        if (id) {
          await updateGroupsApi(id, values);
        }
      } else {
        await createGroupsApi(values);
      }

      message.success(`${isEdit ? '修改' : '添加'}群组成功！`);
      onOkSuccess?.();
      onClose();
    } catch (e) {
      message.error(Object.toString.call(e));
    }
  };

  useEffect(() => {
    if (isOpen && isEdit) {
      const { users, name } = groupData || {};
      if (users) {
        const userIds = users.map(user => user.id as number);
        form.setFieldsValue({
          userIds,
          name,
        });
      }
    }
  }, [isOpen, isEdit]);

  return <Modal
    title={isEdit ? `给群组【${groupData?.name}】分配` : '添加群组'}
    open={isOpen}
    // onOk={clickOk}
    maskClosable
    onClose={onClose}
    onCancel={onClose}
    onOk={clickOk}
    okButtonProps={{ loading: okLoading }}
  >
    <Form
      form={form}
      name="userRoleSetForm"
      labelCol={{ span: 6 }}
      labelAlign="left"
      wrapperCol={{ span: 18 }}
    >
      <FormItem
        name="name"
        label="群名"
        rules={[
          { required: true, message: '群名不能为空' },
        ]}
      >
        <Input placeholder='请输入群名' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="userIds"
        label="用户"
      >
        <SelectAsync
          dataKey="users"
          idKey="id"
          valKey="id"
          labelKey="username"
          getOptionApi={getUsersApi}
          placeholder="请选择关联用户"
        />
      </FormItem>

      {/* <FormItem
        name="groups"
        label="群组"
      >
        <SelectAsync
          dataKey="groups"
          idKey="id"
          valKey="id"
          labelKey="name"
          getOptionApi={getGroupsApi}
        />
      </FormItem> */}
    </Form>
  </Modal>
};

export default GroupForm;
