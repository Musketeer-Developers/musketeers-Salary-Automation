import React from "react";
import { Modal, Button, Form, Divider, DatePicker } from "antd";
import { useNotification } from "@refinedev/core";
import { API_URL } from "../../constants";
import { axiosInstance } from "../../authProvider";

interface HolidayProps {
  isVisible: boolean;
  handleClose: () => void;
}

interface Date {
  date: moment.Moment;
}

const Holiday: React.FC<HolidayProps> = ({ isVisible, handleClose }) => {
  const { open } = useNotification();
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Received values of form: ", values);
      handleClose();
      updateHoliday(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  async function updateHoliday(formData: Date) {
    const data = {
      date: formData.date?.format("YYYY-MM-DD"),
    };
    console.log(data);
    try {
      const response = await axiosInstance.post(
        `${API_URL}/month-data/add-holiday`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      open?.({
        type: "success",
        message: "Success!",
        description: "Successfully added!",
      });
    } catch (error: any) {
      console.error("Error posting data:", error);
      open?.({
        type: "error",
        message: `Error!`,
        description: `${error?.response?.data?.error?.message}`,
      });
    }
  }

  return (
    <Modal
      forceRender
      title="Add Holiday"
      open={isVisible}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Divider></Divider>
        <Form.Item label="Date">
          <Form.Item
            name={"date"}
            rules={[{ required: true, message: "Please enter the Date" }]}
            noStyle
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form.Item>
        <Divider></Divider>
      </Form>
    </Modal>
  );
};

export default Holiday;
