import React from 'react';
import PropTypes from 'prop-types';

export default class GitHubSocials extends React.Component {
  render() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return (
        <a href={this.props.link} target='_blank' rel='noopener noreferrer'>
          <img
            src={require('../../img/GitHub-PNG/GitHub-Mark-Light-120px-plus.png')}
            width={this.props.size || '30px'}
            alt='GitHub-Icon'
          />
        </a>
      );
    }
    return (
      <a href={this.props.link} target='_blank' rel='noopener noreferrer'>
        <img
          src={require('../../img/GitHub-PNG/GitHub-Mark-120px-plus.png')}
          width={this.props.size || '30px'}
          alt='GitHub-Icon'
        />
      </a>
    );
  }

  static get propTypes() {
    return {
      link: PropTypes.string,
      size: PropTypes.string || '2.4em',
    };
  }

  static get defaultProps() {
    return {
      link: '#',
      size: '2.4em',
    };
  }
}
