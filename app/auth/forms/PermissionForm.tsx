import { createPermissionApi } from '@/app/api/auth';
import { COMMON_NAME } from '@/app/global/constants/regexpRools';
import { CreatePermission } from '@/app/types/auth';
import { App, Form, Input, Modal } from 'antd';
import { isNil } from 'lodash';
import { FC, useState } from 'react';

type PermissionFormVal = Omit<CreatePermission, 'parentID'>;

interface FormProps {
  parentID?: number;
  isOpen?: boolean;
  closeModal?: () => void;
  onOkSuccess?: () => void;
}

const FormItem = Form.Item;

const PermissionForm: FC<FormProps> = ({
  isOpen = false,
  parentID,
  closeModal = () => {},
  onOkSuccess = () => {},
}) => {
  const { message } = App.useApp();

  const [form] = Form.useForm<PermissionFormVal>();

  const [okLoading, setOkLoading] = useState(false);

  const onClose = () => {
    closeModal();
    form.resetFields();
  };

  const createPermission = async (values: PermissionFormVal) => {
    if (isNil(parentID)) {
      message.error('出错了');
      return;
    }

    setOkLoading(true);

    try {
      await createPermissionApi({ ...values, parentID});
      
      message.success('权限创建成功！');

      onClose();
      onOkSuccess();
    } catch(err) {
      console.error(err);
    }

    setOkLoading(false);
  }

  const clickOk = () => {
    form.validateFields()
      .then(() => {
        const values: PermissionFormVal = form.getFieldsValue();

        createPermission(values);
      });
  };

  return <Modal
    title="添加权限"
    open={isOpen}
    onOk={clickOk}
    maskClosable
    onClose={onClose}
    onCancel={onClose}
    okButtonProps={{ loading: okLoading }}
  >
    <Form
      form={form}
      name="login"
      labelCol={{ span: 6 }}
      labelAlign="left"
      wrapperCol={{ span: 18 }}
    >
      <FormItem
        name="name"
        label="权限名称"
        rules={[
          { required: true, message: '权限名不能为空' },
          () => ({
            validator: (_, name) => {
              if (!name || COMMON_NAME.test(name)) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
            message: '权限名只允许字母数字下划线组成',
          }),
        ]}
      >
        <Input placeholder='请输入权限名称' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="nameDesc"
        label="展示名称"
        rules={[
          { required: true, message: '权限展示名称不能为空' },
        ]}
      >
        <Input placeholder='请输入权限展示名称' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="description"
        label="说明"
      >
        <Input placeholder='请输入说明' suppressHydrationWarning />
      </FormItem>
    </Form>
  </Modal>
};

export default PermissionForm;
