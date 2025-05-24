import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useLoginOrganiserMutation } from '../../api/organiser/organiserApi';
import { setOrganiserCredentials } from '../../api/organiser/organiserSlice';
import {
  organiserLoginSchema,
  OrganiserLoginInput,
} from '../../api/organiser/organiserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FormInput } from '../../Components/FormInput/FormInput';
import { useGetMeQuery } from '../../api/me/meApi';

export const OrganiserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginOrganiser, { isLoading, error }] = useLoginOrganiserMutation();
  const { data: organiserData, isLoading: isGetMeLoading } = useGetMeQuery();

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
      navigate('/');
    } catch (err) {
      console.error('Organiser login failed:', err);
    }
  };

  useEffect(() => {
    if (!isGetMeLoading && organiserData) {
      navigate('/');
    }
  }, [organiserData, isGetMeLoading]);

  return (
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
        register={register('password', { required: 'Password is required' })}
        error={errors.password?.message as string}
      />
      <button
        type='submit'
        disabled={isLoading}
        className='btn bg-amber-500'>
        {isLoading ? 'Logging in...' : 'Login as Organiser'}
      </button>
      {error && <p className='text-red-500'>Login failed</p>}
      <div>
        Don't have an organiser account?
        <Link to='/organiser/register'> Click here to sign up.</Link>
      </div>
    </form>
  );
};
