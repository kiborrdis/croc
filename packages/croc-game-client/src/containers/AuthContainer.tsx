import React, { Component, ReactElement } from 'react';
import { connect, } from 'react-redux';
import Auth from '../components/Auth';
import { Store } from '../store';
import { isAuthed, Actions } from '../modules/user';

interface AuthContainerProps {
  authed: boolean,
  auth: typeof Actions.setUsername,
  children: ReactElement<any>,
}

class AuthContainer extends Component<AuthContainerProps> {
  handleAuth = (data: { text: string }) => {
    this.props.auth(data.text);
  }

  render() {
    const { children, authed } = this.props;

    if (!authed) {
      return <Auth onAuth={this.handleAuth} />;
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
