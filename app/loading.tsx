import Image from 'next/image';

export default function Loading() {
  return (
    <Image
      src='/icon_loading.svg'
      alt='loading_logo'
      width={100}
      height={100}
    />
  );
};