// Layout.js
import React from 'react';

const Layout = ({ children }) => {
  document.title = 'TRENTAREV Corp.'; // Set the title

  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
