import { useTable, usePagination } from 'react-table';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { CgPushChevronRight, CgPushChevronLeft, CgChevronRight, CgChevronLeft } from 'react-icons/cg';
import { PageInfo, PageRequest } from '@type/pagination';

type Props = {
  columns: any[],
  data: any[],
  pageRequest: PageRequest & any,
  setPageRequest: Dispatch<SetStateAction<PageRequest & any>>,
  pageInfo: PageInfo,
  isLoading: boolean,
}

const Table: React.FC<Props> = ({ columns, data, setPageRequest, pageRequest, pageInfo, isLoading }) => {

  const dataMemo = useMemo(() => data, [data]);
  const columnsMemo = useMemo(() => columns, []);

  const refRows = useRef<HTMLDivElement>();
  const [rowsBar, setRowsBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (rowsBar && refRows.current && !refRows.current.contains(e.target)) {
        setRowsBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [rowsBar]);

  const instance = useTable(
    {
      columns: columnsMemo,
      data: dataMemo,
      // manualPagination: true,
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    state,
  } = instance;

  const handleChangeLimit = (limit: number) => {
    setPageRequest({ ...pageRequest, limit, page: 1 });
    setRowsBar(!rowsBar);
  };


  return (
    <>
      <table className='w-full table-auto text-sm' {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr key={key} className='border-b border-t text-left' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, key) => (
                <th key={key} className='py-4 px-3 font-normal text-gray-800 whitespace-nowrap' {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {isLoading ? (
            <>
              {[0, 1, 2, 3, 4].map(key => (
                <React.Fragment key={key}>
                  {headerGroups.map((headerGroup, key) => (
                    <tr key={key} className='border-b text-left' {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, key) => (
                        <td key={key} className='py-4 px-3 font-normal whitespace-nowrap animate-pulse' {...column.getHeaderProps()}>
                          <div className='h-3 w-full bg-slate-200 rounded-full'></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {rows.map((row, key) => {
                prepareRow(row);
                return (
                  <tr key={key} className='border-b duration-300 align-top hover:bg-gray-100' {...row.getRowProps()}>
                    {row.cells.map((cell, key) => {
                      return (
                        <td className='p-3' key={key} {...cell.getCellProps()} >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          )}

        </tbody>
      </table>
      <div className='flex items-center justify-end p-2'>
        <div className='relative ml-4' ref={refRows}>
          <div className='flex items-center'>
            <div className='mr-2'>{'Rows per page: '}</div>
            <button className='w-10 flex justify-center hover:bg-gray-100' onClick={() => setRowsBar(!rowsBar)}>
              {pageRequest.limit}
            </button>
          </div>
          <div className={`absolute -top-8 right-0 mt-2 w-12 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-2 duration-300 ease-in-out ${!rowsBar && 'scale-0 shadow-none ring-0'}`}>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(10)}>{'10'}</button>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(25)}>{'25'}</button>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(50)}>{'50'}</button>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(100)}>{'100'}</button>
          </div>
          {/* <div className={`${rowsBar ? 'absolute -top-8 right-0 mt-2 w-12 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-2' : 'hidden'}`}>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(10) }>{'10'}</button>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(25) }>{'25'}</button>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(50) }>{'50'}</button>
            <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(100) }>{'100'}</button>
          </div> */}
        </div>
        <div className='w-32 flex justify-center ml-4'>
          <span>{pageInfo.totalData > 0 ? ((pageInfo.page - 1) * pageInfo.pageSize) + 1 : 0}</span>
          <span className='mx-1'>{'-'}</span>
          <span>{pageInfo.page * pageInfo.pageSize < pageInfo.totalData ? pageInfo.page * pageInfo.pageSize : pageInfo.totalData}</span>
          <span className='mx-1'>{'of'}</span>
          <span>{pageInfo.totalData}</span>
        </div>
        <div className='flex items-center ml-4'>
          <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page <= 1} onClick={() => setPageRequest({ ...pageRequest, page: 1 })}>
            <CgPushChevronLeft size={'1.5rem'} className={''} />
          </button>
          <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page <= 1} onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page - 1 })}>
            <CgChevronLeft size={'1.5rem'} className={''} />
          </button>
          <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page >= pageInfo.pageCount} onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page + 1 })}>
            <CgChevronRight size={'1.5rem'} className={''} />
          </button>
          <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page >= pageInfo.pageCount} onClick={() => setPageRequest({ ...pageRequest, page: pageInfo.pageCount })}>
            <CgPushChevronRight size={'1.5rem'} className={''} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;