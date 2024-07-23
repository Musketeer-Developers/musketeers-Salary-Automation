import type { PropsWithChildren } from "react";
import { getDefaultFilter, useGo } from "@refinedev/core";
import {
  CreateButton,
  EditButton,
  List,
  NumberField,
  Show,
  useForm,
} from "@refinedev/antd";
import { useState } from "react";
import { EyeOutlined, SearchOutlined, BookOutlined } from "@ant-design/icons";
import { Col, Row, Avatar, Flex, Input, Select, Table, Form, Card, message, Switch, Typography, Modal, Button, Upload, InputNumber, DatePicker } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from 'moment';




async function getData() {
  const data = await axios.get("http://localhost:1337/api/employees",
    {
      headers: {
        'Authorization': "Bearer 9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1",
        'Content-Type': "application/json"
      }
    })
  console.log(data);
}




// Sample data
const data = [
  {
    id: "1",
    name: "John Doe",
    designation: "Software Engineer",
    email: "john.doe@example.com",
    status: "Active",
    hours: 40,
    income: "5000",
  },
  {
    id: "2",
    name: "Jane Smith",
    designation: "Project Manager",
    email: "jane.smith@example.com",
    status: "Active",
    hours: 35,
    income: "7000",
  },
  {
    id: "3",
    name: "Emily Johnson",
    designation: "Data Scientist",
    email: "emily.johnson@example.com",
    status: "Inactive",
    hours: 20,
    income: "3000",
  },
  {
    id: "4",
    name: "Michael Brown",
    designation: "UX Designer",
    email: "michael.brown@example.com",
    status: "Active",
    hours: 40,
    income: "4500",
  },
  {
    id: "5",
    name: "Sophia Williams",
    designation: "HR Specialist",
    email: "sophia.williams@example.com",
    status: "Active",
    hours: 30,
    income: "4000",
  },
];

export const OverviewPageList = ({ children }: PropsWithChildren) => {
  getData();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Received values of form: ', values);
      // Here you would typically send a request to your backend API to add the new employee
      setIsModalVisible(false);
      postData(values);
      // Optionally reset form
      form.resetFields();
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const { Option } = Select;
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="+92">+92</Option>
      </Select>
    </Form.Item>
  );

  const [fileList, setFileList] = useState<any[]>([]);

  const handleChange = ({ fileList: newFileList }: any) => setFileList(newFileList);

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }

    const isAlreadyOneFile = fileList.length >= 1;
    if (isAlreadyOneFile) {
      message.error('You can only upload one file!');
      return Upload.LIST_IGNORE;
    }
    return isImage;
  };

  interface FormData {
    EmpNo: string;
    Name: string;
    Designation: string;
    email: string;
    phoneNo: string;
    employementStatus: 'intern' | 'probation' | 'permanent';
    hubstaffEnabled: boolean;
    salarySlipRequired: boolean;
    leavesRemaining: number;
    grossSalary: number;
    joinDate: moment.Moment;  // Using moment.js if your DatePicker is configured with it
    permanentDate?: moment.Moment;
    lastWorkingDay?: moment.Moment;
    prefix: string;
  }

  async function postData(formData: FormData) {
    const formattedData = {
      data: {
        empNo: formData.EmpNo,
        Name: formData.Name,
        Designation: formData.Designation,
        joinDate: formData.joinDate.format('YYYY-MM-DD'),
        permanentDate: formData.permanentDate?.format('YYYY-MM-DD'),
        hubstaffEnabled: formData.hubstaffEnabled,
        employementStatus: formData.employementStatus,
        grossSalary: formData.grossSalary,
        leavesRemaining: formData.leavesRemaining,
        salarySlipRequired: formData.salarySlipRequired,
        lastWorkingDay: formData.lastWorkingDay?.format('YYYY-MM-DD'),
        phoneNo: ("0" + formData.phoneNo),
        // formData.prefix
        email: formData.email
      }
    };
    console.log(formattedData);
    try {
      const response = await axios.post('http://localhost:1337/api/employees', JSON.stringify(formattedData),
        {
          headers: {
            'Authorization': "Bearer 9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1",
            'Content-Type': "application/json"
          }
        });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error posting data:', error.response ? error.response.data : error);
    }
  }

  return (
    <>
      <List
        title="Overview"
        headerButtons={() => {
          return <CreateButton
            size="large"
            onClick={showModal}
          >
            Add new account
          </CreateButton>
        }}
      >
        <Table dataSource={data} rowKey="id">
          <Table.Column title="ID" dataIndex="id" key="id" width={80} sorter />
          <Table.Column title="Name" dataIndex="name" key="name" width={80} />
          <Table.Column title="Designation" dataIndex="designation" key="designation" width={80} />
          <Table.Column title="Email" dataIndex="email" key="email" width={80} />
          <Table.Column title="Status" dataIndex="status" key="status" width={80} />
          <Table.Column title="Hours" dataIndex="hours" key="hours" width={80} />
          <Table.Column title="Income" dataIndex="income" key="income" width={80} align="center" />
          <Table.Column
            title="Actions"
            key="actions"
            fixed="right"
            align="center"
            width={80}
            render={() => {
              return (
                <Flex align="center" gap={8}>
                  <EditButton
                    hideText
                    icon={<EyeOutlined />}
                  />
                </Flex>
              );
            }}
          />
        </Table>
      </List>

      <Modal
        title="Add New Employee"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" initialValues={{
          salarySlipRequired: false,
          hubstaffEnabled:false
        }}
        >
          <Form.Item
            name="EmpNo"
            label="Employee ID"
            rules={[{ required: true, message: 'Please input the employee ID!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Name"
            label="Name"
            rules={[{ required: true, message: 'Please input the employee name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Designation"
            label="Designation"
            rules={[{ required: true, message: 'Please input the designation!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNo"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              {
                pattern: new RegExp(/^\d{10}$/),
                message: 'Phone number must be exactly 10 digits!'
              }
            ]}
          >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="employementStatus"
            label="Employee Status"
            rules={[{ required: true, message: 'Please select employee status!' }]}
          >
            <Select placeholder="Emploee Status">
              <Option value="Intern">Intern</Option>
              <Option value="Probation">Probation</Option>
              <Option value="Permanent">Permanent</Option>
            </Select>
          </Form.Item>
          <Form.Item name="hubstaffEnabled" label="Hubstaff Enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="salarySlipRequired" label="Salary Slip Required" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="leavesRemaining" label="Leaves Remaining">
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="grossSalary"
            label="Salary"
            rules={[
              { required: true, message: 'Please input the salary!' },
              { type: 'number', min: 0, message: 'Salary must be a non-negative number!' }
            ]}
          >
            {/* Using InputNumber for better control over numerical input */}
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="joinDate"
            label="Date of Joining"
            rules={[{ required: true, message: 'Please enter the date of joining' }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="permanentDate" label="Date of Permanent Status">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="lastWorkingDay" label="Date of Last Working Day">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          {/* <Form.Item
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              action="http://example.com/upload.do"  // Replace with your actual upload URL
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              accept="image/*"  // Accepts all image types
            >
              {fileList.length >= 1 ? null : (
                <button style={{ border: 0, background: 'none' }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              )}
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>

      {children}
    </>
  );
};
