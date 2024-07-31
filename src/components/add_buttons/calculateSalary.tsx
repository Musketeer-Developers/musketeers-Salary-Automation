import React from 'react';
import { Modal, Button, Form, Divider, Select, DatePicker} from 'antd';
import axios from 'axios';
import { useNotification } from "@refinedev/core";
import {API_URL} from '../../constants'; 
import {axiosInstance} from '../../authProvider';

interface CalculateProps {
    isVisible: boolean;
    handleClose: () => void;
}

interface FormData {
    month: string | number;
    year: moment.Moment;
}

const Calculate: React.FC<CalculateProps> = ({ isVisible, handleClose }) => {
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
            const response = await axiosInstance.post(`${API_URL}/monthly-salary/calculate-salary`, JSON.stringify(MonthData),
                {
                    headers: {
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
            title="Caluclate Salary"
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
                                { value: 1, label: 'January' },
                                { value: 2, label: 'February' },
                                { value: 3, label: 'March' },
                                { value: 4, label: 'April' },
                                { value: 5, label: 'May' },
                                { value: 6, label: 'June' },
                                { value: 7, label: 'July' },
                                { value: 8, label: 'August' },
                                { value: 9, label: 'September' },
                                { value: 10, label: 'October' },
                                { value: 11, label: 'November' },
                                { value: 12, label: 'December' },
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

export default Calculate;