import React, { Component } from 'react';
import classNames from 'classnames';

import './team-turn.css';

export default class TeamTurn extends Component {
    render() {
        const { team } = this.props;
        return (
            <div
                className={classNames('team-turn', {
                    teamA: team === 'teamA',
                    teamB: team === 'teamB',
                })}
            >
                {team === 'teamA' && <p>Equipe Bleue à vous de répondre !</p>}
                {team === 'teamB' && <p>Equipe Rouge à vous de répondre !</p>}
            </div>
        );
    }
}
