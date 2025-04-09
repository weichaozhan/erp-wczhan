import { createModuleApi, updateModuleApi } from '@/app/api/auth';
import { COMMON_NAME } from '@/app/global/constants/regexpRools';
import { CreateSysModule, ModuleListNode } from '@/app/types/auth';
import { App, Form, Input, Modal, Radio } from 'antd';
import { FC, useEffect, useState } from 'react';

type ModuleFormVal = Omit<CreateSysModule, 'parentID'>;

interface FormProps {
  isEdit?: boolean;
  parentID?: number;
  moduleData?: ModuleListNode;
  isOpen?: boolean;
  closeModal?: () => void;
  onOkSuccess?: () => void;
}

const FormItem = Form.Item;

const ModuleForm: FC<FormProps> = ({
  isEdit = false,
  isOpen = false,
  parentID,
  moduleData,
  closeModal = () => {},
  onOkSuccess = () => {},
}) => {
  const { message } = App.useApp();

  const [form] = Form.useForm<ModuleFormVal>();

  const [okLoading, setOkLoading] = useState(false);

  const onClose = () => {
    closeModal();
    form.resetFields();
  };

  const sendRequest = async (values: ModuleFormVal) => {
    setOkLoading(true);

    try {
      const { id } = moduleData ?? {};
      if (isEdit) {
        if (id) {
          await updateModuleApi(id, { ...values });
        }
      } else {
        await createModuleApi({ ...values, parentID });
      }

      if (isEdit && !id) {
        message.error('操作失败！');
      } else {
        message.success(`模块${isEdit ? '修改' : '创建'}成功！`);
  
        onClose();
        onOkSuccess();
      }
    } catch(err) {
      console.error(err);
    }

    setOkLoading(false);
  }

  const clickOk = () => {
    form.validateFields()
      .then(() => {
        const values: ModuleFormVal = form.getFieldsValue();

        sendRequest(values);
      });
  };

  useEffect(() => {
    if (isOpen && isEdit) {
      form.setFieldsValue({
        name: moduleData?.name,
        nameToShow: moduleData?.nameToShow,
        isMenu: moduleData?.isMenu,
        path: moduleData?.path,
      });
    }
  }, [isOpen, isEdit]);

  return <Modal
    title={`${isEdit ? '修改' : '添加'}模块${isEdit ? `【${moduleData?.nameToShow}】` : ''}`}
    open={isOpen}
    onOk={clickOk}
    maskClosable
    onClose={onClose}
    onCancel={onClose}
    okButtonProps={{ loading: okLoading }}
  >
    <Form
      form={form}
      name="sysmodule"
      labelCol={{ span: 6 }}
      labelAlign="left"
      wrapperCol={{ span: 18 }}
    >
      <FormItem
        name="name"
        label="名称"
        rules={[
          { required: true, message: '模块名不能为空' },
          () => ({
            validator: (_, name) => {
              if (!name || COMMON_NAME.test(name)) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
            message: '模块名只允许字母数字下划线组成',
          }),
        ]}
      >
        <Input disabled={isEdit} placeholder='请输入模块名称' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="nameToShow"
        label="展示名称"
        rules={[
          { required: true, message: '模块展示名称不能为空' },
        ]}
      >
        <Input placeholder='请输入模块展示名称' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="isMenu"
        label="是否为菜单"
      >
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </FormItem>
      
      <FormItem
        noStyle
        shouldUpdate={(preVal, curVal) => preVal.isMenu !== curVal.isMenu}
      >
        {({ getFieldValue }) => getFieldValue('isMenu') ? (
          <FormItem
            name="path"
            label="路径"
          >
            <Input placeholder='请输入路径' suppressHydrationWarning />
          </FormItem>
        ) : null}
      </FormItem>
    </Form>
  </Modal>
};

export default ModuleForm;
