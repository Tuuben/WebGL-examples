import Layout from 'components/Layout/Layout';
import Home from 'pages/Home/Home';
import PageNotFound from 'pages/PageNotFound/PageNotFound';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ImageGreyScale from 'pages/ImageProcess/ImageGreyScale/ImageGreyScale';
import ImageSineWave from 'pages/ImageProcess/ImageSineWave/ImageSineWave';
import Image3DEffect from 'pages/ImageProcess/Image3DEffect/Image3DEffect';

const Routes: React.FC = () => (
  <HashRouter>
    <Layout>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={ImageGreyScale} exact path="/image/greyscale" />
        <Route component={ImageSineWave} exact path="/image/sine" />
        <Route component={Image3DEffect} exact path="/image/3deffect" />
        <Route component={PageNotFound} />
      </Switch>
    </Layout>
  </HashRouter>
);

export default Routes;
