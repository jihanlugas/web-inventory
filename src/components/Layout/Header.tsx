import { Api } from '@lib/Api';
import NotifContext from '@stores/notifProvider';
import UserContext from '@stores/userProvider';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { BsList } from 'react-icons/bs';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { getInitialWord } from '@utils/Helper';

interface Props {
  sidebar: boolean,
  setSidebar: (sidebar: boolean) => void,
}

const Header: React.FC<Props> = ({ sidebar, setSidebar }) => {

  const refProfile = useRef<HTMLDivElement>();
  const [profileBar, setProfileBar] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { notif } = useContext(NotifContext);
  const router = useRouter();


  const { mutate } = useMutation(() => Api.get('/sign-out'));

  const handleLogout = () => {
    mutate(null, {
      onSuccess: (res) => {
        setUser(null);
        router.push('/sign-in');
        notif.success('Logout Successfully');
      },
      onError: (res) => {
        notif.error('Please cek you connection');
      }
    });
  };

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (profileBar && refProfile.current && !refProfile.current.contains(e.target)) {
        setProfileBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [profileBar]);


  return (
    <>
      <header>
        <div className="fixed h-16 w-full flex justify-between items-center shadow bg-purple-50 z-40">
          <div className="p-2 flex items-center">
            <button className="p-2 rounded-full duration-300 hover:bg-purple-100" onClick={() => setSidebar(!sidebar)}>
              <BsList className="" size={'1.5em'} />
            </button>
            <div className="text-xl px-2">{process.env.APP_NAME}</div>
          </div>
          {user && (
            <div className="relative inline-block text-left p-2" ref={refProfile}>
              <div className="flex items-center">
                <div className="hidden md:block mx-2">{user.fullname}</div>
                <button className="mx-2 h-10 w-10 bg-gray-700 rounded-full text-gray-100 flex justify-center items-center text-xl" onClick={() => setProfileBar(!profileBar)}>
                  {getInitialWord(user.fullname)}
                </button>
              </div>
              <div className={`absolute right-4 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none duration-300 ease-in-out ${!profileBar && 'scale-0 shadow-none ring-0'}`}>
                <div className="" role="none">
                  <a href="#" className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-purple-100 hover:text-gray-700'}>{'Account'}</a>
                  <a href="#" className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-purple-100 hover:text-gray-700'}>{'Support'}</a>
                  <a href="#" className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-purple-100 hover:text-gray-700'}>{'Settings'}</a>
                  <hr />
                  <button onClick={handleLogout} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-purple-100 hover:text-gray-700 w-full text-left'}>
                    {'Sign Out'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
