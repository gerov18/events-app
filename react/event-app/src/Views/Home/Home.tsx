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

  const { user, userType } = useSelector((state: RootState) => state.auth) || {
    user: null,
    userType: null,
  };

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

  return (
    <>
      <div className='bg-gray-100 min-h-screen'>
        <Header onBrowseClick={handleBrowseClick} />

        <div
          className={`overflow-hidden transform transition-[max-height] duration-800 ease-in-out ${
            showSearch ? 'max-h-[1000px]' : 'max-h-0'
          }`}>
          <SearchBar onClose={() => setShowSearch(false)} />
        </div>

        <div className='px-6'>
          {user && userType !== null && (
            <h1 className='mt-4 text-xl font-semibold text-center'>
              {`HELLO, ${
                userType === 'user'
                  ? user.firstName
                  : userType === 'organiser'
                  ? (user as any).name
                  : ''
              }`}
            </h1>
          )}

          <section className='my-8'>
            <h2 className='text-2xl font-semibold mb-4 text-center'>
              Popular in Sofia
            </h2>
            {isLoadingSofia ? (
              <p className='text-center'>Loading…</p>
            ) : sofiaEvents && sofiaEvents.length > 0 ? (
              <EventsSlider events={sofiaEvents} />
            ) : (
              <p className='text-gray-500 text-center'>
                No upcoming events in Sofia.
              </p>
            )}
            <div className='mt-4 text-center'>
              <Link
                to='/search?city=Sofia'
                className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                See more happening in Sofia
              </Link>
            </div>
          </section>

          <section className='my-8'>
            <h2 className='text-2xl font-semibold mb-4 text-center'>
              Popular in Plovdiv
            </h2>
            {isLoadingPlo ? (
              <p className='text-center'>Loading…</p>
            ) : plovdivEvents && plovdivEvents.length > 0 ? (
              <EventsSlider events={plovdivEvents} />
            ) : (
              <p className='text-gray-500 text-center'>
                No upcoming events in Plovdiv.
              </p>
            )}
            <div className='mt-4 text-center'>
              <Link
                to='/search?city=Plovdiv'
                className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                See more happening in Plovdiv
              </Link>
            </div>
          </section>

          <section className='my-8'>
            <h2 className='text-2xl font-semibold mb-4 text-center'>
              Browse by Category
            </h2>
            {isCatLoading ? (
              <p className='text-center'>Loading…</p>
            ) : (
              <CategoriesSection categories={categories} />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
