import Spin from 'antd/lib/spin';

export default function Loading() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <Spin
        size="large"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'traslate(-50%)',
        }}
      />
    </div>
  );
};