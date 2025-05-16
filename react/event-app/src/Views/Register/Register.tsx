import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  LoginRequest,
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
import { useNavigate } from 'react-router';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginMutation();
  const [registerUser] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
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
        <label>First Name</label>
        <input
          type='text'
          {...register('firstName')}
          required
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          type='text'
          {...register('lastName')}
          required
        />
      </div>
      <div>
        <label>Username</label>
        <input
          type='text'
          {...register('username')}
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
