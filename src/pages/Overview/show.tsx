import { useState } from "react";
import { Modal, Button, Typography,Divider } from "antd";
import { BankOutlined } from "@ant-design/icons";

interface PostShowProps {
  bankDetails: {
    accountTitle: string;
    accountIBAN: string;
    bankName: string;
  };
}

export const PostShow: React.FC <PostShowProps> = ({ bankDetails }) => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div> 
      <Button
        type="primary"
        size="large"
        style={{
          width: "100%",
          marginTop: 24,
        }}
        icon={<BankOutlined />}
        onClick={showModal}
      >
        See Bank Details
      </Button>
      <Modal forceRender title="Bank Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered footer={null} width={400}>
        <Divider/>
        <Typography.Title level={5}>Bank : {bankDetails.bankName}</Typography.Title>
        <Typography.Title level={5}>Account Title: {bankDetails.accountTitle}</Typography.Title>
        <Typography.Title level={5}>IBAN: {bankDetails.accountIBAN}</Typography.Title>
        <Divider/>
      </Modal>
    </div>
  );
};
