import { Flex, Table, Card, Typography } from "antd";
import { Space } from 'antd';

import {
    DollarOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

export const Monthlylog = () => {
    return (
        <>
            <Space direction="vertical" size={16} style={{ width: '100%', marginBottom: "30px" }}>
                <Card
                    bordered={false}
                    title={
                        <Flex gap={12} align="center">
                            
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
