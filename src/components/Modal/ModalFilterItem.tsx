import TextField from '@com/Formik/TextField';
import Modal from '@com/Modal/Modal';
import { Formik, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import ButtonSubmit from '@com/Formik/ButtonSubmit';
import { PageRequest } from '@type/pagination';
import { Dispatch, SetStateAction } from 'react';


type FilterProps = {
  itemName: string
  itemDescription: string
}

type Props = {
  show: boolean;
  onClickOverlay: Function;
  pageRequest: PageRequest & FilterProps
  setPageRequest: Dispatch<SetStateAction<PageRequest & FilterProps>>
}

const schema = Yup.object().shape({
  itemName: Yup.string().label('Item Name'),
  itemDescription: Yup.string().label('Item Description'),
});

const ModalFilterItem: React.FC<Props> = ({ show, onClickOverlay, pageRequest, setPageRequest }) => {
  const handleSubmit = (values: FormikValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      itemName: values.itemName,
      itemDescription: values.itemDescription,
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
                          label={'Item Name'}
                          name={'itemName'}
                          type={'text'}
                          placeholder={'Item Name'}
                          required
                        />
                      </div>
                      <div className="">
                        <TextField
                          label={'Item Description'}
                          name={'itemDescription'}
                          type={'text'}
                          placeholder={'Item Description'}
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

export default ModalFilterItem;