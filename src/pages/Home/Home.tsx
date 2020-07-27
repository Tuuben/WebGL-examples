import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="image-processing">Image processing</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
