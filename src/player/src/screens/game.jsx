import React, { Component, Fragment } from 'react';

import classNames from 'classnames';

import './game.css';

const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class PermutationIndicator extends Component {
    componentDidMount() {
        const TIME_SEQ_PLAY = 750;
        const circleList = Array.from(
            document.getElementsByClassName('circle')
        );

        let i = 0;
        let nbSeqPlayed = 2;
        const NB_REPLAY_SEQ_MAX = 2;
        const { sequence } = this.props;

        function playSequence() {
            console.log();
            //  create a loop function
            setTimeout(function() {
                circleList.forEach(circle => {
                    circle.classList.remove('is-active');
                });
                const seqItem = sequence[i];
                const circle = circleList[seqItem];
                circle.classList.add('is-active');
                i++;
                if (i < circleList.length) {
                    playSequence();
                } else {
                    i = 0;
                    setTimeout(function() {
                        circleList.forEach(circle => {
                            circle.classList.remove('is-active');
                        });
                    }, TIME_SEQ_PLAY);

                    if (nbSeqPlayed < NB_REPLAY_SEQ_MAX) {
                        console.log('hellofefe');
                        nbSeqPlayed = nbSeqPlayed + 1;
                        playSequence();
                    } else {
                        console.log('frgrege');
                    }
                }
            }, TIME_SEQ_PLAY);
        }

        playSequence();
    }

    render() {
        return (
            <Fragment>
                <div className="permutation-indicator">
                    <div className="buttons">
                        <div className="circle" />
                        <div className="circle" />
                        <div className="circle" />
                        <div className="circle" />
                    </div>
                    <p>Mémorisez la permutation </p>
                </div>
            </Fragment>
        );
    }
}

// const PermutationIndicator = props => {
//     const circleList = Array.from(document.getElementsByClassName('circle'));

//     let i = 0;
//     const { sequence } = props;

//     function myLoop() {
//         //  create a loop function
//         setTimeout(function() {
//             console.log('i', i, circleList);
//             console.log(circleList[i]);
//             i++;
//             if (i < circleList.length) {
//                 myLoop();
//             }
//         }, 1500);
//     }

//     myLoop();
//     // sequence.forEach(element => {
//     //     sleep(1500).then(() => {
//     //         console.log('ff', element);
//     //     });
//     // });
//     return (
//         <Fragment>
//             <div className="permutation-indicator">
//                 <div className="buttons">
//                     <div className="circle" />
//                     <div className="circle" />
//                     <div className="circle" />
//                     <div className="circle" />
//                 </div>
//                 <p>Mémorisez la permutation </p>
//             </div>
//         </Fragment>
//     );
// };

class GameScreen extends Component {
    render() {
        const { permutation } = this.props;
        // const {
        //     isControllersConnected,
        //     isGameScreen,
        //     isStartScreen,
        // } = this.state;

        return (
            <Fragment>
                <PermutationIndicator sequence={permutation} />
            </Fragment>
        );
    }
}

export default GameScreen;
