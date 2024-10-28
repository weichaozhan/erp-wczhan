import { Group as RadioGroup, Button as RadioButton, RadioChangeEvent } from 'antd/es/radio';
import classNames from 'classnames';

import styles from '../../styles/previewSider.module.scss';
import { FC } from 'react';

import { THREED, TWOD } from './constant';
import { SizeType } from 'antd/es/config-provider/SizeContext';

interface Props {
  value: string;
  onChange?: (e: RadioChangeEvent) => void;
  groupClassName?: string;
  buttonClassName?: string;
  size?: SizeType;
}

const ModeSelector: FC<Props> = ({
  value,
  size,
  groupClassName,
  buttonClassName,
  onChange,
}) => {
  return (
    <RadioGroup
      className={classNames(styles.previewTab, groupClassName)}
      onChange={onChange}
      value={value}
      size={size}
      optionType="button"
      buttonStyle="solid"
    >
      <RadioButton className={classNames(styles.button, buttonClassName)} value={THREED}>{THREED}</RadioButton>
      <RadioButton className={classNames(styles.button, buttonClassName)} value={TWOD}>{TWOD}</RadioButton>
    </RadioGroup>
  );
};

export default ModeSelector;
