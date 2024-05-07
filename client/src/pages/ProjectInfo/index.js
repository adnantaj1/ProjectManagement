import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message, Tabs } from 'antd';
import { GetProjectById } from '../../apicalls/projects';
import { SetLoading } from '../../redux/loadersSlice';
import { getDateFormat } from '../../utils/helpers';
import Divider from '../../components/Divider';
import Tasks from './Tasks';
import Members from './Members';

function ProjectInfo() {
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectById(params.id);
      dispatch(SetLoading(false));
      if (response.success) {
        setProject(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoading(false))
      message.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    project && (
      <div>
        <div className='flex justify-between'>
          <div>
            <h1 className='text-primary text-2xl font-semibold uppercase'>
              {project?.name}
            </h1>
            <span className='text-gray-600 text-sm'>
              {project?.description}
            </span>
          </div>
          <div>
            <div className='flex gap-5'>
              <span className='text-gray-600 text-sm font-semibold'>
                Created At
              </span>
              <span className='text-gray-600 text-sm'>{getDateFormat(project.createdAt)}</span>
            </div>
            <div className='flex gap-5'>
              <span className='text-gray-600 text-sm font-semibold'>
                Created By
              </span>
              <span className='text-gray-600 text-sm'>{project.owner.firstName} {project.owner.lastName}</span>
            </div>
          </div>
        </div>
        <Divider />
        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab='Taks' key='1' >
            <Tasks />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Members' key='2' >
            <Members />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  );
}

export default ProjectInfo;