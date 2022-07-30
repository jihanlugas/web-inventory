import TextField from '@com/Formik/TextField';
import Modal from '@com/Modal/Modal';
import { Formik, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import ButtonSubmit from '@com/Formik/ButtonSubmit';
import { PageRequest } from '@type/pagination';
import { Dispatch, SetStateAction } from 'react';


type FilterProps = {
  itemvariantName: string
  itemvariantDescription: string
}

type Props = {
  show: boolean;
  onClickOverlay: Function;
  pageRequest: PageRequest & FilterProps
  setPageRequest: Dispatch<SetStateAction<PageRequest & FilterProps>>
}

const schema = Yup.object().shape({
  itemvariantName: Yup.string().label('Item variant name'),
  itemvariantDescription: Yup.string().label('Item variant description'),
});

const ModalFilterItemVariant: React.FC<Props> = ({ show, onClickOverlay, pageRequest, setPageRequest }) => {
  const handleSubmit = (values: FormikValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      itemvariantName: values.itemvariantName,
      itemvariantDescription: values.itemvariantDescription,
    };
    setPageRequest(newReq);

    onClickOverlay(JSON.stringify(pageRequest) !== JSON.stringify(newReq));
  };

  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4'}>
            Filter Item
          </div>
          <div>
            <Formik
              initialValues={pageRequest}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ values, setValues, setFieldValue }) => {
                return (
                  <Form encType='multipart/form-data'>
                    <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mb-4'>
                      <div className="">
                        <TextField
                          label={'Item variant name'}
                          name={'itemvariantName'}
                          type={'text'}
                          placeholder={'Item variant name'}
                          required
                        />
                      </div>
                      <div className="">
                        <TextField
                          label={'Item variant description'}
                          name={'itemvariantDescription'}
                          type={'text'}
                          placeholder={'Item variant description'}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <div className={''}>
                        <ButtonSubmit
                          label={'Filter'}
                          disabled={false}
                          loading={false}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>

          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalFilterItemVariant;