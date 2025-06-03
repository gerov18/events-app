import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { LoginRequest, useLoginMutation } from '../../../api/auth/authApi';
import { setCredentials } from '../../../api/auth/authSlice';
import { LoginInput, loginSchema } from '../../../api/auth/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { GoogleLoginButton } from '../../../Components/GoogleLoginButton/GoogleLoginButton';
import { useGetMeQuery } from '../../../api/me/meApi';
import userLoginPic from '../../../assets/userLogin.webp';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    data: user,
    isLoading: isGetMeLoading,
    refetch: refetchMe,
  } = useGetMeQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await login(data).unwrap();
      dispatch(
        setCredentials({
          userType: 'user',
          user: response.user,
          token: response.token,
          initialized: true,
        })
      );
      await refetchMe();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  useEffect(() => {
    if (!isGetMeLoading && user) {
      navigate('/');
    }
  }, [user, isLoading]);

  return (
    <div className='flex items-center'>
      <div className='w-1/2'>
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
            Welcome Back! Ready to discover your next adventure?
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Log in to browse, reserve, and keep the fun going.
          </p>
        </div>{' '}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 max-w-md mx-auto'>
          <FormInput
            label='Email'
            type='text'
            register={register('email', { required: 'Email is required' })}
            error={errors.email?.message as string}
          />
          <FormInput
            label='Password'
            type='password'
            register={register('password', {
              required: 'Password is required',
            })}
            error={errors.password?.message as string}
          />
          <button
            type='submit'
            disabled={isLoading}
            className='w-full cursor-pointer rounded transition-colors bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {error && <p className='text-red-500'>Login failed</p>}
          <GoogleLoginButton />
          <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-blue-600 hover:underline'>
              Sign up here.
            </Link>
          </div>
          <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            <Link
              to='/organiser/login'
              className='text-blue-600 hover:underline'>
              Sign in as organiser
            </Link>
          </div>
        </form>
      </div>
      <div className='w-1/2 '>
        <img
          src={userLoginPic}
          alt='login background image'
          className='h-dvh object-cover '
        />
      </div>
    </div>
  );
};
