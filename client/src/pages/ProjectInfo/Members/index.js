import React from 'react';
import { Button, Table, message } from 'antd';
import MemberForm from './MemberForm';
import { useSelector, useDispatch } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { RemoveMemberFromProject } from '../../../apicalls/projects';

function Members({ project, reloadData }) {
  const [role, setRole] = React.useState('');
  const [showMemberForm, setShowMemberForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const isOwner = project.owner._id === user._id;

  const deleteMember = async (memberId) => {
    try {
      dispatch(SetLoading(true));
      const response = await RemoveMemberFromProject({
        projectId: project._id,
        memberId,
      });
      if (response.success) {
        dispatch(SetLoading(false));
        reloadData();
        message.success(response.message);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      dispatch(SetLoading(false));
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      render: (text, record) => record.user.firstName,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      render: (text, record) => record.user.lastName,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => record.user.email,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (text, record) => record.role.toUpperCase(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <Button
          type='primary' danger
          onClick={() => deleteMember(record._id)}
        >
          Remove
        </Button>
      ),
    }
  ];

  // if not owner, then don't show the action
  if (!isOwner) {
    columns.pop();
  }
  return (
    <div>
      <div className='flex justify-end'>
        {isOwner && (
          <Button type='default'
            onClick={() => setShowMemberForm(true)}
          >Add Member
          </Button>
        )}
      </div>
      <div className='w-48'>
        <span>
          Select Role
        </span>
        <select
          onChange={(e) => setRole(e.target.value)}
          value={role}
        >
          <option value=''>All</option>
          <option value='employee'> Employee</option>
          <option value='admin'> Admin</option>
          <option value='owner'> Owner</option>
        </select>
      </div>
      <Table className='mt-6'
        columns={columns}
        dataSource={project.members.filter((member) => {
          if (role === '') {
            return true;
          } else {
            return member.role === role;
          }
        })}
      />
      {showMemberForm && <MemberForm
        showMemberForm={showMemberForm}
        setShowMemberForm={setShowMemberForm}
        reloadData={reloadData}
        project={project}
      />}
    </div>
  )
}

export default Members;