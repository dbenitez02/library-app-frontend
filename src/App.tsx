/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';

export const App = () => {
  return (
    <div>
      <Navbar />
      <HomePage/>
      <Footer />
    </div>
  );
}


