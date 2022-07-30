import TextField from '@com/Formik/TextField';
import Modal from '@com/Modal/Modal';
import { Formik, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import ButtonSubmit from '@com/Formik/ButtonSubmit';
import { PageRequest } from '@type/pagination';
import { Dispatch, SetStateAction } from 'react';


type Props = {
  show: boolean;
  onClickOverlay: Function;
  onDelete: Function;
  isLoading?: boolean;
  children: React.ReactNode;
}

const ModalDelete: React.FC<Props> = ({ show, onClickOverlay, onDelete, isLoading = false, children }) => {

  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4 border-b pb-4'}>
            <span>Delete</span>
          </div>
          <div className={'mb-4'}>
            {children}
          </div>
          <div className={'flex justify-end'}>
            <button className='px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed duration-300 rounded-md mr-4 ' onClick={() => onClickOverlay()} disabled={isLoading}>
              Cancel
            </button>
            <button className='px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed duration-300 rounded-md text-gray-50 font-semibold' onClick={() => onDelete()} disabled={isLoading}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalDelete;