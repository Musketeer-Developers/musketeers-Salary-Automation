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
import { EyeOutlined, SearchOutlined, BookOutlined } from "@ant-design/icons";
import { Col, Row, Avatar, Flex, Input, Select, Table, Form, Card, Typography } from "antd";

// const api = axios.create({
//   baseURL:'http://localhost:1337/api/employees'
// })



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
  return (
    <>
      <List
        title="Overview"
        headerButtons={() => {
          return <CreateButton size="large">Add new account</CreateButton>;
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

      {children}
    </>
  );
};
