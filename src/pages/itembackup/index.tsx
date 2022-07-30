import Main from '@com/Layout/Main';
import { Api } from '@lib/Api';
import { Item } from '@type/data';
import PageWithLayoutType from '@type/layout';
import { PageInfo, PageRequest } from '@type/pagination';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiFilterAlt } from 'react-icons/bi';
import { useQuery, useInfiniteQuery } from 'react-query';
import ModalFilterItem from '@com/Modal/ModalFilterItem';

type Props = {

}

type FilterProps = {
  itemName: string
  itemDescription: string
}

const Index: NextPage<Props> = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageRequest & FilterProps>({
    limit: 24,
    page: 1,
    itemName: '',
    itemDescription: '',
  });

  const { isLoading, data } = useQuery(['item', pageRequest], ({ queryKey }) => Api.postimage('/item', queryKey[1]), {});

  const toogleModal = (resetData?: boolean) => {
    if (resetData) {
      setItems([]);
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (data && data.success) {
      setItems([...items, ...data.payload.list]);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
        console.log('loadMore');
        if (pageRequest.page < pageInfo.pageCount) {
          setPageRequest({ ...pageRequest, limit: pageRequest.limit, page: pageRequest.page + 1 });
        }
      }
    };

    document.addEventListener('scroll', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('scroll', checkIfClickedOutside);
    };
  }, [pageRequest, pageInfo]);


  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Item'}</title>
      </Head>
      <div className='px-4'>
        <ModalFilterItem onClickOverlay={toogleModal} show={showModal} pageRequest={pageRequest} setPageRequest={setPageRequest} />
        <div className='text-xl h-16 flex items-center border-b'>Item</div>
        <div className='pt-4 flex justify-end'>
          <div>
            <button onClick={() => toogleModal()} className='flex justify-center items-center duration-300 text-purple-400 hover:text-purple-500 h-8 rounded-sm font-semibold px-2 w-full'>
              <BiFilterAlt className='mr-2' size={'1.5rem'} />
              <span className=''>{'Filter'}</span>
            </button>
          </div>
          <Link href={{ pathname: '/item/new' }}>
            <a>
              <div className='flex justify-center items-center duration-300 text-purple-400 hover:text-purple-500 h-8 rounded-sm font-semibold px-2 w-full'>
                <IoAddOutline className='mr-2' size={'1.5rem'} />
                <span className=''>{'New'}</span>
              </div>
            </a>
          </Link>
        </div>
        <div className='pt-4 mb-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4'>
            {items.map((data, key) => {
              return (
                <div className='shadow-lg rounded-lg' key={key}>
                  <div className='bg-red-400 h-48 relative'>
                    {data.photoUrl !== '' && (
                      <Image src={data.photoUrl} alt={data.itemName} layout={'fill'} objectFit={'cover'} />
                    )}
                  </div>
                  <div className='p-2'>
                    <div className=''>{data.itemId}</div>
                    <div className=''>{data.itemName}</div>
                    <div className='text-sm'>{data.itemDescription ? data.itemDescription : '-'}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {isLoading && (
            <div className='pt-4 '>
              <div className='flex justify-center items-center p-4'>
                <AiOutlineLoading size={'4rem'} className={'animate-spin'} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = Main;

export default Index;