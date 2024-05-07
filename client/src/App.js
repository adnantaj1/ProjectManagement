import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectPage from './components/ProtectedPage';
import Profile from './pages/Profile';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProjectInfo from './pages/ProjectInfo';


function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route path="/"
            element={
              <ProtectPage>
                <Home />
              </ProtectPage>
            }
          />
          <Route path="/project/:id"
            element={
              <ProtectPage>
                <ProjectInfo />
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
