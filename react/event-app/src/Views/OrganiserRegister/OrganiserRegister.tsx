import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { FormInput } from '../../Components/FormInput/FormInput';
import {
  useGetMeQuery,
  useLoginOrganiserMutation,
  useRegisterOrganiserMutation,
} from '../../api/organiser/organiserApi';
import { setOrganiserCredentials } from '../../api/organiser/organiserSlice';
import {
  OrganiserCreateInput,
  organiserCreateSchema,
} from '../../api/organiser/organiserSchema';
import { useEffect } from 'react';

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
  }, [organiserData, isGetMeLoading]);

  const handleFormSubmit = async (data: OrganiserCreateInput) => {
    try {
      const response = await registerOrganiser(data).unwrap();
      await loginOrganiser({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setOrganiserCredentials(response));
      navigate('/');
    } catch (err) {
      console.error('Organiser registration failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className='space-y-4'>
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
        className='btn bg-amber-500'>
        Register as Organiser
      </button>
      <div>
        Already registered?
        <Link to='/organiser/login'> Click here to sign in.</Link>
      </div>
      {error && <p className='text-red-500'>Login failed</p>}
    </form>
  );
};
