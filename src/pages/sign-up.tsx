
import { useContext } from 'react';
import ButtonSubmit from '@com/Formik/ButtonSubmit';
import TextField from '@com/Formik/TextField';
import { Form, Formik, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Api } from '@lib/Api';
import NotifContext from '@stores/notifProvider';
import UserContext from '@stores/userProvider';


type Props = {

}

let schema = Yup.object().shape({
  // fullname: Yup.string().label('Fullname').required(),
  // propertyName: Yup.string().label('Property Name').required(),
  // email: Yup.string().label('Email').required(),
  // noHp: Yup.string().label('No Handphone').required(),
  // username: Yup.string().label('Username').required(),
  // passwd: Yup.string().label('Password').required(),
  // confirmPasswd: Yup.string().label('Confirm Password').required(),
});

const SingIn: NextPage<Props> = () => {
  const { notif } = useContext(NotifContext);
  const { user, setUser } = useContext(UserContext);

  const router = useRouter();

  const initFormikValue = {
    fullname: '',
    propertyName: '',
    email: '',
    noHp: '',
    username: '',
    passwd: '',
    confirmPasswd: '',
  };

  const { data, mutate, isLoading } = useMutation((val: FormikValues) => Api.post('/sign-up', val));

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutate(values, {
      onSuccess: (res: any) => {
        if (res) {
          if (res.success) {
            setUser(res.payload);
            router.push('/sign-in');
          } else {
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
      }
    });
  };

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Sign In'}</title>
        <meta name="theme-color" content={'#FAF5FF'} />
      </Head>
      <div className={' w-screen flex justify-center items-center'}>
        <div className={'px-4 w-full max-w-lg my-16'}>
          <div className={'w-full bg-white rounded-lg shadow p-4 mb-2'}>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
            >
              {() => {
                return (
                  <Form>
                    <div className={'flex justify-center'}>
                      <span className={'text-xl'}>{'Sign Up'}</span>
                    </div>
                    <div className={''}>
                      <div className="mb-4">
                        <TextField
                          label={'Fullname'}
                          name={'fullname'}
                          type={'text'}
                          placeholder={'Fullname'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Property Name'}
                          name={'propertyName'}
                          type={'text'}
                          placeholder={'Property Name'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Email'}
                          name={'email'}
                          type={'email'}
                          placeholder={'Email'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'No Handphone'}
                          name={'noHp'}
                          type={'text'}
                          placeholder={'No Handphone'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Username'}
                          name={'username'}
                          type={'text'}
                          placeholder={'Username'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Password'}
                          type={'password'}
                          name={'passwd'}
                          placeholder={'Password'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Confirm Password'}
                          type={'password'}
                          name={'confirmPasswd'}
                          placeholder={'Confirm Password'}
                        />
                      </div>
                      <div className={''}>
                        <ButtonSubmit
                          label={'Sign Up'}
                          disabled={isLoading}
                          loading={isLoading}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className={'flex'}>
            <div className={'mr-1'}>
              {'Already have an account?'}
            </div>
            <Link href={'/sign-in'} passHref>
              <a className={'text-purple-500'}>
                <div>Login</div>
              </a>
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default SingIn;