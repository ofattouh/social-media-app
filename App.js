import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Notifications } from 'expo';
import AppContainer from './AppContainer';
import { ADD_NOTIFICATION, GET_NOTIFICATIONS } from './constants';

// IPv4 PC address
const API_URL = 'http://192.168.0.12:4000/graphql';

const link = new HttpLink({
  uri: API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(link),
  cache,
  resolvers: {
    Mutation: {
      addNotification: async (_, { id, title, body }) => {
        const { data } = await client.query({ query: GET_NOTIFICATIONS })

        cache.writeData({
          data: {
            notifications: [
              ...data.notifications,
              { id, title, body, __typename: 'notifications' },
            ],
          },
        });
      }
    }
  },
  typeDefs: `
    type Notification {
      id: Number!
      title: String!
      body: String!
    }
    extend type Query {
      notifications: [Notification]!
    }
  `,
});

cache.writeData({
  data: {
    notifications: []
  },
});

const App = () => {
  React.useEffect(() => {
    Notifications.addListener(handleNotification);
  });

  const handleNotification = ({ data }) => {
    client.mutate({
      mutation: ADD_NOTIFICATION,
      variables: {
        id: Math.floor(Math.random() * 500) + 1,
        title: data.title,
        body: data.body,
      },
    });
  };

  return (
    <ApolloProvider client={client}>
      <ActionSheetProvider>
        <AppContainer />
      </ActionSheetProvider>
    </ApolloProvider>
  );
};

export default App;

// package.json
// expo init social-media-app
// expo install react-navigation react-navigation-stack react-navigation-tabs
// expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
// expo install lottie-react-native
// expo install styled-components
// expo install graphql-tag
// expo install graphql apollo-client apollo-link-http apollo-cache-inmemory react-apollo
// expo install apollo-link-context
// expo install @apollo/react-hooks
// expo install apollo-link-ws subscriptions-transport-ws apollo-utilities
// expo install expo-permissions (camera/camera roll)
// expo install expo-image-picker (camera roll)
// expo install @expo/react-native-action-sheet (choice from camera roll or upload new)
