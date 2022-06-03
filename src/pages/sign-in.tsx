
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
  username: Yup.string().required(),
  passwd: Yup.string().required(),
});

const SingIn: NextPage<Props> = () => {
  const { notif } = useContext(NotifContext);
  const { user, setUser } = useContext(UserContext);

  const router = useRouter();

  const initFormikValue = {
    username: '',
    passwd: '',
  };

  const { data, mutate, isLoading } = useMutation((val: FormikValues) => Api.post('/sign-in', val));

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutate(values, {
      onSuccess: (res: any) => {
        if (res) {
          if (res.success) {
            setUser(res.payload);
            router.push('/overview');
          } else if (res.error) {
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
      <div className={'h-screen w-screen bg-purple-50 flex justify-center items-center -mt-16'}>
        <div className={'px-4 w-full max-w-md'}>
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
                      <span className={'text-xl'}>{process.env.APP_NAME}</span>
                    </div>
                    <div className={''}>
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
                      <div className={''}>
                        <ButtonSubmit
                          label={'Sign In'}
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
              {'Don\'t have an account yet?'}
            </div>
            <Link href={'/sign-up'} passHref>
              <a className={'text-purple-500'}>
                <div>Register Now</div>
              </a>
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default SingIn;