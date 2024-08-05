import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Divider } from 'antd/lib';
import { Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { API_URL } from '../constants';
import { axiosInstance } from '../authProvider';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface deleteProps {
  EmpID:Number
}

const DeleteButton: React.FC<deleteProps> = ({EmpID}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    deleteEmp();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function deleteEmp() {
    try {
      const response = await axiosInstance.put(`${API_URL}/employees/${EmpID}/unpublish`);
      navigate('/');
      console.log('Response:', response.data);
    } catch (error: any) {
      console.error('Error posting data:', error);
    }
  }

  return (
    <>
      <Button type="primary" danger ghost onClick={showModal} style={{ margin: "10px 0px", width: "100%" }}>
        <DeleteOutlined />Delete
      </Button>
      <Modal title="Delete Employee" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={"Delete"} okType={"danger"}>
        <Divider />
        <Title level={3}><ExclamationCircleOutlined style={{ color: "#e68a00" }} /> Are You Sure?</Title>
        <Divider />
      </Modal>
    </>
  );
};

export default DeleteButton;