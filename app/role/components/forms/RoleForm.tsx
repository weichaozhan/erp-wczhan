import { App, Form, Input, Modal, Tag, TreeSelect } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { once } from 'lodash';

import { COMMON_NAME } from '@/app/global/constants/regexpRools';
import { isBrowserEnv } from '@/app/global/tools';
import { CreateRoleDto, ModuleListNode } from '@/app/types/auth';
import { createRoleApi, getAuthListApi, updateRoleApi } from '@/app/api/auth';
import { MODULE_TYPE_MAP } from '@/app/global/constants';
import { Permission, Role, SysModule } from '@/app/types/entity';

type RoleFormVal = Omit<CreateRoleDto, 'sysModules' | 'permissions'> & { tree: string[] };

interface FormProps {
  isEdit?: boolean;
  roleData?: Role;
  isOpen?: boolean;
  closeModal?: () => void;
  onOkSuccess?: () => void;
}

type TreeNode = ModuleListNode & { value?: string; };
type SimpleTreeNode = Pick<ModuleListNode, 'id' | 'parentID'>;

const FormItem = Form.Item;

const PREFIX_MODULE = 'module-';

const getModuleTreeVal = (isModule: boolean, id: number) => `${isModule ? PREFIX_MODULE : ''}${id}`;

const RoleForm: FC<FormProps> = ({
  isEdit = false,
  isOpen = false,
  roleData,
  closeModal = () => {},
  onOkSuccess = () => {},
}) => {
  const { message } = App.useApp();

  const [form] = Form.useForm<RoleFormVal>();

  const treeMapRef = useRef<Map<number, SimpleTreeNode>>(new Map());

  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const [okLoading, setOkLoading] = useState(false);

  const getAuthList = async () => {
    try {
      const data = await getAuthListApi();
  
      const map = new Map<number, TreeNode>();
      const tree: TreeNode[] = [];
  
      data?.forEach((auth) => {
        const { id, isMenu } = auth;
        if (id) {
          const authTemp = auth as TreeNode;
          map.set(id, authTemp);
          treeMapRef.current.set(id, { id, parentID: auth.parentID });
  
          authTemp.children = [];
          authTemp.value = getModuleTreeVal(true, id);
          authTemp.title = <div>
            <Tag color={MODULE_TYPE_MAP.module.color}>
              {MODULE_TYPE_MAP.module.name}
            </Tag>

            {isMenu && <Tag color={MODULE_TYPE_MAP.menu.color}>
              {MODULE_TYPE_MAP.menu.name}
            </Tag>}

            {authTemp.nameToShow}
          </div>;
  
          authTemp.permissions?.forEach((permission) => {
            authTemp.children?.push({
              ...permission,
              value: getModuleTreeVal(false, permission.id ?? 0),
              title: <div>
              <Tag color={MODULE_TYPE_MAP.permission.color}>
                {MODULE_TYPE_MAP.permission.name}
              </Tag>
              
              {permission.nameDesc}
            </div>,
            } as TreeNode);
          });
        }
      });
      data?.forEach(auth => {
        const { parentID } = auth;
        if (!parentID) {
          tree.push(auth);
        } else {
          const parent = map.get(parentID);
          if (parent) {
            parent?.children?.push(auth);
          } else {
            tree.push(auth);
          }
        }
      });

      setTreeData(tree);
    } catch(err) {
      console.error(err);
    }
  };

  const getAuthListMounted = useCallback(once(getAuthList), []);

  const onClose = () => {
    closeModal();
    form.resetFields();
  };

  const sendRequest = async (values: CreateRoleDto) => {
    setOkLoading(true);

    try {
      const { id } = roleData ?? {};
      if (isEdit) {
        if (id) {
          await updateRoleApi(id, values);
        }
      } else {
        await createRoleApi(values);
      }

      if (isEdit && !id) {
        message.error('操作失败！');
      } else {
        message.success(`角色${isEdit ? '修改' : '创建'}成功！`);
  
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
        const values: RoleFormVal = form.getFieldsValue();
        const { tree } = values;

        const sysModules: SysModule[] = [];
        const permissions: Permission[] = [];

        tree.forEach(item => {
          const isModule = /^module-/.test(item);

          const [id] = item.replace(PREFIX_MODULE, '').split('-').map(id => +id);

          if (isModule) {
            sysModules.push({ id });
          } else {
            permissions.push({ id });
          }
        });

        console.log('values', values, 'sysModules, permissions', sysModules, permissions);
        sendRequest({
          name: values.name,
          nameToShow: values.nameToShow,
          description: values.description,
          sysModules,
          permissions,
        });
      });
  };

  useEffect(() => {
    if (isOpen && isEdit) {
      const leafModules: string[] = [];
      const pids: string[] = []

      roleData?.permissions?.forEach(p => p.id && pids.push(
        getModuleTreeVal(false, p.id),
      ));
      roleData?.sysModules?.forEach(s => !s.parentID && s.id && leafModules.push(
        getModuleTreeVal(true, s.id),
      ));

      const formVal = {
        name: roleData?.name,
        nameToShow: roleData?.nameToShow,
        description: roleData?.description,
        tree: [...leafModules, ...pids],
      };

      console.log('formVal', formVal, 'roleData', roleData);
      form.setFieldsValue(formVal);
    }
  }, [isOpen, isEdit]);
  useEffect(() => {
    if (isBrowserEnv()) {
      getAuthListMounted();
    }
  }, []);

  return <Modal
    title={`${isEdit ? '修改' : '添加'}角色${isEdit ? `【${roleData?.nameToShow}】` : ''}`}
    open={isOpen}
    onOk={clickOk}
    maskClosable
    onClose={onClose}
    onCancel={onClose}
    okButtonProps={{ loading: okLoading }}
  >
    <Form
      form={form}
      name="role"
      labelCol={{ span: 6 }}
      labelAlign="left"
      wrapperCol={{ span: 18 }}
    >
      <FormItem
        name="name"
        label="名称"
        rules={[
          { required: true, message: '角色名不能为空' },
          () => ({
            validator: (_, name) => {
              if (!name || COMMON_NAME.test(name)) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
            message: '角色名只允许字母数字下划线组成',
          }),
        ]}
      >
        <Input disabled={isEdit} placeholder='请输入角色名称' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="nameToShow"
        label="展示名称"
        rules={[
          { required: true, message: '角色展示名称不能为空' },
        ]}
      >
        <Input placeholder='请输入角色展示名称' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="description"
        label="描述"
      >
        <Input placeholder='请输入角色描述' suppressHydrationWarning />
      </FormItem>

      <FormItem
        name="tree"
        label="权限"
      >
        <TreeSelect
          showSearch
          placeholder="请选择角色权限"
          allowClear
          multiple
          treeDefaultExpandAll
          treeCheckable
          treeData={treeData}
        />
      </FormItem>
    </Form>
  </Modal>
};

export default RoleForm;
