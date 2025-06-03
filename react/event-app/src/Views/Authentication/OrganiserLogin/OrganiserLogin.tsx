import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useLoginOrganiserMutation } from '../../../api/organiser/organiserApi';
import { setOrganiserCredentials } from '../../../api/organiser/organiserSlice';
import {
  organiserLoginSchema,
  OrganiserLoginInput,
} from '../../../api/organiser/organiserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { useGetMeQuery } from '../../../api/me/meApi';
import { setCredentials } from '../../../api/auth/authSlice';
import orgLoginPic from '../../../assets/orgLogin.webp';

export const OrganiserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginOrganiser, { isLoading, error }] = useLoginOrganiserMutation();
  const {
    data: organiserData,
    isLoading: isGetMeLoading,
    refetch: refetchMe,
  } = useGetMeQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganiserLoginInput>({
    resolver: zodResolver(organiserLoginSchema),
  });

  const onSubmit = async (data: OrganiserLoginInput) => {
    try {
      const response = await loginOrganiser(data).unwrap();
      dispatch(setOrganiserCredentials(response));
      dispatch(
        setCredentials({
          userType: 'organiser',
          user: response.organiser,
          token: response.token,
          initialized: true,
        })
      );
      await refetchMe();
      navigate('/');
    } catch (err) {
      console.error('Organiser login failed:', err);
    }
  };

  useEffect(() => {
    if (!isGetMeLoading && organiserData) {
      navigate('/');
    }
  }, [organiserData, isGetMeLoading, navigate]);

  return (
    <div className='flex items-center h-screen'>
      {/* Left column: header + form */}
      <div className='w-1/2 px-8'>
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
            Organiser Sign In
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Log in to manage your events.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 max-w-md mx-auto'>
          <FormInput
            label='Email'
            type='text'
            register={register('email')}
            error={errors.email?.message as string}
          />
          <FormInput
            label='Password'
            type='password'
            register={register('password')}
            error={errors.password?.message as string}
          />

          <button
            type='submit'
            disabled={isLoading}
            className='w-full cursor-pointer rounded transition-colors bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
            {isLoading ? 'Logging in…' : 'Login as Organiser'}
          </button>

          {error && <p className='text-red-500 text-sm'>Login failed</p>}

          <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            Don't have an organiser account?{' '}
            <Link
              to='/organiser/register'
              className='text-blue-600 hover:underline'>
              Sign up here.
            </Link>
          </div>
        </form>
      </div>

      <div className='w-1/2'>
        <img
          src={orgLoginPic}
          alt='organiser login background'
          className=' w-full object-cover h-dvh'
        />
      </div>
    </div>
  );
};
