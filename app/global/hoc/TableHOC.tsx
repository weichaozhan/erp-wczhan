"use client"

import { App, TablePaginationConfig, TableProps } from 'antd';
import { ComponentType, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../constants';
import { ListProps, PaginationDto } from '@/app/types/auth';
import { once } from 'lodash';
import { isBrowserEnv } from '../tools';
import { RoleTableRef } from '@/app/components/AuthTree/types';

export interface CommonTableProps<T> {
  listData: T[];
  pagination?: TableProps['pagination'];
  loading?: boolean;
}

type PageParams = Pick<TablePaginationConfig, 'current' | 'pageSize'>;

export default function TableHOC<
  OwnProps,
  DataNode,
  ReturnData>({
    tableRef,
    WrappedComponent,
    getListApi,
    listKey,
  }: {
    tableRef?: React.Ref<RoleTableRef>;
    WrappedComponent: ComponentType<CommonTableProps<DataNode>>;
    getListApi: (body: PaginationDto) => Promise<ReturnData & ListProps | undefined>;
    listKey: keyof ReturnData | undefined;
  }) {
    const { message } = App.useApp();
  
    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState<number>();

    const [pagination, setPagination] = useState<PageParams>({
        current: DEFAULT_CURRENT,
        pageSize: DEFAULT_PAGE_SIZE,
      });
    const [listData, setListData] = useState<DataNode[]>();

    const getListData = async (pagination: PageParams) => {
        const { pageSize, current } = pagination;
    
        if (pageSize && current) {
          setLoading(true);
    
          try {
            const data = await getListApi({ page: current, size: pageSize });
      
            setTotal(data?.total);

            if (listKey) {
              const list = data?.[listKey];
              if (list) {
                setListData(list as DataNode[]);
              }
            }
          } catch (err) {
            message.error(Object.toString.call(err));
          }
    
          setLoading(false);
        }
      };
    
    const initRolelist = useCallback(once(getListData), [pagination]);

    const onChangePagination: TablePaginationConfig['onChange'] = (page, pageSize) => {
      const curPageData = {
        pageSize,
        current: page,
      };
      getListData(curPageData);
      setPagination(curPageData);
    };

    useImperativeHandle(tableRef, () => ({
        refresh: () => getListData(pagination),
      }), [pagination]);

    useEffect(() => {
      if (isBrowserEnv()) {
        initRolelist(pagination);
      }
    }, []);

    return !!listData && <WrappedComponent
      listData={listData ?? []}
      pagination={{
        defaultCurrent: DEFAULT_CURRENT,
        defaultPageSize: DEFAULT_PAGE_SIZE,
        position: ['bottomRight'],
        pageSize: pagination.pageSize,
        current: pagination.current,
        total: total,
        onChange: onChangePagination,
      }}
      loading={loading}
    />;
};