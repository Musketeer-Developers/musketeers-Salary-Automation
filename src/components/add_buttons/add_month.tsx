import React from 'react';
import { Modal, Button, Form, Divider, Typography, Select, DatePicker, InputNumber } from 'antd';
import axios from 'axios';
import { useNotification } from "@refinedev/core";

interface MonthProps {
    isVisible: boolean;
    handleClose: () => void;
}

interface FormData {
    month: string | number;
    year: moment.Moment;
    totaldays: string | number;
}

const Month: React.FC<MonthProps> = ({ isVisible, handleClose }) => {
    const { open, close } = useNotification();
    const [form] = Form.useForm();
    const { Title } = Typography;

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Received values of form: ', values);
            handleClose();
            initializeMonth(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation Failed:', error);
        }
    };

    async function initializeMonth(formData: FormData) {
        const MonthData = {
                month: formData.month,
                year: formData.year?.format('YYYY'),
                totalDays: formData.totaldays
        };
        console.log(MonthData);
        try {
            const response = await axios.post('http://localhost:1337/api/month-data/initializeMonthData', JSON.stringify(MonthData),
                {
                    headers: {
                        'Authorization': "Bearer 9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1",
                        'Content-Type': "application/json"
                    }
                });
            console.log('Response:', response.data);
            open?.( {type:'success',message: 'Success!',description: 'Successfully added!'});
        } catch (error:any) {
            console.error('Error posting data:', error);
            open?.( {type:'error',message: `Error!`,description: `${error?.response?.data?.error?.message}`});
        }
    }
    return (
        <Modal
            title="Add Month"
            visible={isVisible}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                </Button>
            ]}
        >
            <Form form={form} layout="vertical" initialValues={{}}>
                <Divider></Divider>
                <Form.Item label="Month">
                    <Form.Item
                        name="month"
                        rules={[{ required: true, message: 'Please input the month!' }]}
                        noStyle
                    >
                        <Select
                            showSearch
                            placeholder="Select month"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                { value: 'january', label: 'January' },
                                { value: 'february', label: 'February' },
                                { value: 'march', label: 'March' },
                                { value: 'april', label: 'April' },
                                { value: 'may', label: 'May' },
                                { value: 'june', label: 'June' },
                                { value: 'july', label: 'July' },
                                { value: 'august', label: 'August' },
                                { value: 'september', label: 'September' },
                                { value: 'october', label: 'October' },
                                { value: 'november', label: 'November' },
                                { value: 'december', label: 'December' },
                            ]}
                        />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Year">
                    <Form.Item
                        name="year"
                        rules={[{ required: true, message: 'Please input the year!' }]}
                        noStyle
                    >
                        <DatePicker picker="year" style={{ width: "100%" }} />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Total Days">
                    <Form.Item
                        name="totaldays"
                        rules={[{ required: true, message: 'Please input the days!' }]}
                        noStyle
                    >
                        <InputNumber min={29} max={31} style={{ width: "100%" }} placeholder={"Total Days"} />
                    </Form.Item>
                </Form.Item>
                <Divider></Divider>
            </Form>
        </Modal >
    );
};

export default Month;