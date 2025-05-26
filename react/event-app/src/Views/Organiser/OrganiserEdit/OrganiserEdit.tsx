import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useUpdateOrganiserMutation } from '../../../api/organiser/organiserApi';
import {
  UpdateOrganiserInput,
  updateOrganiserSchema,
} from '../../../api/organiser/organiserSchema';
import { setOrganiserData } from '../../../api/organiser/organiserSlice';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { useGetMeQuery } from '../../../api/me/meApi';
import { useNavigate } from 'react-router';

export const OrganiserEdit = () => {
  const dispatch = useDispatch();
  const { data: organiser, isLoading: isGetMeLoading } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating, isSuccess }] =
    useUpdateOrganiserMutation();
  const navigate = useNavigate();

  const defaultValues =
    organiser && organiser.type === 'organiser'
      ? {
          name: organiser.data.name,
          email: organiser.data.email,
          description:
            organiser.data.description === null
              ? undefined
              : organiser.data.description,
          phone:
            organiser.data.phone === null ? undefined : organiser.data.phone,
          website:
            organiser.data.website === null
              ? undefined
              : organiser.data.website,
          password: '',
        }
      : {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateOrganiserInput>({
    resolver: zodResolver(updateOrganiserSchema),
    defaultValues,
  });

  useEffect(() => {
    if (organiser && organiser.type === 'organiser') {
      reset(defaultValues);
    }
  }, [organiser, reset]);

  useEffect(() => {
    if (isSuccess && organiser && organiser.type === 'organiser') {
      dispatch(setOrganiserData(organiser.data));
      alert('Organiser profile updated');
    }
  }, [isSuccess, organiser]);

  useEffect(() => {
    if (!isGetMeLoading && !organiser) {
      navigate('/organiser/login');
    }
    if (!isGetMeLoading && organiser && organiser.type === 'user') {
      navigate('/');
    }
  }, [organiser, isGetMeLoading, navigate]);

  const onSubmit = (data: UpdateOrganiserInput) => {
    updateMe(data);
  };

  if (isGetMeLoading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-md mx-auto space-y-4'>
      <FormInput
        label='Name'
        register={register('name')}
        error={errors.name?.message}
      />
      <FormInput
        label='Email'
        type='email'
        register={register('email')}
        error={errors.email?.message}
      />
      <FormInput
        label='Description'
        register={register('description')}
        error={errors.description?.message}
      />
      <FormInput
        label='Phone'
        register={register('phone')}
        error={errors.phone?.message}
      />
      <FormInput
        label='Website'
        register={register('website')}
        error={errors.website?.message}
      />
      <FormInput
        label='Password'
        type='password'
        register={register('password')}
        error={errors.password?.message}
      />
      <button
        disabled={isUpdating}
        className='btn bg-blue-500'>
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};
