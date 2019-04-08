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

const buttonMapping = [1, 0, 2, 3];

const Choices = props => {
    const {
        isSelectNbChoicesStep = true,
        isSelectChoiceStep = false,
        choice,
        songInfo,
    } = props;

    const nbProposalToRemove = 0;
    const computedChoices = [...songInfo.propositions];
    console.log('songInfo', computedChoices);

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

            {isSelectChoiceStep && (
                <ul className="proposal-list">
                    {computedChoices.map((proposal, idx) => {
                        return (
                            <li key={proposal.id}>
                                <ButtonListLayout index={buttonMapping[idx]} />
                                <p>{proposal.name}</p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Choices;
