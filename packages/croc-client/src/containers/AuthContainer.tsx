import React, { Component, ReactElement } from 'react';
import { connect, } from 'react-redux';
import { Store } from '../store';
import { isAuthed, Actions } from '../modules/user';

interface AuthContainerProps {
  authed: boolean,
  auth: typeof Actions.setUsername,
  children: ReactElement<any>,
}

class AuthContainer extends Component<AuthContainerProps> {
  render() {
    const { children, authed } = this.props;

    if (!authed) {
      return <div>Not authed</div>;
    }

    return (
      children
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    authed: isAuthed(store.user),
  };
}

export default connect(mapStateToProps, {
  auth: Actions.setUsername,
})(AuthContainer);
