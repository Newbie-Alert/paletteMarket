import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router';
import ScrollTopButton from './ScrollTopButton';

const Layout = () => {
  const location = useLocation();
  const [showTopbutton, setShowTopButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage =
        (scrollY / (documentHeight - windowHeight)) * 100;

      if (
        (['/', '/community_write', '/productsposts'].includes(
          location.pathname
        ) &&
          scrollPercentage >= 60) ||
        (['/mypage', '/products', '/communitymain', '/search-results'].includes(
          location.pathname
        ) &&
          scrollY >= 300)
      ) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Outlet />
      {showTopbutton && <ScrollTopButton />}
      <Footer />
    </>
  );
};

export default Layout;
