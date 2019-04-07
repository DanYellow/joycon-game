import React, { Component } from 'react';
import classNames from 'classnames';

import './choices.css';

const ButtonListLayout = props => {
    const { index } = props;
    const buttonList = [
        {
            name: 'hello',
            isActive: index === 0,
        },
        {
            name: 'hai',
            isActive: index === 1,
        },
        {
            name: 'woody',
            isActive: index === 2,
        },
        {
            name: 'world',
            isActive: index === 3,
        },
    ];

    return (
        <div className="button-list-layout">
            {buttonList.map(button => (
                <div
                    key={button.name}
                    className={classNames('button', {
                        'is-enabled': button.isActive,
                    })}
                />
            ))}
        </div>
    );
};

const Choices = props => {
    const {
        isSelectNbChoicesStep = true,
        isSelectChoiceStep = false,
        choice,
    } = props;
    console.log('choice', choice);
    return (
        <div className="choices">
            {isSelectNbChoicesStep && (
                <ul className="choices-list">
                    <li>
                        <ButtonListLayout index={1} />
                        <p>Duo | 1pt</p>
                    </li>

                    <li>
                        <ButtonListLayout index={0} />
                        <p>Carré | 3 pts</p>
                    </li>

                    <li>
                        <ButtonListLayout index={2} />
                        <p>Cash | 5 pts</p>
                    </li>
                </ul>
            )}
            {isSelectChoiceStep && <p>Gekge,ezgzgz</p>}
        </div>
    );
};

export default Choices;
