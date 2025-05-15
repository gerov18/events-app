import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { LoginRequest, useLoginMutation } from '../../api/auth/authApi';
import { setCredentials } from '../../api/auth/authSlice';
import { LoginInput, loginSchema } from '../../api/auth/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
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
      localStorage.setItem('token', response.token);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 max-w-md mx-auto'>
      <div>
        <label>Email</label>
        <input
          type='email'
          {...register('email')}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type='password'
          {...register('password')}
          required
        />
      </div>
      <button
        type='submit'
        disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className='text-red-500'>Login failed</p>}
    </form>
  );
}
