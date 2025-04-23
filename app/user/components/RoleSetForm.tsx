"use client";

import { getRolesApi } from '@/app/api/auth';
import { updateUsersApi } from '@/app/api/user';
import SelectAsync from '@/app/components/SelectAsync';
import { User } from '@/app/types/entity';
import { App, Form, Modal, Select } from 'antd';
import { FC, useEffect, useState } from 'react';

interface FormProps {
  userData?: User;
  isOpen?: boolean;
  closeModal?: () => void;
  onOkSuccess?: () => void;
}

interface RoleSetFormVal {
  roles: number[];
}

const FormItem = Form.Item;
const { Option } = Select;

const RoleSetForm: FC<FormProps> = ({
  userData,
  isOpen = false,
  closeModal,
  onOkSuccess,
}) => {
  const { message } = App.useApp();

  const [form] = Form.useForm<RoleSetFormVal>();

  const [okLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    closeModal?.();
  };

  const clickOk = async () => {
    const values: RoleSetFormVal = form.getFieldsValue();
    const { roles } = values;
    console.log('values', roles);
    try {
      const { id, username, email } = userData || {};
      if (id && username && email) {
        await updateUsersApi(id, {
            ...userData,
            username,
            email,
            roles: values.roles.map(roleId => ({
              id: roleId,
            })),
        });

        message.success('分配角色成功！');
        onOkSuccess?.();
        onClose();
      }
    } catch (e) {
      message.error(Object.toString.call(e));
    }
  };

  useEffect(() => {
    if (isOpen) {
      const { roles } = userData || {};
      if (roles) {
        const roleIds = roles.map(role => role.id as number);
        form.setFieldsValue({
          roles: roleIds,
        });
      }
    }
  }, [isOpen]);

  return <Modal
    title={`给用户【${userData?.username}】分配`}
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
        name="roles"
        label="角色"
      >
        <SelectAsync
          dataKey="roles"
          idKey="id"
          valKey="id"
          labelKey="nameToShow"
          getOptionApi={getRolesApi}
        />
      </FormItem>
    </Form>
  </Modal>
};

export default RoleSetForm;
