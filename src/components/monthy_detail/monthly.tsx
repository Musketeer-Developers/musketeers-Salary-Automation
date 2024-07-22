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
import { DatePicker, Space } from 'antd';

import {
    MailOutlined,
    PhoneOutlined,
    ExportOutlined,
    ContainerOutlined,
    ClockCircleOutlined,
    KeyOutlined,
    DollarOutlined,
    CalendarOutlined,
    EditOutlined,
} from "@ant-design/icons";

export const Monthlylog = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Space direction="vertical" size={16} style={{ width: '100%', marginBottom: "30px" }}>
                <Card
                    bordered={false}
                    title={
                        <Flex gap={12} align="center">
                            {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                            <CalendarOutlined />
                            <Typography.Text>Monthly Overview</Typography.Text>
                        </Flex>
                    }
                    styles={{
                        header: {
                            padding: "0 16px",
                        },
                        body: {
                            padding: "0",
                        },
                    }}
                >
                    <Table rowKey="id">
                        <Table.Column title="Remaining paid leaves" width={80} />
                        <Table.Column title="No of absence" key="name" width={80} />
                        <Table.Column title="Late count" key="hubstaff-hours" width={80} />
                        <Table.Column title="Salary paid" key="manual-hours" width={80} />
                        <Table.Column title="Public holidays" key="hour-rate" width={80} />
                        <Table.Column title="Last salary change" key="earned-amount" width={80} />
                    </Table>
                </Card>
            </Space>

            <Space direction="vertical" size={16} style={{ width: '100%', marginBottom: "30px" }}>
                <Card
                    bordered={false}
                    title={
                        <Flex gap={12} align="center">
                            {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                            <DollarOutlined />
                            <Typography.Text>Salary Details</Typography.Text>
                        </Flex>
                    }
                    styles={{
                        header: {
                            padding: "0 16px",
                        },
                        body: {
                            padding: "0",
                        },
                    }}
                >
                    <Table rowKey="id">
                        <Table.Column title="Withholding tax" width={80} />
                        <Table.Column title="Basic Salary" key="name" width={80} />
                        <Table.Column title="Medical Allowance" key="hubstaff-hours" width={80} />
                        <Table.Column title="Gross Salary " key="manual-hours" width={80} />
                        <Table.Column title="Net salary" key="hour-rate" width={80} />
                    </Table>
                </Card>
            </Space>
        </>
    );
};
