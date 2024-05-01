import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectPage from './components/ProtectedPage';
import Profile from './pages/Profile';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/"
            element={
              <ProtectPage>
                <Home />
              </ProtectPage>
            }
          />
          <Route path="/profile"
            element={
              <ProtectPage>
                <Profile />
              </ProtectPage>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
