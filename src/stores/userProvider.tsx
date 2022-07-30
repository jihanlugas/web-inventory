import { NextPage } from 'next';
import { createContext, useState } from 'react';


type Props = {
  children: React.ReactNode
}

type AppContextState = {
  email: string;
  username: string;
  fullname: string;
  userId: number;
  propertyId: number;
  propertyName: string;
}

const initUser = {
  email: '',
  username: '',
  fullname: '',
  userId: 0,
  propertyId: 0,
  propertyName: '',
};

type UserContextType = {
  user: AppContextState,
  setUser: (AppContextState) => void,
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: (state: AppContextState) => { },
});

export const UserContextProvider: NextPage<Props> = ({ children }) => {

  const [user, setUser] = useState<AppContextState>(null);

  const context = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
};


export default UserContext;