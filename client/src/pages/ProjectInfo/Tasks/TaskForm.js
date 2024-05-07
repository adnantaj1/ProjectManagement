import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateTask } from "../../../apicalls/tasks";

function TaskForm({ showTaskForm, setShowTaskForm, project, task, reloadData }) {
  const [email, setEmail] = React.useState('');
  const { user } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const formRef = React.useRef(null);
  const onFinish = async (values) => {
    try {
      let response = null;
      dispatch(SetLoading(true));
      if (task) {
        // update task

      } else {
        // create task
        const assignedToMember = project.members.find((member) => member.user.email === email);
        const assignedToUserId = assignedToMember.user._id;
        const assignedBy = user._id;
        response = await CreateTask({
          ...values,
          project: project._id,
          assignedTo: assignedToUserId,
          assignedBy,
        });
      }
      if (response.success) {
        reloadData();
        message.success(response.message);
        setShowTaskForm(false);
      }
      dispatch(SetLoading(false));
    } catch (err) {
      dispatch(SetLoading(false));
      message.error(err.message);
    }
  };
  const validateEmail = () => {
    const employeesInProject = project.members
      .filter((member) => member.role === 'employee');
    const isEmailValid = employeesInProject
      .find((employee) => employee.user.email === email);
    return isEmailValid ? true : false;
  }
  return (
    <Modal
      title='Add Task'
      open={showTaskForm}
      onCancel={() => setShowTaskForm(false)}
      centered
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form layout='vertical' ref={formRef} onFinish={onFinish}>
        <Form.Item label='Task Name' name='name'>
          <Input />
        </Form.Item>
        <Form.Item label='Task Description' name='description'>
          <TextArea />
        </Form.Item>
        <Form.Item label='Assign To' name='assignedTo'>
          <Input placeholder='Enter email of the employee'
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        {
          email && !validateEmail() && (
            <div className='bg-red-700 text-sm p-2 rounded'>
              <span className='text-white'>
                Email is not valid or employee is not a member of project
              </span>
            </div>
          )
        }
      </Form>
    </Modal>
  )
}

export default TaskForm;