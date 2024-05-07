import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { AddMemberToProject } from '../../../apicalls/projects';
import { getAntdFormInputRules } from '../../../utils/helpers';
function MemberFormm({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) {
  console.log(project.members);
  const formRef = React.useRef(null);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      // check if email already exists
      const emailExists = project.members.find(
        (member) => member.user.email === values.email
      );
      if (emailExists) {
        dispatch(SetLoading(false));
        throw new Error('User already a member of this project')
      } else {
        // add new members
        dispatch(SetLoading(true));
        const response = await AddMemberToProject({
          projectId: project._id,
          email: values.email,
          role: values.role,
        });
        dispatch(SetLoading(false));
        if (response.success) {
          message.success(response.message);
          reloadData();
          setShowMemberForm(false);
        } else {
          message.error(response.message);
        }
      }
    } catch (err) {
      dispatch(SetLoading(false));
      message.error(err.message);
    }
  }
  return (
    <Modal
      title='ADD MEMBER'
      open={showMemberForm}
      onCancel={() => setShowMemberForm(false)}
      centered
      okText='Add'
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form layout='vertical' ref={formRef}
        onFinish={onFinish}
      >
        <Form.Item label='Email' name='email' rules={getAntdFormInputRules}>
          <Input placeholder='Email' />
        </Form.Item>
        <Form.Item label='Role' name='role' rules={getAntdFormInputRules}>
          <select>
            <option value=''>Select Role</option>
            <option value='admin'>Admin</option>
            <option value='employee'>Employee</option>
          </select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MemberFormm;