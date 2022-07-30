import React, { useEffect } from 'react';
import { BiAbacus, BiAlarm, BiUser } from 'react-icons/bi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsList } from 'react-icons/bs';

interface Props {
  sidebar: boolean,
  onClickOverlay: (boolean?) => void,
}

const icons = {
  BiAbacus,
  BiAlarm,
  BiUser,
};

const menus = [
  {
    name: 'Overview',
    icon: 'BiAbacus',
    path: '/overview',
  },
  {
    name: 'Item',
    icon: 'BiUser',
    path: '/item',
  },
];

const Sidebar: React.FC<Props> = ({ sidebar, onClickOverlay }) => {

  const router = useRouter();

  useEffect(() => {
    onClickOverlay(true);
  }, [router.pathname]);


  const Menu = ({ name, icon, path }) => {
    const isSelected = router.pathname.indexOf(path) !== -1;

    const Icon = (props: any) => {
      const { icon } = props;
      const TheIcon = icons[icon];

      return <TheIcon {...props} />;
    };

    return (
      <Link href={path}>
        <a>
          <div className={isSelected ? 'flex items-center px-4 h-12 bg-purple-200 duration-300 ease-in-out rounded-r-full' : 'flex items-center px-4 h-12 hover:bg-purple-100 duration-300 ease-in-out rounded-r-full'}>
            <Icon icon={icon} className={`mr-2 ${isSelected ? 'text-gray-700' : 'text-gray-600'}`} size={'1.5em'} />
            <div className={` ${isSelected ? 'text-gray-700' : 'text-gray-600'}`}>{name}</div>
          </div>
        </a>
      </Link>
    );
  };


  return (
    <>
      <nav>
        <div className={`hidden md:block fixed duration-300 ease-in-out top-16 w-60 h-full overflow-y-auto ${sidebar ? 'ml-0' : '-ml-60'}`}>
          <div className='mainContent py-2'>
            {menus.map((menu, key) => {
              return (
                <Menu key={key} name={menu.name} icon={menu.icon} path={menu.path} />
              );
            })}
          </div>
        </div>
        <div className='block md:hidden z-20 fixed'>
          <div className={`fixed ${!sidebar && 'inset-0'}`} onClick={() => onClickOverlay()} aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className={`fixed bg-purple-50 h-screen flex w-80 duration-300 ${sidebar ? '-left-80' : 'left-0'}`}>
            <div className='w-full'>
              <div className='flex items-center h-16 shadow px-2'>
                <button className='p-2 rounded-full duration-300 hover:bg-purple-100' onClick={() => onClickOverlay()}>
                  <BsList className='' size={'1.5em'} />
                </button>
                <div className='p-2 text-xl'>{process.env.APP_NAME}</div>
              </div>
              <div className='mainContent py-2'>
                {menus.map((menu, key) => {
                  return (
                    <Menu key={key} name={menu.name} icon={menu.icon} path={menu.path} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
