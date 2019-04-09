import React, { Fragment, useState, useEffect } from 'react';

import './results.css';

class ResultScreen extends React.Component {
    state = {
        showScore: false,
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState(
                {
                    showScore: true,
                },
                () => {
                    this.props.handleResultsDisplay();
                }
            );
        }, 750);
    }
    render() {
        const { isRightChoice, scores } = this.props;
        const { showScore } = this.state;

        return (
            <Fragment>
                {!showScore && (
                    <div className="results">
                        {isRightChoice && (
                            <p className="is-correct">Correct !</p>
                        )}
                        {!isRightChoice && (
                            <p className="is-incorrect">Incorrect !</p>
                        )}
                    </div>
                )}

                {showScore && (
                    <div className="scores">
                        <p>
                            {scores.teamA} | {scores.teamB}
                        </p>
                    </div>
                )}
            </Fragment>
        );
    }
}

// const ResultScreen = props => {
//     const { handleResultsDisplay } = props;
//     const [showScore, setShowScore] = useState(false);

//     // sleep(750).then(() => {
//     //     setState(prevState => {
//     //         return { ...prevState, showScore: true };
//     //     });

//     //     handleResultsDisplay();
//     // });

//     setTimeout(() => {
//         setShowScore(true);
//     }, 750);

//     // useEffect(() => {
//     //     setTimeout(() => {
//     //         setShowScore(true);
//     //     }, 750);
//     // }, []);

//     useEffect(() => {
//         console.log('geergre');
//     }, [showScore]);

//     const { isRightChoice, scores } = props;
//     return (
//         <Fragment>
//             {!showScore && (
//                 <div className="results">
//                     {isRightChoice && <p className="is-correct">Correct !</p>}
//                     {!isRightChoice && (
//                         <p className="is-incorrect">Incorrect !</p>
//                     )}
//                 </div>
//             )}

//             {showScore && (
//                 <div className="scores">
//                     <p>
//                         {scores.teamA} | {scores.teamB}
//                     </p>
//                 </div>
//             )}
//         </Fragment>
//     );
// };

export default ResultScreen;
