import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="image-processing">Image processing - Grey scale example</Link>
        </li>
        <li>
          <Link to="image-processing-sine-wave">Image processing - Sine wave</Link>
        </li>
        <li>
          <Link to="image-processing-mouse-effect">Image processing - Mouse effect</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
