import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import fetch from "node-fetch";
import { setContext } from "apollo-link-context";
const httpLink = createHttpLink({
  //uri: "http://localhost:4000",
  uri: "https://secure-river-99887.herokuapp.com",
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
