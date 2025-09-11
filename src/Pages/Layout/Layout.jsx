import React from "react";
import { Outlet } from "react-router-dom";
import styles from './Layout.module.css'
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

function Layout() {
  return (
      <div>
      <Header />
      <main>
        <Outlet /> {/* This is where HomePage or GameScreen will render */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;