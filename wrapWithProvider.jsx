import React from 'react';
import { element as reactElement } from 'prop-types';

import Layout from './src/components/layout';

function Wrapper({ element }) {
  return (
    <>
      <Layout>
        {element}
      </Layout>
      )
    </>
  );
}

Wrapper.propTypes = {
  element: reactElement.isRequired,
};

export default Wrapper;
