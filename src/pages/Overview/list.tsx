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
import employees from '../../../Employees.json';

const data = employees;

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
          <Table.Column title="ID" dataIndex="empNo" key="empNo" width={80} sorter />
          <Table.Column title="Name" dataIndex="Name" key="Name" width={80} />
          <Table.Column title="Designation" dataIndex="Designation" key="Designation" width={80} />
          <Table.Column title="Email" dataIndex="Email" key="Email" width={80} />
          <Table.Column title="Hubstaff" dataIndex="hubstaffEnabled" key="hubstaffEnabled" width={80} />
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
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
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
