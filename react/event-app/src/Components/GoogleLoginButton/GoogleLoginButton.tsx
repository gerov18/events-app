const GOOGLE_AUTH_URL = 'http://localhost:5008/authentication/google';

export const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <button
      onClick={handleLogin}
      className='btn btn-google'>
      Login with Google
    </button>
  );
};
