import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { clearUserState, setМе } from './api/auth/authSlice';
import { useGetMeQuery } from './api/me/meApi';
import {
  clearOrganiserState,
  setOrganiserData,
} from './api/organiser/organiserSlice';
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
import { Checkout } from './Views/Events/Checkout/Checkout';
import { UserDetails } from './Views/User/UserDetails/UserDetails';
import { OrganiserDetails } from './Views/Organiser/OrganiserDetails/OrganiserDetails';
import { AdminLayout } from './Components/AdminLayout/AdminLayout';
import { AdminDashboard } from './Views/Admin/AdminDashboard/AdminDashboard';
import { ManageOrganisers } from './Views/Admin/ManageOrganisers/ManageOrganisers';
import { ManageUsers } from './Views/Admin/ManageUsers/ManageUsers';
import { HandleRoleRequests } from './Views/Admin/RoleRequests/HandleRoleRequests';
import EventsByCategory from './Views/EventsByCategory/EventsByCategory';
import NotFoundPage from './Views/NotFoundPage/NotFoundPage';
import EventResults from './Components/EventResults/EventResults';
import OAuthSuccess from './Views/OAuthSuccess/OAuthSuccess';
import AdminUserDetails from './Views/Admin/AdminUserDetails/AdminUserDetails';
import AdminUserEdit from './Views/Admin/AdminUserEdit/AdminUserEdit';
import AdminOrganiserEdit from './Views/Admin/AdminOrganiserEdit/AdminOrganiserEdit';
import AdminOrganiserDetails from './Views/Admin/AdminOrganiserDetails/AdminOrganiserDetails';
import AdminEventEdit from './Views/Admin/AdminEventEdit/AdminEventEdit';
import ManageEvents from './Views/Admin/ManageEvents/ManageEvents';

function App() {
  const dispatch = useDispatch();
  const {
    data: meData,
    isLoading: meLoading,
    isError: meError,
    refetch: refetchMe,
  } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (meLoading) return;

    if (meData) {
      if (meData.type === 'organiser') {
        dispatch(setМе({ userType: 'organiser', user: meData.data }));
      } else if (meData.type === 'user') {
        dispatch(setМе({ userType: 'user', user: meData.data }));
      } else if (meData.type === 'admin') {
        dispatch(setМе({ userType: 'admin', user: meData.data }));
      }
    } else if (!meData && meError) {
      dispatch(clearUserState());
      dispatch(clearOrganiserState());
    }
  }, [meData, meError, meLoading, dispatch]);

  const user = useSelector((state: RootState) => state.auth);

  console.log('state', user);

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
          <Route
            path='/user/me'
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserDetails />
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
            path='/organiser/:id'
            element={<OrganiserDetails />}
          />

          <Route
            path='/admin'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
            <Route
              index
              element={<AdminDashboard />}
            />
            <Route
              path='users'
              element={<ManageUsers />}
            />
            <Route
              path='organisers'
              element={<ManageOrganisers />}
            />
            <Route
              path='role-requests'
              element={<HandleRoleRequests />}
            />
          </Route>
          <Route
            path='/category/:id'
            element={<EventsByCategory />}
          />
          <Route
            path='/search'
            element={<EventResults />}
          />
          <Route
            path='/*'
            element={<NotFoundPage />}
          />
          <Route
            path='/oauth-success'
            element={<OAuthSuccess />}
          />
          <Route
            path='/admin/users/:id'
            element={<AdminUserDetails />}
          />
          <Route
            path='/admin/users/:id/edit'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUserEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/organisers/:id/edit'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrganiserEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/organisers/:id'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrganiserDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path='role-requests'
            element={<HandleRoleRequests />}
          />
          <Route
            path='/admin/events'
            element={<ManageEvents />}
          />
          <Route
            path='/admin/events/:id/edit'
            element={<AdminEventEdit />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
