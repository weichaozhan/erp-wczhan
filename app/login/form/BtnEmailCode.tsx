"use client"

import { Button } from 'antd';
import { FormInstance } from 'antd/lib';
import { FC } from 'react';

interface Props {
  form: FormInstance;
  onClick?: () => {};
}

const BtnEmailCode: FC<Props> = ({
  form,
  onClick = () => {},
}) =>{
  const handleClick = () => {
    form.validateFields()
      .then(() => {
        onClick();
      });
  };

  return <Button onClick={handleClick}>获取验证码</Button>;
};

export default BtnEmailCode;