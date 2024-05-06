import React from "react";
import { Modal, Form, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateProject } from "../../../apicalls/projects";

function ProjectForm({
  show,
  setShow,
  reloadData,
  project
}) {
  const formRef = React.useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      console.log(values);
      dispatch(SetLoading(true));
      if (project) {
        // update project
      } else {
        // create project
        values.owner = user._id;
        values.members = [
          {
            user: user._id,
            role: 'owner',
          },
        ];
        const response = await CreateProject(values);
        if (response.success) {
          message.success(response.message);
          reloadData();
          setShow(false);
        } else {
          throw new Error(response.error);
        }
        dispatch(SetLoading(false));
      }
    } catch (err) {
      dispatch(SetLoading(false))
    }
  };
  return (
    <div>
      <Modal
        title='Add Project'
        open={show}
        onCancel={() => setShow(false)}
        centered={true}
        width={700}
        onOk={() => {
          formRef.current.submit();
        }}
        okText='Save'
      >
        <Form layout='vertical'
          ref={formRef}
          onFinish={onFinish}
        >
          <Form.Item
            label='Project Name'
            name='name'          >
            <Input placeholder='Project Name' />
          </Form.Item>
          <Form.Item
            label='Project Description'
            name='description'
          >
            <TextArea placeholder='Project Description' />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}

export default ProjectForm;