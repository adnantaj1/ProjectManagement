import React from 'react';
import { useSelector } from 'react-redux';

function Home() {
  const { user } = useSelector((state) => state.users);
  return (
    <div>
      hey {user?.firstName} {user?.lastName}, Welcome to Project Tracker
    </div>
  );
}
export default Home;