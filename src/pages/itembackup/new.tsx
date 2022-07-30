import TextField from '@com/Formik/TextField';
import Main from '@com/Layout/Main';
import PageWithLayoutType from '@type/layout';
import { NextPage } from 'next';
import Head from 'next/head';
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


type Props = {
}

type Itemvariant = {
  itemvariantId: number
  itemvariantName: string
  itemvariantDescription: string
  price: number
  isActive: boolean
  photo?: File
}

type Item = {
  itemId: number
  itemName: string
  itemDescription: string
  isActive: boolean
  photo?: File
  listItemvariant: Itemvariant[]
}

const schema = Yup.object().shape({
  // itemName: Yup.string().label('Item name').required(),
  // itemDescription: Yup.string().label('Item description'),
  // isActive: Yup.boolean().label('Active'),
  // photo: Yup.mixed()
  //   .test('fileType', 'Unsupported format file ', (value) => {
  //     if (value) {
  //       return VALIDATION_ALLOWED_FILE_TYPE.includes(value.type);
  //     } else {
  //       return true;
  //     }
  //   })
  //   .test('fileSize', 'File size is too large', (value) => {
  //     if (value) {
  //       return value.size <= VALIDATION_MAX_FILE_SIZE;
  //     } else {
  //       return true;
  //     }
  //   })
  //   .label('Photo'),
  // listItemvariant: Yup.array().of(
  //   Yup.object().shape({
  //     itemvariantName: Yup.string().label('Item variant name').required(),
  //     itemvariantDescription: Yup.string().label('Item variant description'),
  //     price: Yup.number().label('Price').required(),
  //     isActive: Yup.boolean().label('Active'),
  //     photo: Yup.mixed()
  //       .test('fileType', 'Unsupported format file ', (value) => {
  //         if (value) {
  //           return VALIDATION_ALLOWED_FILE_TYPE.includes(value.type);
  //         } else {
  //           return true;
  //         }
  //       })
  //       .test('fileSize', 'File size is too large', (value) => {
  //         if (value) {
  //           return value.size <= VALIDATION_MAX_FILE_SIZE;
  //         } else {
  //           return true;
  //         }
  //       })
  //       .label('Photo'),
  //   })
  // )
});

const New: NextPage<Props> = () => {

  const router = useRouter();
  const { notif } = useContext(NotifContext);

  const initFormikValueVariant: Itemvariant = {
    itemvariantId: 0,
    itemvariantName: '',
    itemvariantDescription: '',
    price: 0,
    isActive: true,
    photo: null,
  };

  const initFormikValue: Item = {
    itemId: 0,
    itemName: '',
    itemDescription: '',
    isActive: true,
    photo: null,
    // listItemvariant: [initFormikValueVariant]
    listItemvariant: []
  };

  const { data: dataSubmit, mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.postimage('/item/create', val));


  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.success) {
            notif.success(res.message);
            // router.push('/item');
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
          <button type='button' className='' onClick={() => router.push({ pathname: '/item' })}>{'Item'}</button>
          <CgChevronRight className='mx-2' />
          <span className='' >{'New'}</span>
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
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className={'w-full p-2'}>
                      <div className='text-xl'>
                        Item
                      </div>
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
                    </div>
                    <div className={'w-full p-2'}>
                      <div className={'mb-4'}>
                        <FieldArray
                          name={'listItemvariant'}
                          render={arrayHelpers => (
                            <>
                              <div className=''>
                                <div className='text-xl'>
                                  Item Variant
                                </div>
                                <div className={'flex justify-end px-2 mb-2'}>
                                  <div className={'flex items-center'} onClick={() => arrayHelpers.push(initFormikValueVariant)}>
                                    <AiOutlinePlus className={'mr-2'} size={'1em'} />
                                    <div>Add</div>
                                  </div>
                                </div>
                                {values.listItemvariant.map((data, key) => {
                                  return (
                                    <div key={key} className={''}>
                                      <div className="mb-4">
                                        <TextField
                                          label={'Item variant name'}
                                          name={`listItemvariant.${key}.itemvariantName`}
                                          type={'text'}
                                          placeholder={'Item variant name'}
                                          required
                                        />
                                      </div>
                                      <div className="mb-4">
                                        <TextAreaField
                                          label={'Item variant description'}
                                          name={`listItemvariant.${key}.itemvariantDescription`}
                                          type={'text'}
                                          placeholder={'Item variant description'}
                                        />
                                      </div>
                                      <div className="mb-4">
                                        <TextField
                                          label={'Price'}
                                          name={`listItemvariant.${key}.price`}
                                          type={'number'}
                                          placeholder={'Price'}
                                          required
                                        />
                                      </div>
                                      <div className="mb-4">
                                        <CheckBox
                                          label={'Active'}
                                          name={`listItemvariant.${key}.isActive`}
                                          id={`is-active-${key}`}
                                        />
                                      </div>
                                      <div className={'mb-4'}>
                                        <ImageField
                                          name={`listItemvariant.${key}.photo`}
                                          label={'Image'}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
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