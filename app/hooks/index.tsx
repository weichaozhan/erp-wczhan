import { usePathname } from 'next/navigation';

import { DESIGNER_PATH_NAME, NO_SIDER_PATHS } from '../constants';

export const usePathHanlder = () => {
  const pathName = usePathname();
  const isNodeSider = NO_SIDER_PATHS.includes(pathName);

  const isDesigner = DESIGNER_PATH_NAME === pathName;

  return {
    isNodeSider,
    isDesigner,
  };
};