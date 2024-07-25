import { useModalForm } from "@refinedev/antd";
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
 
  const { modalProps, show } = useModalForm<"show">({
    action: "show",
  });

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
        onClick={() => show()}
      >
        See Bank Details
      </Button>
      <Modal {...modalProps} title="Bank Details" centered footer={null} width={400} >
        <Divider/>
          <Typography.Title level={5}>Bank : {bankDetails.bankName}</Typography.Title>
          <Typography.Title level={5}>Account Title: {bankDetails.accountTitle}</Typography.Title>
          <Typography.Title level={5}>IBAN: {bankDetails.accountIBAN}</Typography.Title>

      </Modal>
    </div>
  );
};
