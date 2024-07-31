import React from 'react';
import { Modal, Button, Form, Divider, Typography, DatePicker } from 'antd';
import axios from 'axios';
import {API_URL} from '../../constants';
import {axiosInstance} from '../../authProvider';

interface HolidayProps {
    isVisible: boolean;
    handleClose: () => void;
}

interface Date {
    date: moment.Moment;
}

const Holiday: React.FC<HolidayProps> = ({ isVisible, handleClose }) => {
    const [form] = Form.useForm();
    const { Title } = Typography;

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Received values of form: ', values);
            handleClose();
            updateHoliday(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation Failed:', error);
        }
    };

    async function updateHoliday(formData:Date) {
        const data={
            date:formData.date?.format('YYYY-MM-DD'),
        }
        console.log(data);
        try{
            const response = await axiosInstance.post(`${API_URL}/month-data/add-holiday`, JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(response.data);
        }catch(error:any)
        {
            console.error('Error posting data:', error);
        }
    }

    return (
        <Modal
            title="Add Holiday"
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
                <Form.Item label="Date">
                    <Form.Item
                        name={"date"}
                        rules={[{ required: true, message: 'Please enter the Date' }]}
                        noStyle
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form.Item>
                <Divider></Divider>
            </Form>
        </Modal >
    );
};

export default Holiday;