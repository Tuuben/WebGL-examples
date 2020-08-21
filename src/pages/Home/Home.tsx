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
          <Link to="image-processing-02">Image processing - 02</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
