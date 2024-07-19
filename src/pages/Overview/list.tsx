import type { PropsWithChildren } from "react";
import { getDefaultFilter, useGo } from "@refinedev/core";
import {
  CreateButton,
  // EditButton,
  // FilterDropdown,
  List,
  // NumberField,
  // NumberField,
  // getDefaultSortOrder,
  // useSelect,
  // useTable,
  Show,
  useForm,
} from "@refinedev/antd";
import { EyeOutlined, SearchOutlined,BookOutlined } from "@ant-design/icons";

import { Col, Row } from "antd";

import { Avatar, Flex, Input, Select, Table, Form, Card, Typography } from "antd";
// import { Table,Form } from "antd";
// import { API_URL } from "@/utils/constants";

export const OverviewPageList = ({ children }: PropsWithChildren) => {
  return (
    <>
      <List
        title="Overview"
        headerButtons={() => {
          return <CreateButton size="large">Add new account</CreateButton>;
        }}
      >
        <Table>
          <Table.Column title="ID" width={80} sorter />
          <Table.Column title="Name" width={80} />
          <Table.Column title="Designation" width={80} />
          <Table.Column title="Email" width={80} />
          <Table.Column title="Status" width={80} />
          <Table.Column title="Hours" width={80} />
          <Table.Column title="Income" width={80} align="center" />
          <Table.Column title="Actions" width={80} />
        </Table>
      </List>
      
      {children}
    </>
  );
};
