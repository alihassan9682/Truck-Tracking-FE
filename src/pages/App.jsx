import { Fragment, useState } from 'react';
import Loader from '../components/common/loader/loader';
import Footer from '../components/common/footer/footer';
import Sidebar from '../components/common/sidebar/sidebar';
import Header from '../components/common/header/header';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store"; // Adjust path accordingly
function App() {
  const [MyclassName, setMyClass] = useState("");
  const location = useLocation();
  const pathname = location.pathname;
  const Bodyclickk = () => {
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute('icon-overlay') === 'open') {
        html.setAttribute('icon-overlay', "");
      }
    }
  }
  return (
    <Fragment>
      <Loader />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>
            <Helmet
              htmlAttributes={{
                lang: "en",
                dir: "ltr",
                "data-menu-styles": "dark",
                "class": "light",
                "data-nav-layout": "vertical",
                "data-header-styles": "light",
                "data-vertical-style": "overlay",
                "loader": "disable",
                "data-icon-text": MyclassName,
              }}
            />
            <div className='page'>
              {(pathname === "/") && (
                <>
                  <Header />
                  <Sidebar />
                </>
              )}
              <div className={`${pathname === "/" ? "content main-index" : ""}`}>
                <div className={`${pathname === "/" ? 'main-content full-content' : ''}`}
                >
                  <Outlet />
                </div>
              </div>
            </div>
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </Fragment>
  );
}

export default App;
