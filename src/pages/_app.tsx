import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { NextPage } from 'next/types';
import PageWithLayoutType from 'src/types/layout';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NotifContextProvider } from '@stores/notifProvider';


type AppLayoutProps = {
  Component: PageWithLayoutType
  pageProps: any
}


const MyApp: NextPage<AppLayoutProps> = ({ Component, pageProps }) => {

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>
      <NotifContextProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </NotifContextProvider>
    </>
  );
};

export default MyApp;
