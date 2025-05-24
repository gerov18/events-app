import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { setUser } from './api/auth/authSlice';
import { useGetMeQuery } from './api/me/meApi';
import { setOrganiserData } from './api/organiser/organiserSlice';
import Layout from './Components/Layout/Layout';
import EventDetails from './Views/Events/EventDetails/EventDetails';
import Home from './Views/Home/Home';
import { Register } from './Views/Authentication/Register/Register';
import { UserDelete } from './Views/User/UserDelete/UserDelete';
import { OrganiserDelete } from './Views/Organiser/OrganiserDelete/OrganiserDelete';
import { OrganiserEdit } from './Views/Organiser/OrganiserEdit/OrganiserEdit';
import { UserEdit } from './Views/User/UserEdit/UserEdit';
import { OauthSuccess } from './Views/Authentication/OauthSuccess/OauthSuccess';
import { Login } from './Views/Authentication/Login/Login';
import { OrganiserLogin } from './Views/Authentication/OrganiserLogin/OrganiserLogin';
import { OrganiserRegister } from './Views/Authentication/OrganiserRegister/OrganiserRegister';
import { ProtectedRoute } from './Components/ProtectedRoute/ProtectedRoute';
import { CreateEvent } from './Views/Events/CreateEvent/CreateEvent';
import { EditEvent } from './Views/Events/EditEvent/EditEvent';

function App() {
  const dispatch = useDispatch();
  const { data: getMeData, isSuccess } = useGetMeQuery();

  useEffect(() => {
    console.log('get', getMeData);
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
          <Route
            path='/organiser/register'
            element={<OrganiserRegister />}
          />
          <Route
            path='/organiser/login'
            element={<OrganiserLogin />}
          />
          <Route
            path='/organiser/me/delete'
            element={<OrganiserDelete />}
          />
          <Route
            path='/user/me/delete'
            element={<UserDelete />}
          />
          <Route
            path='/organiser/me/edit'
            element={<OrganiserEdit />}
          />
          <Route
            path='/user/me/edit'
            element={<UserEdit />}
          />
          <Route
            path='/events/new'
            element={
              <ProtectedRoute allowedRoles={['ORGANISER', 'ADMIN']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path='/events/:id/edit'
            element={
              <ProtectedRoute allowedRoles={['ORGANISER', 'ADMIN']}>
                <EditEvent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
