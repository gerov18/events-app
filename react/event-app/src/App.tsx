import Home from './Views/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import EventDetails from './Views/EventDetails/EventDetails';
import Login from './Views/Login/Login';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import { useGetMeQuery } from './api/auth/authApi';
import { useEffect } from 'react';
import { setUser } from './api/auth/authSlice';
import Register from './Views/Register/Register';

function App() {
  const dispatch = useDispatch();
  const { data: user, isSuccess } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user));
    }
  }, [isSuccess, user]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='/events/:id'
            element={<EventDetails />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/register'
            element={<Register />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
