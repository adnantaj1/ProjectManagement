import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetLoggedInUser } from '../apicalls/users';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import { SetLoading } from '../redux/loadersSlice';
function ProtectPage({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetLoggedInUser();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {

      dispatch(SetLoading(false));
      message.error(err.message);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUser();
    } else {
      navigate('/login');
    }
  }, []);
  return (
    <div>
      <div className='flex justify-between items-center bg-primary text-white p-5'>
        <h1 className='text-2xl cursor-pointer'
          onClick={() => navigate('/')}>
          Project-Manager
        </h1>
        <div className='flex items-center bg-white px-5 py-1 rounded'>
          <span className='mr-5 text-primary cursor-pointer underline'
            onClick={() => navigate('/profile')}
          >
            {user?.firstName}
          </span>
          <i className="ri-notification-line text-primary cursor-pointer"></i>
          <i className="ri-logout-circle-r-line text-primary ml-10 cursor-pointer"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          ></i>
        </div>
      </div>
      <div className='px-5 py-3'>
        {children}
      </div>
    </div>
  );
}

export default ProtectPage;