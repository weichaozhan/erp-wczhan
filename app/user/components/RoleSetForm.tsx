"use client";

import { getRolesApi } from '@/app/api/auth';
import { updateUsersApi } from '@/app/api/user';
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '@/app/global/constants';
import { isBrowserEnv } from '@/app/global/tools';
import { PaginationDto } from '@/app/types/auth';
import { Role, User } from '@/app/types/entity';
import { App, Form, Modal, Select, SelectProps } from 'antd';
import { once } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';

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

  const [pagination, setPagination] = useState({
    maxPage: 0,
    page: DEFAULT_CURRENT,
    size: DEFAULT_PAGE_SIZE,
  });
  const [optionList, setOptionList] = useState<Role[]>([]);

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

  const onPopupScroll: SelectProps['onPopupScroll'] = (e) => {
    const { scrollTop, offsetHeight, scrollHeight } = e.target as HTMLElement;
    
    if(scrollTop + offsetHeight === scrollHeight) {
      const { page, maxPage } = pagination;

      const curPage = page + 1;
      if(curPage <= maxPage) {
        console.log('eee', e);
        getRoles({
          ...pagination,
          page: curPage,
        });
      }
    }
  };

  const getRoles = async (pagination: PaginationDto) => {
    try {
      const { roles, total } = (await getRolesApi(pagination)) || {};
      console.log('roles', roles);
      setOptionList(optionList.concat(roles ?? []));
      setPagination({
        ...pagination,
        maxPage: Math.ceil((total ?? 0) / pagination.size),
      });
    } catch (e) {
      message.error(Object.toString.call(e));
    }
  };
  const getRolesFirstPage = useCallback(once(() => {
    getRoles({
      size: DEFAULT_PAGE_SIZE,
      page: DEFAULT_CURRENT,
    });
  }), []);

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

  useEffect(() => {
    if (isBrowserEnv()) {
      getRolesFirstPage();
    }
  }, []);

  return <Modal
    title={`给用户【${userData?.username}】分配角色`}
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
        <Select
          mode="multiple"
          onPopupScroll={onPopupScroll}
        >
          {optionList.map(role => {
            return <Option key={role.id} value={role.id}>{role.nameToShow}</Option>
          })}
        </Select>
      </FormItem>
    </Form>
  </Modal>
};

export default RoleSetForm;
