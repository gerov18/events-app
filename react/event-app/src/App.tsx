import Home from './Views/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import EventDetails from './Views/EventDetails/EventDetails';

function App() {
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
