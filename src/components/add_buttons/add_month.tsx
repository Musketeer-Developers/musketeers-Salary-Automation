import React from 'react';
import { Modal, Button, Form, Divider, Select, DatePicker} from 'antd';
import axios from 'axios';
import { useNotification } from "@refinedev/core";
import {token} from '../../constants'; 

interface MonthProps {
    isVisible: boolean;
    handleClose: () => void;
}

interface FormData {
    month: string | number;
    year: moment.Moment;
}

const Month: React.FC<MonthProps> = ({ isVisible, handleClose }) => {
    const { open } = useNotification();
    const [form] = Form.useForm();

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
        };
        console.log(MonthData);
        try {
            const response = await axios.post('http://localhost:1337/api/month-data/initializeMonthData', JSON.stringify(MonthData),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
                <Divider></Divider>
            </Form>
        </Modal >
    );
};

export default Month;