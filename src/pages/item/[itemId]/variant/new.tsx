import TextField from '@com/Formik/TextField';
import Main from '@com/Layout/Main';
import { Api } from '@lib/Api';
import { ItemDetail } from '@type/item';
import { ItemvariantCreate } from '@type/itemvariant';
import PageWithLayoutType from '@type/layout';
import { Form, Formik, FormikValues, FieldArray, FastField } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { VALIDATION_ALLOWED_FILE_TYPE, VALIDATION_MAX_FILE_SIZE } from '@utils/Constant';
import ButtonSubmit from '@com/Formik/ButtonSubmit';
import TextAreaField from '@com/Formik/TextAreaField';
import CheckBox from '@com/Formik/CheckBox';
import ImageField from '@com/Formik/ImageField';
import { useMutation } from 'react-query';
import { useContext } from 'react';
import NotifContext from '@stores/notifProvider';



type Props = {
  item: ItemDetail
}

const schema = Yup.object().shape({
  itemvariantName: Yup.string().label('Item variant name').required(),
  itemvariantDescription: Yup.string().label('Item variant description'),
  price: Yup.number().label('Price'),
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

const New: NextPage<Props> = ({ item }) => {

  const router = useRouter();
  const { notif } = useContext(NotifContext);

  const initFormikValue: ItemvariantCreate = {
    itemvariantId: 0,
    itemId: item.itemId,
    itemvariantName: '',
    itemvariantDescription: '',
    price: 0,
    isActive: true,
    photo: null,
  };

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.postimage('/itemvariant', val));

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.success) {
            notif.success(res.message);
            router.push({ pathname: '/item/[itemId]', query: { itemId: item.itemId } });
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
        <title>{item.itemName + ' - New Variant'}</title>
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
            <Link href={{ pathname: '/item/[itemId]', query: { itemId: item.itemId } }}>
              <a>
                <span className='mr-4 hover:text-purple-500'>{item.itemName}</span>
              </a>
            </Link>
            <span className='mr-4'>{'>'}</span>
            <span className='mr-4'>{'New Variant'}</span>
          </div>
          <div className='flex md:hidden'>
            <Link href={{ pathname: '/item/[itemId]', query: { itemId: item.itemId } }}>
              <a>
                <span className='mr-4'>{'<'}</span>
              </a>
            </Link>
            <span className='mr-4'>{'New Variant'}</span>
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
                        label={'Item variant name'}
                        name={'itemvariantName'}
                        type={'text'}
                        placeholder={'Item variant name'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Item variant description'}
                        name={'itemvariantDescription'}
                        type={'text'}
                        placeholder={'Item variant description'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Price'}
                        name={'price'}
                        type={'text'}
                        placeholder={'Price'}
                        required
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { itemId } = context.query;
  const data = await Api.get('/item/' + itemId).then(res => res);

  if (data.success) {
    return {
      props: {
        item: data.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default New;