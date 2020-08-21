import Layout from 'components/Layout/Layout';
import Home from 'pages/Home/Home';
import PageNotFound from 'pages/PageNotFound/PageNotFound';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ImageProcessing from 'pages/ImageProcessing/ImageProcessing';
import ImageProcessing02 from 'pages/ImageProcessing02/ImageProcessing02';

const Routes: React.FC = () => (
  <HashRouter>
    <Layout>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={ImageProcessing} exact path="/image-processing" />
        <Route component={ImageProcessing02} exact path="/image-processing-02" />
        <Route component={PageNotFound} />
      </Switch>
    </Layout>
  </HashRouter>
);

export default Routes;
