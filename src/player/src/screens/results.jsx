import React, { Fragment, useState } from 'react';

import './results.css';

const ResultScreen = props => {
    const { handleResultsDisplay } = props;
    const [state, setState] = useState({ showScore: false });

    setTimeout(() => {
        setState(prevState => {
            // Object.assign would also work
            return { ...prevState, showScore: true };
        });
    }, 750);

    setTimeout(() => {
        handleResultsDisplay();
    }, 1500);

    const { isRightChoice, scores } = props;
    return (
        <Fragment>
            {!state.showScore && (
                <div className="results">
                    {isRightChoice && <p className="is-correct">Correct !</p>}
                    {!isRightChoice && (
                        <p className="is-incorrect">Incorrect !</p>
                    )}
                </div>
            )}

            {state.showScore && (
                <div className="scores">
                    <p>
                        {scores.teamA} | {scores.teamB}
                    </p>
                </div>
            )}
        </Fragment>
    );
};

export default ResultScreen;
