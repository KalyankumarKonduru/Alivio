import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import setAuthToken from './utils/setAuthToken';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
import OrganizerRoute from './components/routing/OrganizerRoute';

// Pages
import Home from './pages/Home';
import OrganizerHome from './pages/OrganizerHome';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerEvents from './pages/OrganizerEvents';
import OrganizerAttendees from './pages/OrganizerAttendees';
import OrganizerAnalytics from './pages/OrganizerAnalytics';
import NotFound from './pages/NotFound';

// Check for token in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Alert />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/cart" element={<PrivateRoute component={Cart} />} />
              <Route path="/checkout" element={<PrivateRoute component={Checkout} />} />
              <Route path="/orders/confirmation/:id" element={<PrivateRoute component={OrderConfirmation} />} />
              <Route path="/profile" element={<PrivateRoute component={UserProfile} />} />
              <Route path="/orders" element={<PrivateRoute component={UserOrders} />} />
              <Route path="/organizer" element={<OrganizerRoute component={OrganizerHome} />} />
              <Route path="/organizer/dashboard" element={<OrganizerRoute component={OrganizerDashboard} />} />
              <Route path="/organizer/events" element={<OrganizerRoute component={OrganizerEvents} />} />
              <Route path="/organizer/events/create" element={<OrganizerRoute component={CreateEvent} />} />
              <Route path="/organizer/events/edit/:id" element={<OrganizerRoute component={EditEvent} />} />
              <Route path="/organizer/attendees" element={<OrganizerRoute component={OrganizerAttendees} />} />
              <Route path="/organizer/analytics" element={<OrganizerRoute component={OrganizerAnalytics} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;