import Main from '@com/Layout/Main';
import PageWithLayoutType from '@type/layout';
import { NextPage } from 'next';
import Head from 'next/head';


type Props = {

}

const Index: NextPage<Props> = () => {
  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Overview'}</title>
      </Head>
      <div className='px-4'>
        <div className='text-xl h-16 flex items-center border-b'>Overview</div>
        <div className='pt-4'>
          <div className=''>Content</div>
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = Main;

export default Index;