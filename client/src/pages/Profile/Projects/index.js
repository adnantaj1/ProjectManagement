import React from 'react';
import { Button } from 'antd';
import ProjectForm from './ProjectForm';

function Projects() {
  const [show, setShow] = React.useState(false)
  return (
    <div>
      <div className='flex justify-end'>
        <Button type='default'
          onClick={() => setShow(true)}
        > Add Project</Button>
      </div>

      {show && <ProjectForm show={show} setShow={setShow} />}
    </div>
  );
}

export default Projects;