import { FC, useCallback, useEffect, useState } from 'react';
import { App, Select, SelectProps } from 'antd';
import { debounce, once } from 'lodash';

import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '@/app/global/constants';
import { isBrowserEnv } from '@/app/global/tools';
import { ListProps, PaginationDto } from '@/app/types/auth';
import { SelectedIdLableMap } from '@/app/types';

interface SrollPagination {
  maxPage: number;
  page: number;
  size: number;
}

interface OwnProps {
  valKey: string;
  idKey: string;
  labelKey: string;
  dataKey: string;
  // the map to get selected label when selected item is not in option lise
  selectedIdLableMap?: SelectedIdLableMap;
  getOptionApi?: (body: PaginationDto) => Promise<ListProps & any>;
}
type SelectAsyncProps = OwnProps & SelectProps;

const Option = Select.Option;

const SelectAsync: FC<SelectAsyncProps> = ({
  valKey,
  idKey,
  labelKey,
  dataKey,
  selectedIdLableMap = {},
  getOptionApi = () => Promise.resolve({}),
  ...rest
}) => {
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<SrollPagination & PaginationDto>({
    maxPage: 0,
    page: DEFAULT_CURRENT,
    size: DEFAULT_PAGE_SIZE,
  });
  const [optionList, setOptionList] = useState<any[]>([]);

  const getRoles = async (pagination: PaginationDto) => {
    setLoading(true);
    try {
      const optionsData = (await getOptionApi(pagination)) || {};

      const listData = optionsData[dataKey] || [];
      const total = optionsData.total || 0;

      console.log('listData', listData);
      setOptionList(
        pagination.page === DEFAULT_CURRENT ?
          listData :
          optionList.concat(listData ?? []),
      );
      setPagination({
        ...pagination,
        maxPage: Math.ceil((total ?? 0) / pagination.size),
      });
    } catch (e) {
      message.error(Object.toString.call(e));
    }
    setLoading(false);
  };
  const getRolesFirstPage = useCallback(once(() => {
    getRoles({
      size: DEFAULT_PAGE_SIZE,
      page: DEFAULT_CURRENT,
    });
  }), []);

  const handleSearch: SelectProps['onSearch'] = useCallback(debounce((val) => {
    getRoles({
      page: DEFAULT_CURRENT,
      size: DEFAULT_PAGE_SIZE,
      searchKey: labelKey,
      searchValue: val,
    });
  }), []);

  const onPopupScroll: SelectProps['onPopupScroll'] = (e) => {
    const { scrollTop, offsetHeight, scrollHeight } = e.target as HTMLElement;
    
    if(scrollTop + offsetHeight === scrollHeight) {
      const { page, maxPage } = pagination;

      const curPage = page + 1;
      if(curPage <= maxPage) {
        console.log('eee', e);
        getRoles({
          ...pagination,
          page: curPage,
        });
      }
    }
  };

  useEffect(() => {
    if (isBrowserEnv()) {
      getRolesFirstPage();
    }
  }, []);

  return <Select
    mode="multiple"
    onPopupScroll={onPopupScroll}
    {...rest}
    showSearch
    loading={loading}
    filterOption={false}
    labelRender={(props) => <>{props.label ?? selectedIdLableMap[props.value] ?? props.value}</>}
    onSearch={handleSearch}
    onBlur={() => {
      const { searchKey, searchValue } = pagination;

      if (searchKey || searchValue) {
        getRoles({
          page: DEFAULT_CURRENT,
          size: DEFAULT_PAGE_SIZE,
        });
      }
    }}
  >
    {optionList.map(data => {
      return <Option key={data[idKey]} value={data[valKey]}>{data[labelKey]}</Option>
    })}
  </Select>
};

export default SelectAsync;
