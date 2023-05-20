import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {ShippingListApp} from "./components/Product/ShoppingListApp";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {RatesApp} from "./components/Ratings/RatesApp";

const client = new ApolloClient({
    uri: 'http://localhost/graphql',
    cache: new InMemoryCache(),
});

const App = () => {
  return (
      <ApolloProvider client={client}>
          <Router>
              <Routes>
                  {/*<Route path="/" element={Home} />*/}
                  <Route path="/products" element={<ShippingListApp/>}/>
                  <Route path="/ratings" element={<RatesApp/>}/>
              </Routes>
          </Router>
      </ApolloProvider>
  );
}

export default App;
