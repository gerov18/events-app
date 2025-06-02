const GOOGLE_AUTH_URL = 'http://localhost:5008/authentication/google';

export const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <button
      onClick={e => {
        e.preventDefault();
        handleLogin();
      }}
      className='
        flex 
        items-center 
        justify-center 
        w-full 

        px-4 
        py-2 
        bg-white 
        border 
        border-gray-300 
        rounded 
        shadow-sm 
        hover:shadow-md 
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-1 
        focus:ring-gray-400
        cursor-pointer
        transition-all
      '>
      {/* Google “G” logo (SVG) */}
      <svg
        className='w-5 h-5 mr-3'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 48 48'>
        <path
          fill='#FFC107'
          d='M43.611 20.083H42V20H24v8h11.303C34.526 32.634 30.296 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.847 1.124 7.961 2.958l5.493-5.493C34.046 5.762 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.354-.138-2.681-.389-3.917z'
        />
        <path
          fill='#FF3D00'
          d='M6.306 14.691l6.58 4.822C14.304 16.254 18.805 12 24 12c3.059 0 5.847 1.124 7.961 2.958l5.493-5.493C34.046 5.762 29.268 4 24 4 16.318 4 9.481 8.367 6.306 14.691z'
        />
        <path
          fill='#4CAF50'
          d='M24 44c5.094 0 9.778-1.879 13.354-4.957l-6.163-5.067C28.082 33.945 26.124 34.8 24 34.8c-6.296 0-10.526-3.366-12.18-7.966l-6.58 4.822C8.482 38.945 15.818 44 24 44z'
        />
        <path
          fill='#1976D2'
          d='M43.611 20.083H42v-.083H24v8h11.303c-1.092 3.041-3.637 5.624-6.987 6.824v5.664C34.046 39.846 39.6 36 43.611 29.917 47.093 24.954 47.093 20 43.611 20.083z'
        />
      </svg>

      <span className='text-gray-700 font-medium'>Sign in with Google</span>
    </button>
  );
};
