import React, { useMemo, useState } from 'react';
import { TopMenu, Loader, Message } from 'pure-ui-react';
import { arrayOf, element } from 'prop-types';

import AppContext from '../../utils/Contexts';

import icon from '../../assets/images/Spin-1s-200px.gif';

function Layout({ children }) {
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState(null);
  const [messageType, setMessageType] = useState('warning');
  const [messageTimeout, setMessageTimeout] = useState(0);

  const value = useMemo(() => ({
    setLoading,
    setMessageText,
    setMessageType,
    setMessageTimeout,
  }), []);

  return (
    <AppContext.Provider
      key="appcontext-provider"
      value={value}
    >
      <Loader
        open={loading}
        icon={icon}
      />
      <Message
        text={messageText}
        type={messageType}
        timeout={messageTimeout}
      />
      <TopMenu />
      {children}
    </AppContext.Provider>
  );
}

Layout.propTypes = {
  children: arrayOf(element).isRequired,
};

export default Layout;
