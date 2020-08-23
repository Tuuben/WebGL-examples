import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="image/greyscale">Image processing - Grey scale</Link>
        </li>
        <li>
          <Link to="image/sine">Image processing - Sine wave</Link>
        </li>
        <li>
          <Link to="image/3deffect">Image processing - 3D effect</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
