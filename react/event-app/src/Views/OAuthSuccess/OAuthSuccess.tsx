// src/Views/OAuthSuccess.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setCredentials } from '../../api/auth/authSlice';
import { useDispatch } from 'react-redux';

const OAuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      dispatch(
        setCredentials({
          userType: 'user',
          user: undefined,
          token,
          initialized: true,
        })
      );

      navigate('/');
    } else {
      navigate('/login');
    }
  }, [token, dispatch, navigate]);

  return (
    <div className='flex items-center justify-center h-screen'>
      Processing login…
    </div>
  );
};

export default OAuthSuccess;
