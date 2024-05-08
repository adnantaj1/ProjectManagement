import React, { useEffect } from "react";
import { Modal, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { SetLoading } from "../redux/loadersSlice";
import { MarkNotificationAsRead, DeleteAllNotifications } from "../apicalls/notifications";
import { SetNotifications } from "../redux/usersSlice";


function Notifications({
  showNotifications,
  setShowNotifications,
}) {
  const { notifications } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const readNotifications = async () => {
    try {
      const response = await MarkNotificationAsRead();
      if (response.success) {
        dispatch(SetNotifications(response.data));
      } else {
        message.error(response.error);
      }
    } catch (err) {
      message.error(err.message);
    };
  }

  const deleteAllNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteAllNotifications();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetNotifications([]));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoading(false));
      message.error(err.message);
    };
  };

  useEffect(() => {
    if (notifications.length > 0) {
      readNotifications();
    }
  }, [notifications]);

  return (
    <Modal
      title='NOTIFICATIONS'
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      centered
      footer={null}
      width={1000}
    >
      <div className='flex flex-col gap-5 mt-5'>
        {notifications.length > 0 ? (
          <div className='flex justify-end'>
            <span className='text-[15px]  cursor-pointer'
              onClick={deleteAllNotifications}
            >
              CLEAR
            </span>
          </div>) : (<div className='flex justify-center'>
            <span className='text-[18px]'>No Notifications</span>
          </div>)
        }
        {
          notifications.map((notification) => (
            <div key={notification.id} className='flex justify-between items-end border border-solid p-2 rounded cursor-pointer'
              onClick={() => {
                setShowNotifications(false);
                navigate(notification.onClick);
              }}
            >
              <div className='flex flex-col'>
                <span className='text-md font-semibold text-md text-gray-700'>{notification.title}</span>
                <span className='text-sm'>{notification.description}</span>
              </div>
              <div>
                <span className='text-sm'>{moment(notification.createdAt).fromNow()}</span>
              </div>
            </div>
          ))
        }

      </div>
    </Modal>
  );
}

export default Notifications;