import Head from 'next/head';

type Props = {

}

const Index: React.FC<Props> = () => {
  return (
    <>
      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>
      <div>Index</div>
    </>
  );
};

export default Index;
