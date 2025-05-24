import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { LoginRequest, useLoginMutation } from '../../api/auth/authApi';
import { setCredentials } from '../../api/auth/authSlice';
import { LoginInput, loginSchema } from '../../api/auth/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { FormInput } from '../../Components/FormInput/FormInput';
import { GoogleLoginButton } from '../../Components/GoogleLoginButton/GoogleLoginButton';
import { useGetMeQuery } from '../../api/me/meApi';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: user, isLoading: isGetMeLoading } = useGetMeQuery();

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
      dispatch(setCredentials({ user: response.user, token: response.token }));
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
        disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className='text-red-500'>Login failed</p>}
      <div>
        Don't have an account?
        <Link to={{ pathname: '/register' }}> Click here to sign up.</Link>
        <GoogleLoginButton />
      </div>
    </form>
  );
}
