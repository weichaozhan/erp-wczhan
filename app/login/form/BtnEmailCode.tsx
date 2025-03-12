"use client"

import { getEmailCaptchaApi } from '@/app/api';
import { Button, message } from 'antd';
import { FormInstance } from 'antd/lib';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  form: FormInstance;
  onClick?: () => {};
}

const TIME_MAX = 60;

const BtnEmailCode: FC<Props> = ({
  form,
  onClick = () => {},
}) =>{
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const timeCount = useRef(TIME_MAX);

  const [time, setTime] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const getEmailCaptcha = useCallback(async (email: string) => {
    const result = await getEmailCaptchaApi({ email });

    message.success(result.message);
    console.log('result', result);
  }, []);

  const handleClick = useCallback(async () => {
    const email = form.getFieldsValue(['email']).email;
    console.log('email', email);

    if (!email) {
      message.error('请输入邮箱');
    } else {
      if (timeCount.current) {
        clearTimeout(timeCount.current);
      }

      setLoading(true);
      try {
        await getEmailCaptcha(email);

        setTime(timeCount.current);

        const countDown = () => {
          timeoutRef.current = setTimeout(() => {
            if (timeCount.current) {
              timeCount.current--;
              setTime(timeCount.current);
              countDown();
            } else {
              timeCount.current = TIME_MAX;
            }
          }, 1000);
        }
        countDown();

        onClick();
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log('err', err);
      }
    }
  }, [form, onClick, time, getEmailCaptcha]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return <Button loading={loading} disabled={!!time} onClick={handleClick}>{time === null ? '获取验证码' : `重新发送${time === 0 ? '' : `（${time}秒）`}`}</Button>;
};

export default memo(BtnEmailCode);