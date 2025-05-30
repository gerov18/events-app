import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { clearUserState, setМе } from './api/auth/authSlice';
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
import { RootState } from './api/store';
import { ReservationDetails } from './Components/ReservationDetails/ReservationDetails';
import { StripeContainer } from './Components/StripeContainer/StripeContainer';
import { Checkout } from './Views/Checkout/Checkout';

function App() {
  const dispatch = useDispatch();
  const { data: meData, isLoading, isError } = useGetMeQuery();

  useEffect(() => {
    if (meData) {
      if (isLoading) return;

      if (meData?.type === 'organiser') {
        dispatch(setМе({ userType: 'organiser', user: meData.data }));
      }
      if (meData?.type === 'user') {
        dispatch(setМе({ userType: 'user', user: meData.data }));
      } else if (isError) {
        dispatch(clearUserState());
      }
    }
  }, [meData, isLoading, isError, dispatch]);

  const user = useSelector((state: RootState) => state.auth);

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
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path='/events/:id/edit'
            element={
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path='/user/:userId/reservations/:reservationId'
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <ReservationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path='/checkout'
            element={<Checkout />}
          />
          <Route
            path='/checkout'
            element={
              <ProtectedRoute allowedRoles={['user', 'organiser', 'admin']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
