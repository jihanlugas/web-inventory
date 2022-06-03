import { NextPage } from 'next/types';


type Props = {
  children: React.ReactNode
}

const Main: NextPage<Props> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default Main;