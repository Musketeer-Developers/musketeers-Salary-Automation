import React from "react";
import { Modal, Button, Form, Divider, Input, Table } from "antd";
import { useNotification } from "@refinedev/core";
import { API_URL } from "../../constants";
import { axiosInstance } from "../../authProvider";
import type { TableColumnsType } from 'antd';

interface HolidayProps {
  isVisible: boolean;
  handleClose: () => void;
}

interface Date {
  date: moment.Moment;
}

const Holiday: React.FC<HolidayProps> = ({ isVisible, handleClose }) => {
  interface DataType {
    key: React.Key;
    name: string;
  }
  
  const columns: TableColumnsType<DataType> = [
    {
      title: 'All Employees',
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>,
    },
  ];
  
  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
    },
    {
      key: '2',
      name: 'Jim Green',
    },
    {
      key: '3',
      name: 'Joe Black',
    },
    {
      key: '4',
      name: 'Disabled User',
    },
  ];
  
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    // getCheckboxProps: (record: DataType) => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };


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
        <Form.Item label="Holiday Name">
          <Form.Item
            name={"name"}
            rules={[{ required: true, message: "Please enter the event name" }]}
            noStyle
          >
            <Input placeholder="holiday name" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Employees" style={{ width: "100%" }}>
          <Form.Item
            name="employees"
            rules={[{ required: true, message: 'Please select at least one employee!' }]}
            noStyle
          >
            <Table
              rowSelection={{
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
              style={{}}
            />

          </Form.Item>
        </Form.Item>
        <Divider></Divider>
      </Form>
    </Modal>
  );
};

export default Holiday;
