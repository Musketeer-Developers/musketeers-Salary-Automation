import React from 'react';
import { Modal, Button, Form, Divider, Typography, DatePicker } from 'antd';
import axios from 'axios';
import {API_URL} from '../../constants';


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
            const response = await axios.post(`${API_URL}/month-data/add-holiday`, JSON.stringify(data), {
                headers: {
                    'Authorization': "Bearer 9bd8af6b6900627b415eded84617f1d87d0a74136d3491a75b00c94127d77dd29763855f802afa232aedc294bc78e1c66e18c7cc854c28644288877aa7aafea65012ac05aa18230be1db9197bbed78381e8b6c2ca9ddacb5385427b594e660fabd6e269fac2464ba1e717c6b6ee48f7131ec5fb2647cf08ee83a8d761b9545b1",
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