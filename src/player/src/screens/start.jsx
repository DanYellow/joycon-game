import React, { Fragment } from 'react';
import classNames from 'classnames';

import JoyConLeft from '../images/joycon-l.png';
import JoyConRight from '../images/joycon-r.png';

import './start.css';

export default props => {
    const { isControllersConnected } = props;
    return (
        <Fragment>
            <section className="joy-con">
                <div
                    className={classNames('illustrations', {
                        'is-enabled': isControllersConnected,
                    })}
                >
                    <img height="250" src={JoyConLeft} alt="" />
                    <img height="250" src={JoyConRight} alt="" />
                </div>

                {isControllersConnected && <p>Joy con connectés !</p>}
                {!isControllersConnected && (
                    <p>Appuyez sur un bouton pour commencer !</p>
                )}
            </section>
        </Fragment>
    );
};
