import React, { useMemo, useState } from 'react';
import {
  TopMenu, Loader, Message, Grid, Row, Column,
} from 'pure-ui-react';
import { arrayOf, element } from 'prop-types';

import AppContext from '../../utils/Contexts';

import { Colors } from '../../assets/json';
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
    <Grid>
      <Row>
        <Column large={8}>
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
            <TopMenu
              menuBorderBottom="none"
              menuItems={{
                Início: 'https://www.77sol.com.br/',
              }}
              menuItemWidth={10}
              unit="rem"
              background={Colors.main}
              menuDropdownBackground="white"
              menuItemBackground="none"
              menuItemColor="white"
              menuItemColorHover="black"
              menuItemBackgroundHover="#E8EDFE"
            />
            {children}
          </AppContext.Provider>
        </Column>
      </Row>
    </Grid>
  );
}

Layout.propTypes = {
  children: arrayOf(element).isRequired,
};

export default Layout;
