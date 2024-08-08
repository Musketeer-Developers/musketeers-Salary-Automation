import React from "react";
import { Modal, Button, Form, Divider, Input, Table } from "antd";
import { useNotification } from "@refinedev/core";
import { API_URL } from "../../constants";
import { axiosInstance } from "../../authProvider";
import type { TableColumnsType } from 'antd';
import moment from "moment";
import { useEffect, useState } from 'react';

interface HolidayProps {
  isVisible: boolean;
  handleClose: () => void;
  selectedDate: moment.Moment;
  setRefreshData: (refresh: boolean) => void;
}

interface Date {
  date: moment.Moment;
}

const Holiday: React.FC<HolidayProps> = ({ isVisible, handleClose, selectedDate,setRefreshData }) => {
  interface Employee {
    key: React.Key;
    name: string;
    empID: string; // Assuming each employee has a unique ID
  }
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const columns: TableColumnsType<Employee> = [
    {
      title: 'All Employees',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Employee[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };


  const { open } = useNotification();
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Received values of form: ", values);
      handleClose();
      await putHoliday(values);
      setRefreshData(true);
      form.resetFields();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  interface EmployeeData {
    empID: string;
    empName: string;
    isHoliday: boolean;
  }

  interface HolidayData {
    date: string;
    holidayName: string;
    employees: EmployeeData[];
  }


  async function putHoliday(formData: HolidayData) {
    let name;
    if(formData.holidayName === undefined){
      name="No holiday name provided";
    }
    else{
      name=formData.holidayName;
    }
    const data = {
      date: selectedDate.format("DD-MM-YYYY"),
      holidayName: formData.holidayName,
      employees: employees.map(emp => ({
        empID: emp.empID,
        empName: emp.name,
        isHoliday: selectedKeys.includes(emp.key)
      }))
    };
    console.log(JSON.stringify(data));
    try {
      const response = await axiosInstance.put(
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

  async function getData() {
    if (isVisible) {
      try {
        const response = await axiosInstance.get(`${API_URL}/month-data/get-holiday-info?date=${selectedDate.format("DD-MM-YYYY")}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.data) {
          if (response.data.holidayName !== "No holiday name provided") {
            form.setFieldsValue({
              holidayName: response.data.holidayName,
            });
          }
        }
        const formattedData = response.data.employees.map((emp: any) => ({
          key: emp.empID,
          name: emp.empName,
          empID: emp.empID,
          isHoliday: emp.isHoliday
        }));
        setEmployees(formattedData);
        const selected = formattedData.filter((emp: any) => emp.isHoliday).map((emp: any) => emp.key);
        setSelectedKeys(selected);
      } catch (error) {
        console.error('Error posting data:', error);
      }
    }
  }

  useEffect(() => {
    getData();
    form.resetFields();
  }, [selectedDate, isVisible])

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
            name="holidayName"
            // rules={[{ required: true, message: "Please enter the event name" }]}
            noStyle
          >
            <Input placeholder="holiday name" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Employees" style={{ width: "100%" }}>
          <Form.Item
            name="employees"
            // rules={[{ required: true, message: 'Please select at least one employee!' }]}
            noStyle
          >
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
                selectedRowKeys: selectedKeys,
                onChange: setSelectedKeys,
              }}
              columns={columns}
              dataSource={employees}
              pagination={false}
            />

          </Form.Item>
        </Form.Item>
        <Divider></Divider>
      </Form>
    </Modal>
  );
};

export default Holiday;
