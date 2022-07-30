import Main from '@com/Layout/Main';
import { Api } from '@lib/Api';
import NotifContext from '@stores/notifProvider';
import { ItemDetail } from '@type/item';
import { ItemvariantDetail, ItemvariantEdit } from '@type/itemvariant';
import PageWithLayoutType from '@type/layout';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next/types';
import { useContext } from 'react';
import * as Yup from 'yup';
import { VALIDATION_ALLOWED_FILE_TYPE, VALIDATION_MAX_FILE_SIZE } from '@utils/Constant';
import { Form, Formik, FormikValues } from 'formik';
import TextField from '@com/Formik/TextField';
import TextAreaField from '@com/Formik/TextAreaField';
import CheckBox from '@com/Formik/CheckBox';
import ImageField from '@com/Formik/ImageField';
import ButtonSubmit from '@com/Formik/ButtonSubmit';
import { useMutation } from 'react-query';


type Props = {
  itemvariant: ItemvariantDetail
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

const Edit: NextPage<Props> = ({ itemvariant, item }) => {

  const router = useRouter();
  const { notif } = useContext(NotifContext);

  const initFormikValue: ItemvariantEdit = {
    itemvariantName: itemvariant.itemvariantName,
    itemvariantDescription: itemvariant.itemvariantDescription,
    price: itemvariant.price,
    isActive: itemvariant.isActive,
    photo: null,
    photoUrl: itemvariant.photoUrl,
  };

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.putimage('/itemvariant/' + itemvariant.itemvariantId, val));

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
        <title>{item.itemName + ' - ' + itemvariant.itemvariantName + ' - Edit'}</title>
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
            <span className='mr-4'>{itemvariant.itemvariantName}</span>
          </div>
          <div className='flex md:hidden'>
            <Link href={'/item'}>
              <a>
                <span className='mr-4'>{'<'}</span>
              </a>
            </Link>
            <span className='mr-4'>{itemvariant.itemvariantName}</span>
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
                        photoUrl={values.photoUrl}
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


(Edit as PageWithLayoutType).layout = Main;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { itemId, itemvariantId } = context.query;
  const dataItemvariant = await Api.get('/itemvariant/' + itemvariantId).then(res => res);
  const dataItem = await Api.get('/item/' + itemId).then(res => res);

  if (dataItem.success && dataItemvariant.success) {
    return {
      props: {
        itemvariant: dataItemvariant.payload,
        item: dataItem.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Edit;