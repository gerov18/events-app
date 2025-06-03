import { Link } from 'react-router-dom';
import headerPic from '../../assets/landing.webp';

interface HeaderProps {
  onBrowseClick: () => void;
}

const Header = ({ onBrowseClick }: HeaderProps) => {
  return (
    <header className='relative h-[calc(100dvh/3)] bg-[url(/src/assets/landing.webp)] bg-center bg-cover'>
      <div className='absolute inset-0 bg-black/40'></div>

      <div className='relative z-10 flex flex-col justify-center h-full px-6 lg:px-16 text-center items-center'>
        <div className='mx-auto'>
          <h1 className='text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md mx-auto my-4'>
            Do What You Love
          </h1>
          <p className='mt-2 text-lg lg:text-xl text-gray-200 drop-shadow-sm max-w-lg m-auto'>
            Find events that speak to you, from music festivals to rock climbing
            classes.
          </p>
        </div>

        <button
          onClick={onBrowseClick}
          className='text-xl cursor-pointer transition-all mt-6 inline-block bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg duration-300 mx-auto'>
          Browse Events
        </button>
      </div>
    </header>
  );
};

export default Header;
