import React from 'react';

import Aux from '../../hoc/Aux';
// import classes from './Layout.css';
import Navbar from '../Navbar/Navbar';

const layout = ( props ) => (
    <Aux>
        <Navbar />
        <main>
            {props.children}
        </main>
    </Aux>
);

export default layout;