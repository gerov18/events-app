import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  LoginRequest,
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
} from '../../api/auth/authApi';
import { setCredentials } from '../../api/auth/authSlice';
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
} from '../../api/auth/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { FormInput } from '../../Components/FormInput/FormInput';
import { useEffect } from 'react';

export default function Login() {
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
  });

  useEffect(() => {
    if (!isGetMeLoading && user) {
      navigate('/');
    }
  }, [user, isLoading]);

  const handleFormSubmit = async (data: RegisterInput) => {
    try {
      const response = await registerUser(data).unwrap();
      console.log('response', response);
      await loginUser({ email: data.email, password: data.password }).unwrap();
      dispatch(setCredentials({ user: response.user, token: response.token }));
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
  console.log('errors', errors);
  return (
    <form onSubmit={handleSubmit(data => handleFormSubmit(data))}>
      <FormInput
        label='Email'
        type='text'
        register={register('email', { required: 'Email is required' })}
        error={errors.email?.message as string}
      />
      <FormInput
        label='Username'
        register={register('username', { required: 'Username is required' })}
        error={errors.username?.message as string}
      />
      <FormInput
        label='First Name'
        register={register('firstName', { required: 'First Name is required' })}
        error={errors.firstName?.message as string}
      />
      <FormInput
        label='Last Name'
        register={register('lastName', { required: 'Last Name is required' })}
        error={errors.lastName?.message as string}
      />
      <FormInput
        label='Password'
        type='password'
        register={register('password', { required: 'Password is required' })}
        error={errors.password?.message as string}
      />
      <button
        type='submit'
        className='btn bg-amber-500'>
        Register
      </button>
      <div>
        Already have an account?
        <Link to={{ pathname: '/login' }}> Click here to sign in.</Link>
      </div>
      {error && <p className='text-red-500'>Login failed</p>}
    </form>
  );
}
