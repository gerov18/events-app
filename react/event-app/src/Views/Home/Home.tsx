import { useDispatch, useSelector } from 'react-redux';
import EventCard from '../../Components/EventCard/EventCard';
import styles from './Home.module.css';
import { RootState } from '../../api/store';
import { useLogoutMutation } from '../../api/auth/authApi';
import { clearUserState } from '../../api/auth/authSlice';

const Home = () => {
  const { user, userType } =
    useSelector((state: RootState) => state.auth) ?? null;
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUserState());
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <>
      <div className={styles.topBar}>
        <h2 className={styles.title}>Haidi</h2>
        <button>search</button>
        <button onClick={handleLogout}>logout</button>
      </div>
      {user && userType !== null && (
        <h1>{`HELLO, ${
          userType === 'user'
            ? user?.firstName
            : userType === 'organiser'
            ? user.name
            : ''
        }`}</h1>
      )}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div className='header'>
          <h1>Do what you love</h1>
          <h2>
            Find events that speak to you, from music festivals to rock climbing
            classes
          </h2>
          <h3>Find an event</h3>
        </div>
        <div className='main-search'>
          <h2>What are you interest iN?</h2>
        </div>
        <div className='main-event-slide'>{/* <EventCard event={{}} /> */}</div>
        <div className='popular-events'>
          {/* <EventCard
            title={'gogogog'}
            date={'01.101i0'}
          /> */}
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Home;
