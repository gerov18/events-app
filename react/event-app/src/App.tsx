import Home from './Views/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import EventDetails from './Views/EventDetails/EventDetails';
import Login from './Views/Login/Login';
import { Provider } from 'react-redux';
import { store } from './app/store';

function App() {
  return (
    <Provider store={store}>
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
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
