import React, { useState, useEffect } from "react";
import { Button, message, Table, Modal } from 'antd';
import TaskForm from './TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { GetAllTasks, UpdateTask, DeleteTask } from '../../../apicalls/tasks';
import { getDateFormat } from '../../../utils/helpers';
import Divider from '../../../components/Divider';
import { AddNotification } from "../../../apicalls/notifications";

function Tasks({ project }) {
  const [filters, setFilters] = useState({
    status: 'all',
    assignedBy: 'all',
    assignedTo: 'all',
  });
  const [showViewTask, setShowViewTask] = React.useState(false);
  const [tasks, setTasks] = useState([]);
  const { user } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const isEmployee = project.members
    .find(member => member.role === 'employee' && member.user._id === user._id);
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [task, setTask] = React.useState(false);
  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks(
        {
          project: project._id,
          ...filters
        });
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

  const deleteTask = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteTask(id);
      if (response.success) {
        message.success(response.message);
        getTasks();
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (err) {
      dispatch(SetLoading(false));
      message.error(err.message);
    }
  };

  const onStatusUpdate = async ({ task, status }) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateTask({
        _id: task._id,
        status,
      });
      if (response.success) {
        message.success(response.message);
        getTasks();
        AddNotification({
          title: `Task Status Updated to ${status}`,
          description: `${task.name} status has benn updated to ${status}`,
          user: task.assignedBy._id,
          onClick: `/project/${project._id}`,
        });
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
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
      render: (text, record) => <span className='underline text-[14px] cursor-pointer'
        onClick={() => {
          setTask(record);
          setShowViewTask(true);
        }}
      >
        {record.name}
      </span>
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
      render: (text, record) => {
        return (
          <select value={record.status}
            onChange={(e) => {
              onStatusUpdate({
                task: record,
                status: e.target.value,
              });
            }}
            disabled={record.assignedTo._id !== user._id && isEmployee}
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div className='flex gap-6'>
            <i class='ri-delete-bin-line cursor-pointer'
              onClick={() => {
                deleteTask(record._id);
              }}
            ></i>
            <i class='ri-pencil-line cursor-pointer'
              onClick={() => {
                setTask(record);
                setShowTaskForm(true);
              }}
            >
            </i>
          </div>
        )
      }

    },
  ];
  if (isEmployee) {
    columns.pop();
  };

  useEffect(() => {
    getTasks();
  }, [filters]);
  return (
    <div>
      {!isEmployee &&
        <div className="flex justify-end">
          <Button type="default" onClick={() => setShowTaskForm(true)}>
            Add Task
          </Button>
        </div>
      }
      <div className='flex gap-5'>
        <div>
          <span>
            Status
          </span>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({
                ...filters,
                status: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <span>
            Assigned By
          </span>
          <select
            value={filters.assignedBy}
            onChange={(e) => {
              setFilters({
                ...filters,
                assignedBy: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            {
              project.members
                .filter(member => member.role === 'admin' || member.role === 'owner')
                .map(member => (
                  <option value={member.user._id}>{member.user.firstName + '' + member.user.lastName}</option>
                ))
            }
          </select>
        </div>
        <div>
          <span>
            Assigned To
          </span>
          <select
            value={filters.assignedTo}
            onChange={(e) => {
              setFilters({
                ...filters,
                assignedTo: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            {
              project.members
                .filter(member => member.role === 'employee')
                .map(member => (
                  <option value={member.user._id}>{member.user.firstName + '' + member.user.lastName}</option>
                ))
            }
          </select>
        </div>
      </div>
      <Table className="mt-10"
        columns={columns} dataSource={tasks}
      />
      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
          task={task}
        />
      )}

      {showViewTask && (
        <Modal
          title='TASK DETAILS'
          open={showViewTask}
          onCancel={() => setShowViewTask(false)}
          centered
          footer={null}
          width={800}
        >
          <Divider />
          <h1 className='text-xl text-primary'>{task.name}</h1>
          <span className='text-[14px] text-gray-500'>
            {task.description}
          </span>

        </Modal>
      )}
    </div>
  )
}

export default Tasks;