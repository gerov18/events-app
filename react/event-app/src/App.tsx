import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { setUser } from './api/auth/authSlice';
import { useGetMeQuery } from './api/me/meApi';
import { setOrganiserData } from './api/organiser/organiserSlice';
import Layout from './Components/Layout/Layout';
import EventDetails from './Views/EventDetails/EventDetails';
import Home from './Views/Home/Home';
import Login from './Views/Login/Login';
import { OauthSuccess } from './Views/OauthSuccess/OauthSuccess';
import Register from './Views/Register/Register';

function App() {
  const dispatch = useDispatch();
  const { data: getMeData, isSuccess } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && getMeData.type === 'user') {
      dispatch(setUser(getMeData.data));
    }
    if (isSuccess && getMeData.type === 'organiser') {
      dispatch(setOrganiserData(getMeData.data));
    }
  }, [isSuccess, getMeData]);

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
          <Route
            path='/oauth-success'
            element={<OauthSuccess />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
