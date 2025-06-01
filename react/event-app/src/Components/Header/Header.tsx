import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='bg-blue-500 p-4'>
      <nav className='flex justify-between items-center'>
        <Link
          to='/'
          className='text-white text-xl font-bold'>
          EventApp
        </Link>
        <div className='space-x-4'>
          <Link
            to='/events'
            className='text-white'>
            Events
          </Link>
          <Link
            to='/user/me'
            className='text-white'>
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
