import React, { useState } from "react";
import { Button, message, Table } from 'antd';
import TaskForm from './TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { GetAllTasks } from '../../../apicalls/tasks';
import { getDateFormat } from '../../../utils/helpers';

function Tasks({ project }) {
  const [tasks, setTasks] = useState([]);
  const { user } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({ project: project._id });
      dispatch(SetLoading(false));
      if (response.success) {
        setTasks(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      dispatch(SetLoading(false));
      message.error(err.message);
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      render: (text, record) => record.assignedTo.firstName + ' ' + record.assignedTo.lastName,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      render: (text, record) => record.assignedBy.firstName + ' ' + record.assignedBy.lastName,

    },
    {
      title: 'Assigned On',
      dataIndex: 'createdAt',
      render: (text, record) => getDateFormat(text),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => text.toUpperCase(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
    }
  ]

  const isEmployee = project.members
    .find(member => member.role === 'employee' && member.user._id === user._id);
  return (
    <div>
      {!isEmployee &&
        <div className="flex justify-end">
          <Button type="default" onClick={() => setShowTaskForm(true)}>
            Add Task
          </Button>
        </div>
      }
      <Table className="mt-10"
        columns={columns} dataSource={tasks}
      />
      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
        />
      )}
    </div>
  )
}

export default Tasks;