import Layout from 'components/Layout/Layout';
import Home from 'pages/Home/Home';
import PageNotFound from 'pages/PageNotFound/PageNotFound';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ImageProcessing from 'pages/ImageProcessing/ImageProcessing';
import ImageProcessingSineWave from 'pages/ImageProcessingSineWave/ImageProcessingSineWave';
import ImageProcessingMouseEffect from 'pages/ImageProcessingMouseEffect/ImageProcessingMouseEffect';

const Routes: React.FC = () => (
  <HashRouter>
    <Layout>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={ImageProcessing} exact path="/image-processing" />
        <Route component={ImageProcessingSineWave} exact path="/image-processing-sine-wave" />
        <Route component={ImageProcessingMouseEffect} exact path="/image-processing-mouse-effect" />
        <Route component={PageNotFound} />
      </Switch>
    </Layout>
  </HashRouter>
);

export default Routes;
