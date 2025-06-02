import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Navigation from '../Navigation/Navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      {/* <Header /> */}
      <Navigation />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
