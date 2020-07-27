import React from 'react';
import { Link } from 'react-router-dom';

const ImageProcessing = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Image processing examples</h1>

      <canvas id="canvas"></canvas>
    </div>
  );
};

export default ImageProcessing;
