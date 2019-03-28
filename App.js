import React from 'react';
import { StyleSheet, Text, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, View, Platform } from 'react-native';
import { Linking, WebBrowser } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { default as Amplify } from "aws-amplify";
import { withOAuth } from "aws-amplify-react-native";
import { default as awsConfig } from "./aws-exports2";

Amplify.configure(awsConfig);

Amplify.configure({
  Auth: {
    oauth: {
      // Domain name
      domain: 'manolo-hosted-ui.auth.us-east-1.amazoncognito.com',

      // Authorized scopes
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],

      // Callback URL
      redirectSignIn: 'exp://127.0.0.1:19000/--/',

      // Sign out URL
      redirectSignOut: 'exp://127.0.0.1:19000/--/',

      // 'code' for Authorization code grant, 
      // 'token' for Implicit grant
      responseType: 'code',

      // optional, for Cognito hosted ui specified options
      options: {
        // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
        AdvancedSecurityDataCollectionFlag: true,
      },

      urlOpener: async (url, redirectUrl) => {
        const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

        if (type === 'success') {
          await WebBrowser.dismissBrowser();

          if (Platform.OS === 'ios') {
            return Linking.openURL(newUrl);
          }
        }
      }
    }
  }
});

class App extends React.Component {
  render() {
    const {
      oAuthUser: user,
      oAuthError: error,
      hostedUISignIn,
      facebookSignIn,
      googleSignIn,
      amazonSignIn,
      customProviderSignIn,
      signOut
    } = this.props;

    return (
      <SafeAreaView style={styles.safeArea}>
        {user && <Button title="Sign Out" onPress={signOut} icon='logout' />}
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text>{JSON.stringify({ user, error, appUrl: Linking.makeUrl('/') }, null, 2)}</Text>
          {!user && <React.Fragment>
            <Button title="Cognito" onPress={hostedUISignIn} icon='account-key' />
            <Button title="Facebook" onPress={facebookSignIn} icon='facebook-box' />
            <Button title="Google" onPress={googleSignIn} icon='google' />
            <Button title="Amazon" onPress={amazonSignIn} icon='amazon' />
            <Button title="Yahoo" onPress={() => customProviderSignIn('Yahoo')} icon='yahoo' />
          </React.Fragment>}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const Button = ({ onPress = () => { }, title, icon, backgroundColor = '#FF9900', color = 'white' }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={{
    backgroundColor,
    flexDirection: 'column',
    margin: 5,
    alignSelf: 'stretch',
    alignItems: 'center',
  }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
    }}>
      {icon && <MaterialCommunityIcons name={icon} size={32} color={color} style={{
        marginRight: title && 5
      }} />}
      {title && <Text style={{ color }}>{title}</Text>}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default withOAuth(App);
