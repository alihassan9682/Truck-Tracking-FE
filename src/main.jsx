import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.scss'
import 'leaflet/dist/leaflet.css';
import Home from './components/Home/index.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUp from './components/common/signup/signup.jsx'
import Login from "./components/common/login/login.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID_NEW}>
          <Routes>
            <Route path={`${import.meta.env.BASE_URL}`} element={<App />}>
              <Route path={`/`} element={<Home />} />
              <Route path={`/signup`} element={<SignUp />} />
              <Route path={`/login`} element={<Login />} />
            </Route>
          </Routes>
        </GoogleOAuthProvider>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
)
