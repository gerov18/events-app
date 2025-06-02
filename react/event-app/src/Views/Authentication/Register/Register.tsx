import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  LoginRequest,
  useLoginMutation,
  useRegisterMutation,
} from '../../../api/auth/authApi';
import { setCredentials } from '../../../api/auth/authSlice';
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
} from '../../../api/auth/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { useEffect } from 'react';
import { useGetMeQuery } from '../../../api/me/meApi';
import userRegisterPic from '../../../assets/userRegister.webp';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user, isLoading: isGetMeLoading } = useGetMeQuery();
  const [loginUser, { isLoading, error }] = useLoginMutation();
  const [registerUser] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (!isGetMeLoading && user) {
      navigate('/');
    }
  }, [user, isGetMeLoading]);

  const handleFormSubmit = async (data: RegisterInput) => {
    try {
      const response = await registerUser(data).unwrap();
      await loginUser({ email: data.email, password: data.password }).unwrap();
      dispatch(
        setCredentials({
          userType: 'user',
          user: response.user,
          token: response.token,
          initialized: true,
        })
      );
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  console.log('errro', errors);

  return (
    <div className='flex items-center'>
      <div className='w-1/2'>
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
            Find what moves YOU!
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Sign up to find what's going on around the city.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(data => handleFormSubmit(data))}
          className='space-y-4 max-w-md mx-auto'>
          <FormInput
            label='Email'
            type='text'
            register={register('email', { required: 'Email is required' })}
            error={errors.email?.message as string}
          />
          <FormInput
            label='Username'
            register={register('username', {
              required: 'Username is required',
            })}
            error={errors.username?.message as string}
          />
          <FormInput
            label='First Name'
            register={register('firstName', {
              required: 'First Name is required',
            })}
            error={errors.firstName?.message as string}
          />
          <FormInput
            label='Last Name'
            register={register('lastName', {
              required: 'Last Name is required',
            })}
            error={errors.lastName?.message as string}
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
            className='w-full cursor-pointer rounded transition-colors bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
            Register
          </button>

          <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-blue-600 hover:underline'>
              Sign in here.
            </Link>
          </div>
          <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            <Link
              to='/organiser/register'
              className='text-blue-600 hover:underline'>
              Sign up as organiser
            </Link>
          </div>
          {error && <p className='text-red-500'>Login failed</p>}
        </form>
      </div>
      <div className='w-1/2 '>
        <img
          src={userRegisterPic}
          alt='login background image'
          className='h-dvh object-cover '
        />
      </div>
    </div>
  );
};
