import { useState } from 'react';

const Home = () => {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    setVisible(!visible);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className={`absolute w-1/2 p-4 bg-blue-200 transition-transform duration-500 ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
        Mid
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={handleToggle}
      >
        Toggle
      </button>
      <div className="w-1/2 p-4 mt-4 bg-green-200">
        Left
      </div>
    </div>
  );
};

export default Home;
