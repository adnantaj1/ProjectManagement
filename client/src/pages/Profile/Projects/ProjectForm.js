import React from "react";
import { Modal, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";

function ProjectForm({
  show,
  setShow,
  reloadData
}) {
  const formRef = React.useRef(null);
  const onFinish = (values) => {
    console.log('Success:', values);
    // setShow(false);
    // reloadData();
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