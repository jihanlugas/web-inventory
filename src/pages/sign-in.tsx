import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

type Props = {

}

const SingIn: NextPage<Props> = () => {
  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Sign In'}</title>
        <meta name="theme-color" content={'#FAF5FF'} />
      </Head>
      <div className={'h-screen w-screen bg-purple-50 flex justify-center items-center -mt-16'}>
        <div className={'px-4 w-full max-w-md'}>
          <div className={'w-full bg-white rounded-lg shadow p-4 mb-2'}>

          </div>
          <div className={'flex'}>
            <div className={'mr-1'}>
              {'Don\'t have an account yet?'}
            </div>
            <Link href={'/sign-up'} passHref>
              <a className={'text-purple-500'}>
                <div>Register Now</div>
              </a>
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default SingIn;