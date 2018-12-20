import React from 'react';
import { StyleSheet, Text, ScrollView, Button, StatusBar } from 'react-native';
import { Constants } from 'expo';

import { default as Amplify } from "aws-amplify";
import { withOAuth } from "aws-amplify-react-native";
import { default as awsConfig } from "./aws-exports";

Amplify.configure(awsConfig);

// Amplify.Logger.LOG_LEVEL = 'DEBUG';

Amplify.configure({
  Auth: {
    oauth: {
      // Domain name
      domain: 'manolo-hosted-ui.auth.us-east-1.amazoncognito.com',

      // Authorized scopes
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],

      // Callback URL
      redirectSignIn: Constants.linkingUrl,

      // Sign out URL
      redirectSignOut: Constants.linkingUrl,

      // 'code' for Authorization code grant, 
      // 'token' for Implicit grant
      responseType: 'code',

      // optional, for Cognito hosted ui specified options
      options: {
        // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
        AdvancedSecurityDataCollectionFlag: true
      }
    }
  }
});

class App extends React.Component {
  render() {
    const { oAuthUser: user, signIn, signOut } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>{JSON.stringify(user, null, 2)}</Text>
        {user
          ? <Button title="Sign Out" onPress={signOut} />
          : <Button title="Sign In" onPress={signIn} />}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight
  }
});

export default withOAuth(App);
