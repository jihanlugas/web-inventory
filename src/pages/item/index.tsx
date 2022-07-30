import Main from '@com/Layout/Main';
import { Api } from '@lib/Api';
import { ItemPage } from '@type/item';
import PageWithLayoutType from '@type/layout';
import { PageInfo, PageRequest } from '@type/pagination';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, PropsWithChildren, useContext } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { VscTrash } from 'react-icons/vsc';
import { BiFilterAlt } from 'react-icons/bi';
import { useQuery, useInfiniteQuery, useMutation } from 'react-query';
import ModalFilterItem from '@com/Modal/ModalFilterItem';
import ModalDelete from '@com/Modal/ModalDelete';
import { CellProps, Column } from 'react-table';
import { MdOutlineFilterList } from 'react-icons/md';
import Table from '@com/Table/Table';
import { RiPencilLine } from 'react-icons/ri';
import { displayActive } from '@utils/Formater';
import NotifContext from '@stores/notifProvider';


type Props = {

}

type FilterProps = {
  itemName: string
  itemDescription: string
}


const Index: NextPage<Props> = () => {
  const { notif } = useContext(NotifContext);

  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [items, setItems] = useState<ItemPage[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageRequest & FilterProps>({
    limit: 10,
    page: 1,
    itemName: '',
    itemDescription: '',
  });

  const column: Column[] = [
    {
      id: 'itemName',
      Header: 'Name',
      accessor: 'itemName',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <span className=''>
              {cell.row.original.itemName}
            </span>
          </>
        );
      },
    },
    {
      id: 'itemDescription',
      Header: 'Description',
      accessor: 'itemDescription',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <span className=''>
              {cell.row.original.itemDescription}
            </span>
          </>
        );
      },
    },
    {
      id: 'isActive',
      Header: 'Status',
      accessor: 'isActive',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <span className=''>
              {displayActive(cell.row.original.isActive)}
            </span>
          </>
        );
      },
    },
    {
      id: 'itemId',
      Header: '',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <div className='flex justify-end'>
              <div className='mx-2'>
                <Link href={{ pathname: '/item/[itemId]', query: { itemId: cell.row.original.itemId } }}>
                  <a>
                    <div className='ml-2 px-2 duration-300 text-purple-400 hover:text-purple-500 '>
                      <MdOutlineFilterList className='' size={'1.5rem'} />
                    </div>
                  </a>
                </Link>
              </div>
              <div className='mx-2'>
                <Link href={{ pathname: '/item/[itemId]/edit', query: { itemId: cell.row.original.itemId } }}>
                  <a>
                    <div className='ml-2 px-2 duration-300 text-purple-400 hover:text-purple-500 '>
                      <RiPencilLine className='' size={'1.5rem'} />
                    </div>
                  </a>
                </Link>
              </div>
              <div className='mx-2'>
                <button className='ml-2 px-2 duration-300 text-purple-400 hover:text-purple-500 ' onClick={() => toogleDelete(cell.row.original.itemId)}>
                  <VscTrash className='' size={'1.5rem'} />
                </button>
              </div>
            </div>
          </>
        );
      }
    }
  ];

  const { isLoading, data, refetch } = useQuery(['item', pageRequest], ({ queryKey }) => Api.post('/item/page', queryKey[1]), {});

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation((id: number) => Api.delete('/item/' + id));

  const toogleFilter = (resetData?: boolean) => {
    if (resetData) {
      setItems([]);
    }
    setShowModalFilter(!showModalFilter);
  };

  const toogleDelete = (id = 0) => {
    setDeleteId(id);
    setShowModalDelete(!showModalDelete);
  };

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: (res) => {
        if (res) {
          if (res.success) {
            notif.success(res.message);
            setDeleteId(0);
            toogleDelete(0);
            refetch();
          } else if (!res.success) {
            notif.error(res.message);
          }
        }

      },
      onError: (res) => {
        notif.error('Please cek you connection');
      },
    });
  };

  useEffect(() => {
    if (data && data.success) {
      setItems(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);


  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Item'}</title>
      </Head>
      <div className='px-4'>
        <ModalFilterItem
          onClickOverlay={toogleFilter}
          show={showModalFilter}
          pageRequest={pageRequest}
          setPageRequest={setPageRequest}
        />
        <ModalDelete
          onClickOverlay={toogleDelete}
          show={showModalDelete}
          onDelete={handleDelete}
          isLoading={isLoadingDelete}
        >
          <div>
            <div className='mb-4'>Apakah anda yakin ?</div>
            <div className='text-sm mb-4 text-gray-700'>Dengan menghapus item ini maka item variant yang ada pada item ini akan turut di hapus</div>
          </div>
        </ModalDelete>
        <div className='text-xl h-16 flex items-center border-b'>Item</div>
        <div className='pt-4'>
          <div className='bg-white w-full shadow rounded-sm'>
            <div className='flex justify-between items-center px-3 h-16'>
              <div>
                <div className='text-xl'>{ }</div>
              </div>
              <div className='flex'>
                <div>
                  <button className='h-12 w-12 flex justify-center items-center rounded-full' onClick={() => toogleFilter()}>
                    <BiFilterAlt className='' size={'1.5em'} />
                  </button>
                </div>
                <div>
                  <Link href={{ pathname: '/item/new' }}>
                    <a>
                      <div className='h-12 w-12 flex justify-center items-center rounded-full'>
                        <IoAddOutline className='mr-2' size={'1.5rem'} />
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className='mb-16'>
              <Table
                columns={column}
                data={items}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = Main;

export default Index;