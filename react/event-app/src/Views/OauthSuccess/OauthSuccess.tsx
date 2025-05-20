import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../api/auth/authSlice';
import Cookies from 'js-cookie';

export const OauthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      Cookies.set('token', token);
      dispatch(setCredentials({ token }));

      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Logging in with Google...</p>;
};
