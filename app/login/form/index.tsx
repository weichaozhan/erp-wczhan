"use client"
import { FC, useState } from 'react';
import classNames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Tooltip, } from 'antd';

import styles from '../styles/form.module.scss';
import { PWD_REG, USRNAME_REG } from '@/app/constants/regexpRools';

const FormItem = Form.Item;
const Password = Input.Password;

const LoginForm: FC = () => {
  const [form] = Form.useForm();

  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = () => {
    form.validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        console.log('values', values);
      });
  };

  return (
    <Form
      form={form}
      name="login"
      labelCol={{ span: 6 }}
      labelAlign="left"
      wrapperCol={{ span: 18 }}
      className={classNames(styles.form)}
    >
      <FormItem
        label="用户名"
        validateTrigger="onBlur"
        name="username"
        rules={[
          { required: true, message: '用户名不能为空' },
          () => ({
            validator: (_, val) => {
              if (!val || USRNAME_REG.test(val)) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
            message: '只允许字母数字下划线及汉字组成',
          }),
        ]}
      >
        <Input placeholder="请输入用户名" suppressHydrationWarning allowClear />
      </FormItem>

      <FormItem
        label={
          <div>
            密码
            <Tooltip
              placement="right"
              title="密码至少包含字母、数字、特殊字符，并且不能连续出现3个大小连续或相同的数字(如：456、654、888)"
            >
              <QuestionCircleOutlined className={classNames(styles['desc-pwd'])} />
            </Tooltip>
          </div>
        }
        validateTrigger="onBlur"
        name="password"
        rules={[
          { required: true, message: '密码不能为空' },
          () => ({
            validator: (_, val) => {
              // 注册密码只验证是否为空
              if (!isRegister) {
                return Promise.resolve();
              }
              if (!val || PWD_REG.test(val)) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
            message: '密码至少包含字母、数字、特殊字符，并且不能连续出现3个大小连续或相同的数字(如：456、654、888)',
          }),
        ]}
      >
        <Password placeholder="请输入密码" suppressHydrationWarning allowClear />
      </FormItem>

      
      <FormItem className={classNames(styles['form-footer'])} label={null} >
        <Button type="primary" onClick={onSubmit} >
          提交
        </Button>
      </FormItem>
    </Form>
  );
};

export default LoginForm;
