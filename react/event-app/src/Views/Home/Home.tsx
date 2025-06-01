import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../api/store';
import { useLogoutMutation } from '../../api/auth/authApi';
import { clearUserState } from '../../api/auth/authSlice';
import {
  useGetCategoriesQuery,
  useGetEventsQuery,
} from '../../api/events/eventApi';
import EventCard from '../../Components/EventCard/EventCard';
import styles from './Home.module.css';
import CategoryCard from '../../Components/CategoryCard/CategoryCard';
import CategoriesSection from '../../Components/CategoriesSection/CategoriesSection';
import EventsSlider from '../../Components/EventsSlider/EventsSlider';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  if (isErrorPlo || isErrorSofia) {
    return <p className='p-4 text-red-500'>Failed to load events.</p>;
  }

  return (
    <>
      <div className={styles.topBar}>
        <h2 className={styles.title}>Haidi</h2>
        <button onClick={() => navigate('/search')}>search</button>
        <button onClick={handleLogout}>logout</button>
      </div>

      {user && userType !== null && (
        <h1 className='mx-6 mt-4 text-xl font-semibold'>
          {`HELLO, ${
            userType === 'user'
              ? user.firstName
              : userType === 'organiser'
              ? (user as any).name
              : ''
          }`}
        </h1>
      )}

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div className='header mx-6'>
          <h1 className='text-3xl font-bold'>Do what you love</h1>
          <h2 className='text-gray-600'>
            Find events that speak to you, from music festivals to rock climbing
            classes
          </h2>
          <h3 className='text-gray-700 mt-2'>Find an event</h3>
        </div>

        <div className='main-search my-8'>
          <h2 className='text-2xl'>What are you interested in?</h2>
        </div>

        <section className='my-8 px-6'>
          <h2 className='text-2xl font-semibold mb-4'>Popular in Sofia</h2>
          {isLoadingSofia ? (
            <p>Loading…</p>
          ) : sofiaEvents && sofiaEvents.length > 0 ? (
            <EventsSlider events={sofiaEvents} />
          ) : (
            <p className='text-gray-500'>No upcoming events in Sofia.</p>
          )}
          <div className='mt-4'>
            <Link
              to='/search?city=Sofia'
              className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
              See more happening in Sofia
            </Link>
          </div>
        </section>

        <section className='my-8 px-6'>
          <h2 className='text-2xl font-semibold mb-4'>Popular in Plovdiv</h2>
          {isLoadingPlo ? (
            <p>Loading…</p>
          ) : plovdivEvents && plovdivEvents.length > 0 ? (
            <EventsSlider events={plovdivEvents} />
          ) : (
            <p className='text-gray-500'>No upcoming events in Plovdiv.</p>
          )}
          <div className='mt-4'>
            <Link
              to='/search?city=Plovdiv'
              className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
              See more happening in Plovdiv
            </Link>
          </div>
        </section>
        <section className='my-8 px-6 lg:flex sm:flex-col sm:items-center'>
          <h2 className='text-2xl font-semibold mb-4'>Browse by Category</h2>
          {isCatLoading ? (
            <p>Loading…</p>
          ) : (
            <CategoriesSection categories={categories} />
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
