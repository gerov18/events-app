import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { FormInput } from '../../../Components/FormInput/FormInput';
import {
  useLoginOrganiserMutation,
  useRegisterOrganiserMutation,
} from '../../../api/organiser/organiserApi';
import { setOrganiserCredentials } from '../../../api/organiser/organiserSlice';
import {
  OrganiserCreateInput,
  organiserCreateSchema,
} from '../../../api/organiser/organiserSchema';
import { useEffect } from 'react';
import { useGetMeQuery } from '../../../api/me/meApi';
import { setCredentials } from '../../../api/auth/authSlice';
import orgRegisterPic from '../../../assets/orgRegister.webp';

export const OrganiserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerOrganiser] = useRegisterOrganiserMutation();
  const [loginOrganiser, { error }] = useLoginOrganiserMutation();
  const { data: organiserData, isLoading: isGetMeLoading } = useGetMeQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganiserCreateInput>({
    resolver: zodResolver(organiserCreateSchema),
  });

  useEffect(() => {
    if (!isGetMeLoading && organiserData) {
      navigate('/');
    }
  }, [organiserData, isGetMeLoading, navigate]);

  const handleFormSubmit = async (data: OrganiserCreateInput) => {
    try {
      const response = await registerOrganiser(data).unwrap();
      await loginOrganiser({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(
        setCredentials({
          userType: 'organiser',
          user: response.organiser,
          token: response.token,
          initialized: true,
        })
      );
      dispatch(setOrganiserCredentials(response));
      navigate('/');
    } catch (err) {
      console.error('Organiser registration failed:', err);
    }
  };

  return (
    <div className='flex items-center h-screen'>
      {/* Left column: header + form */}
      <div className='w-1/2 px-8'>
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
            Organiser Sign Up
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Create an account to start managing your events.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='space-y-4 max-w-md mx-auto'>
          <FormInput
            label='Organization Name'
            register={register('name')}
            error={errors.name?.message as string}
          />
          <FormInput
            label='Email'
            type='email'
            register={register('email')}
            error={errors.email?.message as string}
          />
          <FormInput
            label='Password'
            type='password'
            register={register('password')}
            error={errors.password?.message as string}
          />
          <FormInput
            label='Phone (optional)'
            register={register('phone')}
            error={errors.phone?.message as string}
          />
          <FormInput
            label='Website (optional)'
            register={register('website')}
            error={errors.website?.message as string}
          />
          <FormInput
            label='Description (optional)'
            register={register('description')}
            error={errors.description?.message as string}
          />

          <button
            type='submit'
            className='w-full cursor-pointer rounded transition-colors bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
            Register as Organiser
          </button>

          {error && <p className='text-red-500 text-sm'>Registration failed</p>}

          <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            Already have an organiser account?{' '}
            <Link
              to='/organiser/login'
              className='text-blue-600 hover:underline'>
              Sign in here.
            </Link>
          </div>
        </form>
      </div>

      {/* Right column: illustration */}
      <div className='w-1/2'>
        <img
          src={orgRegisterPic}
          alt='organiser register background'
          className='w-full object-cover h-dvh'
        />
      </div>
    </div>
  );
};
