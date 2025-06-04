import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../api/store';
import { useLogoutMutation } from '../../api/auth/authApi';
import { clearUserState } from '../../api/auth/authSlice';
import {
  useGetCategoriesQuery,
  useGetEventsQuery,
} from '../../api/events/eventApi';
import CategoriesSection from '../../Components/CategoriesSection/CategoriesSection';
import EventsSlider from '../../Components/EventsSlider/EventsSlider';
import Header from '../../Components/Header/Header';
import SearchBar from '../../Components/SearchBar/SearchBar';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const [logout] = useLogoutMutation();

  const {
    data: sofiaEvents,
    isLoading: isLoadingSofia,
    isError: isErrorSofia,
  } = useGetEventsQuery({ city: 'Sofia', take: 4 });

  const {
    data: categories,
    isLoading: isCatLoading,
    isError: isCatError,
  } = useGetCategoriesQuery();

  const {
    data: plovdivEvents,
    isLoading: isLoadingPlo,
    isError: isErrorPlo,
  } = useGetEventsQuery({ city: 'Plovdiv', take: 4 });

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUserState());
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleBrowseClick = () => {
    setShowSearch(prev => !prev);
  };
  const user = useSelector((state: RootState) => state.auth);

  console.log('state', user);
  return (
    <div className='bg-gray-100 min-h-screen'>
      <Header onBrowseClick={handleBrowseClick} />

      <div
        className={`overflow-hidden transform transition-[max-height] duration-700 ease-out ${
          showSearch ? 'max-h-[800px]' : 'max-h-0'
        }`}>
        <SearchBar onClose={() => setShowSearch(false)} />
      </div>

      <section className='w-full'>
        <div className='bg-gradient-to-r from-indigo-500 to-blue-500 py-10'>
          <div className='container mx-auto px-6 lg:px-12 text-center'>
            <h2 className='text-3xl lg:text-4xl font-extrabold text-white mb-4'>
              Discover Events in Sofia
            </h2>
            <p className='text-indigo-200 mb-6 max-w-xl mx-auto'>
              See what's happening around the city and join the fun today.
            </p>
            {isLoadingSofia ? (
              <p className='text-white animate-pulse'>Loading…</p>
            ) : sofiaEvents && sofiaEvents.length > 0 ? (
              <EventsSlider events={sofiaEvents} />
            ) : (
              <p className='text-indigo-100'>No upcoming events in Sofia.</p>
            )}
            <Link
              to='/search?city=Sofia'
              className='mt-6 inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow hover:shadow-lg transform hover:-translate-y-1 transition'>
              See More in Sofia
            </Link>
          </div>
        </div>
      </section>

      <section className=' w-full'>
        <div className='bg-gradient-to-r from-green-500 to-teal-500 py-10'>
          <div className='container mx-auto px-6 lg:px-12 text-center'>
            <h2 className='text-3xl lg:text-4xl font-extrabold text-white mb-4'>
              What's going on in Plovdiv?
            </h2>
            <p className='text-green-100 mb-6 max-w-xl mx-auto'>
              Find the latest activities in town.
            </p>
            {isLoadingPlo ? (
              <p className='text-white animate-pulse'>Loading…</p>
            ) : plovdivEvents && plovdivEvents.length > 0 ? (
              <EventsSlider events={plovdivEvents} />
            ) : (
              <p className='text-green-100'>No upcoming events in Plovdiv.</p>
            )}
            <Link
              to='/search?city=Plovdiv'
              className='mt-6 inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-full shadow hover:shadow-lg transform hover:-translate-y-1 transition'>
              See More in Plovdiv
            </Link>
          </div>
        </div>
      </section>

      <div className='container mx-auto px-6 lg:px-12'>
        <section className='my-12'>
          <h2 className='text-3xl font-extrabold text-gray-800 text-center mb-6'>
            Browse by Category
          </h2>
          {isCatLoading ? (
            <p className='text-center text-gray-500'>Loading…</p>
          ) : (
            <CategoriesSection categories={categories} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
