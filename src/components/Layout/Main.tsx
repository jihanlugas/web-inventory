import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@com/Layout/Header';
import Sidebar from '@com/Layout/Sidebar';
import { Api } from '@lib/Api';
import { useMutation } from 'react-query';
import UserContext from '@stores/userProvider';
import { useRouter } from 'next/router';

type Props = {
  children: React.ReactNode
}

const Main: React.FC<Props> = ({ children }) => {
  const [sidebar, setSidebar] = useState<boolean>(true);

  const router = useRouter();
  const { data, mutate, isLoading } = useMutation(() => Api.get('/me'));
  const { user, setUser } = useContext(UserContext);

  const onClickOverlay = (isShow: boolean) => {
    if (isShow === undefined) {
      setSidebar(!sidebar);
    } else {
      setSidebar(isShow);
    }
  };

  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
    if (user === null) {
      mutate(null, {
        onSuccess: (res) => {
          if (res) {
            if (res.success) {
              setUser(res.payload);
            } else {
              router.push('/sign-in');
            }
          }
        },
        onError: () => {
          router.push('/sign-in');
        }
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="theme-color" content={'currentColor'} />
      </Head>
      <main className={''}>
        <Header sidebar={sidebar} setSidebar={setSidebar} />
        <Sidebar sidebar={sidebar} onClickOverlay={onClickOverlay} />
        <div className={`hidden md:block duration-300 ease-in-out pt-16  ${sidebar ? 'ml-60' : 'ml-0'}`}>
          <div className="mainContent">
            {children}
          </div>
        </div>
        <div className={'block md:hidden pt-16 overflow-y-auto'}>
          <div className="mainContent">
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;