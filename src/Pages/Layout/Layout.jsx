import React from "react";
import { Outlet } from "react-router-dom";
import styles from './Layout.module.css'

function Layout() {
  return (
      <div className={styles.layout}>
        <Outlet /> {/* This is where HomePage or GameScreen will render */}
    </div>
  );
};

export default Layout;