import Main from '@com/Layout/Main';
import { Api } from '@lib/Api';
import PageWithLayoutType from '@type/layout';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next/types';
import { ItemDetail } from '@type/item';
import Image from 'next/image';
import Link from 'next/link';
import { displayActive, displayDateTime } from '@utils/Formater';
import { CellProps, Column } from 'react-table';
import { useState, useEffect, PropsWithChildren, useContext } from 'react';
import { MdOutlineFilterList } from 'react-icons/md';
import { RiPencilLine } from 'react-icons/ri';
import Table from '@com/Table/Table';
import { ItemvariantPage } from '@type/itemvariant';
import { PageInfo, PageRequest } from '@type/pagination';
import { useMutation, useQuery } from 'react-query';
import { BiFilterAlt } from 'react-icons/bi';
import { IoAddOutline } from 'react-icons/io5';
import { VscTrash } from 'react-icons/vsc';
import ModalFilterItemVariant from '@com/Modal/ModalFilterItemVariant';
import NotifContext from '@stores/notifProvider';
import ModalDelete from '@com/Modal/ModalDelete';


type Props = {
  item: ItemDetail
}

type FilterProps = {
  itemId: number
  itemvariantName: string
  itemvariantDescription: string
}


const Index: NextPage<Props> = ({ item }) => {
  const { notif } = useContext(NotifContext);

  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [itemvariants, setItemvarians] = useState<ItemvariantPage[]>([]);
  const [deleteId, setDeleteId] = useState<number>(0);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });
  const [pageRequest, setPageRequest] = useState<PageRequest & FilterProps>({
    limit: 10,
    page: 1,
    itemId: item.itemId,
    itemvariantName: '',
    itemvariantDescription: '',
  });

  const column: Column[] = [
    {
      id: 'itemvariantName',
      Header: 'Name',
      accessor: 'itemvariantName',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <span className=''>
              {cell.row.original.itemvariantName}
            </span>
          </>
        );
      },
    },
    {
      id: 'itemvariantDescription',
      Header: 'Description',
      accessor: 'itemvariantDescription',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <span className=''>
              {cell.row.original.itemvariantDescription}
            </span>
          </>
        );
      },
    },
    {
      id: 'price',
      Header: 'Price',
      accessor: 'price',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <span className=''>
              {cell.row.original.price}
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
      id: 'itemvariantId',
      Header: '',
      Cell: (cell: PropsWithChildren<CellProps<any>>) => {
        return (
          <>
            <div className='flex justify-end'>
              <div className='mx-2'>
                <Link href={{ pathname: '/item/[itemId]/variant/[itemvariantId]/edit', query: { itemId: cell.row.original.itemId, itemvariantId: cell.row.original.itemvariantId } }}>
                  <a>
                    <div className='ml-2 px-2 duration-300 text-purple-400 hover:text-purple-500 '>
                      <RiPencilLine className='' size={'1.5rem'} />
                    </div>
                  </a>
                </Link>
              </div>
              <div className='mx-2'>
                <button className='ml-2 px-2 duration-300 text-purple-400 hover:text-purple-500 ' onClick={() => toogleDelete(cell.row.original.itemvariantId)}>
                  <VscTrash className='' size={'1.5rem'} />
                </button>
              </div>
            </div>
          </>
        );
      }
    }
  ];

  const { isLoading, data, refetch } = useQuery(['item', pageRequest], ({ queryKey }) => Api.post('/itemvariant/page', queryKey[1]), {});

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation((id: number) => Api.delete('/itemvariant/' + id));

  const toogleFilter = (resetData?: boolean) => {
    if (resetData) {
      setItemvarians([]);
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
      setItemvarians(data.payload.list);
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
        <title>{'Item - ' + item.itemName}</title>
      </Head>
      <div className='px-4'>
        <ModalFilterItemVariant
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
          </div>
        </ModalDelete>
        <div className='text-xl h-16 flex items-center border-b'>
          <div className='hidden md:flex'>
            <Link href={'/item'}>
              <a>
                <span className='mr-4 hover:text-purple-500'>{'Item'}</span>
              </a>
            </Link>
            <span className='mr-4'>{'>'}</span>
            <span className='mr-4'>{item.itemName}</span>
          </div>
          <div className='flex md:hidden'>
            <Link href={'/item'}>
              <a>
                <span className='mr-4'>{'<'}</span>
              </a>
            </Link>
            <span className='mr-4'>{item.itemName}</span>
          </div>
        </div>
        <div className='pt-4 w-full max-w-xl'>
          <div className='relative w-24 h-24 border-2 rounded bg-gray-50'>
            <Image src={item.photoUrl === '' ? process.env.DEFAULT_IMAGE : item.photoUrl} alt={item.itemName} layout={'fill'} />
          </div>
          <div className='pt-4'>
            <div className='mb-2'>
              <div className='text-gray-500'>{'Item Name'}</div>
              <div>{item.itemName}</div>
            </div>
            <div className='mb-2'>
              <div className='text-gray-500'>{'Item Description'}</div>
              <div>{item.itemDescription}</div>
            </div>
            <div className='mb-2'>
              <div className='text-gray-500'>{'Status'}</div>
              <div>{displayActive(item.isActive)}</div>
            </div>
            <div className='mb-2'>
              <div className='text-gray-500'>{'Create Date'}</div>
              <div>{displayDateTime(item.createDt)}</div>
            </div>
          </div>
        </div>
        <div className='pt-4'>
          <div className='bg-white w-full shadow rounded-sm'>
            <div className='flex justify-between items-center px-3 h-16'>
              <div>
                <div className='text-xl'>{'Item Variant'}</div>
              </div>
              <div className='flex'>
                <div>
                  <button className='h-12 w-12 flex justify-center items-center rounded-full' onClick={() => toogleFilter()}>
                    <BiFilterAlt className='' size={'1.5em'} />
                  </button>
                </div>
                <div>
                  <Link href={{ pathname: '/item/[itemId]/variant/new', query: { itemId: item.itemId } }}>
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
                data={itemvariants}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { itemId } = context.query;
  const data = await Api.get('/item/' + itemId).then(res => res);

  if (data.success) {
    return {
      props: {
        item: data.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Index;