"use client"
import { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Tooltip, App } from 'antd';
import { debounce } from 'lodash';

import styles from '../styles/form.module.scss';

import { EMAIL_REG, PWD_REG, USRNAME_REG } from '@/app/global/constants/regexpRools';
import { loginApi, LoginApi } from '@/app/api/login';
import { isNil } from 'lodash';
import { useStore } from '@/app/store';
import { AUTHORIZATION } from '@/app/global/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCaptchaApi } from '@/app/api';
import BtnEmailCode from './BtnEmailCode';
import { CreateUsersApi, createUsersApi } from '@/app/api/user';

const FormItem = Form.Item;
const Password = Input.Password;

const LoginForm: FC = () => {
  const router = useRouter();
  const urlParams = useSearchParams();

  const { message, modal } = App.useApp();

  const setIsLogin = useStore(state => state.setIsLogin);

  const [form] = Form.useForm();

  const [isRegister, setIsRegister] = useState(false);
  const [captcha, setCaptcha] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState(false);

  const getCaptcha = async () => {
    const img = await getCaptchaApi();
    setCaptcha(img);
  };

  const toggleLoginRigister = useCallback(() => {
    setIsRegister(!isRegister);
    form.resetFields();
  }, [isRegister, form]);

  const login = async (params: LoginApi) => {
    await loginApi(params)
      .then(data => {
        if (!isNil(data)) {
          message.open({
            content: '登录成功！',
            type: 'success',
          });
          const authStr = `${data.type} ${data.accessToken}`;
          localStorage.setItem('Authorization', authStr);
          setIsLogin(true);

          const preUrl = urlParams.get('url');

          router.push(preUrl || '/');
        }
      });
  };

  const createUser = async (params: CreateUsersApi) => {
    await createUsersApi(params);
    modal.success({
      content: '用户注册成功！',
      okText: '去登录',
      onOk: () => {
        setIsRegister(false);
        form.resetFields();
      },
    });
  };

  const onSubmit = useCallback(debounce(() => {
    form.validateFields()
      .then(async () => {
        const values: CreateUsersApi & { [key: string]: any } = form.getFieldsValue();

        setLoading(true);

        try {
          if (!isRegister) {
            await login(values);
          } else {
            await createUser(values);
          }
          setLoading(false);
        } catch {
          setLoading(false);
        }

      });
  }, 200), [form, isRegister, router, urlParams]);

  useEffect(() => {
    // 跳转登录页重置登录状态
    localStorage.removeItem(AUTHORIZATION);
    setIsLogin(false);
  }, []);

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
              if (!isRegister) {
                return Promise.resolve();
              }

              if (!val || (USRNAME_REG.test(val))) {
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
              // 登录密码只验证是否为空
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

      {isRegister && (<FormItem
        label="再次输入密码"
        validateTrigger="onBlur"
        name="password2"
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator: (_, val) => {
              const pwd = getFieldValue('password');

              if (!val || val === pwd) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
            message: '两次密码不同，请再次输入',
          }),
        ]}
      >
        <Password placeholder="请输入密码" suppressHydrationWarning allowClear />
      </FormItem>)}

      {isRegister && <FormItem
        label="邮箱"
        validateTrigger="onBlur"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          () => ({
            validator: (_, email) => {
              if (!email || EMAIL_REG.test(email)) {
                return Promise.resolve();
              }
              return Promise.reject();
            },
            message: '邮箱格式错误，请重新输入',
          }),
        ]}
      >
        <Input className={styles['email-code-input']} placeholder='请输入邮箱' suppressHydrationWarning />
      </FormItem>}

      <div className={styles['login-code-wrapper']} >
        {!isRegister && <div
          dangerouslySetInnerHTML={{ __html: captcha || '点击获取验证码' }}
          onClick={() => getCaptcha()}
        ></div>}
        
        <FormItem
          label={null}
          className={classNames(
            styles['form-item-login-code'],
            isRegister ? styles['register-code'] : undefined,
          )}
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <div className={styles['code-wrapper']}>
            <Input className={isRegister ? styles['email-code-input'] : undefined} placeholder='请输入验证码' suppressHydrationWarning />
            
            {isRegister && <BtnEmailCode form={form} />}
          </div>
        </FormItem>
      </div>


      <div className={classNames(styles['form-footer'])} >
        <Button
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          {isRegister ? '注册' : '提交'}
        </Button>

        <Button
          className={classNames(styles['btn-register'])}
          type="text"
          size="small"
          onClick={toggleLoginRigister}
        >
          {isRegister ? '已有账户？去登录' : '没有账户？点击注册'}
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
