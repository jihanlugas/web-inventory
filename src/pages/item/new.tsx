import TextField from '@com/Formik/TextField';
import Main from '@com/Layout/Main';
import PageWithLayoutType from '@type/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlinePlus } from 'react-icons/ai';
import { CgChevronRight } from 'react-icons/cg';
import { Form, Formik, FormikValues, FieldArray, FastField } from 'formik';
import * as Yup from 'yup';
import { Api } from '@lib/Api';
import { useMutation } from 'react-query';
import ButtonSubmit from '@com/Formik/ButtonSubmit';
import TextAreaField from '@com/Formik/TextAreaField';
import CheckBox from '@com/Formik/CheckBox';
import React, { useContext } from 'react';
import NotifContext from '@stores/notifProvider';
import ImageField from '@com/Formik/ImageField';
import { VALIDATION_ALLOWED_FILE_TYPE, VALIDATION_MAX_FILE_SIZE } from '@utils/Constant';
import { ItemCreate } from '@type/item';


type Props = {
}

const schema = Yup.object().shape({
  itemName: Yup.string().label('Item name').required(),
  itemDescription: Yup.string().label('Item description'),
  isActive: Yup.boolean().label('Active'),
  photo: Yup.mixed()
    .test('fileType', 'Unsupported format file ', (value) => {
      if (value) {
        return VALIDATION_ALLOWED_FILE_TYPE.includes(value.type);
      } else {
        return true;
      }
    })
    .test('fileSize', 'File size is too large', (value) => {
      if (value) {
        return value.size <= VALIDATION_MAX_FILE_SIZE;
      } else {
        return true;
      }
    })
    .label('Photo'),
});

const New: NextPage<Props> = () => {

  const router = useRouter();
  const { notif } = useContext(NotifContext);

  const initFormikValue: ItemCreate = {
    itemName: '',
    itemDescription: '',
    isActive: true,
    photo: null,
  };

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.postimage('/item/create', val));

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.success) {
            notif.success(res.message);
            router.push('/item');
          } else if (!res.success) {
            if (res.payload && res.payload.listError) {
              setErrors(res.payload.listError);
            } else {
              notif.error(res.message);
            }
          }
        }
      },
      onError: (res) => {
        notif.error('Please cek you connection');
      },
    });
  };


  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Item New'}</title>
      </Head>
      <div className='px-4'>
        <div className='text-xl h-16 flex items-center border-b'>
          <div className='hidden md:flex'>
            <Link href={'/item'}>
              <a>
                <span className='mr-4 hover:text-purple-500'>{'Item'}</span>
              </a>
            </Link>
            <span className='mr-4'>{'>'}</span>
            <span className='mr-4'>{'New'}</span>
          </div>
          <div className='flex md:hidden'>
            <Link href={'/item'}>
              <a>
                <span className='mr-4'>{'<'}</span>
              </a>
            </Link>
            <span className='mr-4'>{'New'}</span>
          </div>
        </div>
        <div className='pt-4'>
          <Formik
            initialValues={initFormikValue}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
          >
            {({ values, errors }) => {
              return (
                <Form encType='multipart/form-data'>
                  <div className={'w-full max-w-xl'}>
                    <div className="mb-4">
                      <TextField
                        label={'Item name'}
                        name={'itemName'}
                        type={'text'}
                        placeholder={'Item name'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Item description'}
                        name={'itemDescription'}
                        type={'text'}
                        placeholder={'Item description'}
                      />
                    </div>
                    <div className="mb-4">
                      <CheckBox
                        label={'Active'}
                        name={'isActive'}
                        id={'is-active'}
                      />
                    </div>
                    <div className={'mb-4'}>
                      <ImageField
                        name='photo'
                        label={'Image'}
                      />
                    </div>
                    <div className={'mb-4'}>
                      <ButtonSubmit
                        label={'Save'}
                        disabled={isLoading}
                        loading={isLoading}
                      />
                    </div>
                  </div>
                  <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                    {JSON.stringify(values, null, 4)}
                  </div>
                  <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                    {JSON.stringify(errors, null, 4)}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

(New as PageWithLayoutType).layout = Main;

export default New;