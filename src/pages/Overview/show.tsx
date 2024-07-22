import { Show, useModalForm } from "@refinedev/antd";
import { Modal, Button, Typography, Divider } from "antd";
import { BankOutlined } from "@ant-design/icons";
type Action = "create" | "edit" | "clone" | "show";

export const PostShow: React.FC = () => {
  const { modalProps, id, show } = useModalForm<Action>({
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

      <Modal {...modalProps} title="Bank Details" footer={null} width={600} >
        <Show title="Employee ID" headerButtons={() => null}>
          <Typography.Title level={5}>Bank : United Bank Limited</Typography.Title>
          <Typography.Title level={5}>Account Title: Rehan Tariq</Typography.Title>
          <Typography.Title level={5}>UBAN: PK13UNIL0109000000000001</Typography.Title>
          <Typography.Title level={5}>Branch: Gulshan-e-Iqbal</Typography.Title>
          <Typography.Title level={5}>City: Lahore</Typography.Title>
          <Typography.Title level={5}>Country: Pakistan</Typography.Title>
          
        </Show>
      </Modal>
    </div>
  );
};
