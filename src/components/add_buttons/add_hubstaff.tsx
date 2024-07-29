import React from 'react';
import { Modal, Button, Form, Divider, Typography, DatePicker, InputNumber } from 'antd';

interface HubstaffHoursProps {
    isVisible: boolean;
    handleClose: () => void;
}

const HubstaffHours: React.FC<HubstaffHoursProps> = ({ isVisible, handleClose }) => {
    const [form] = Form.useForm();
    const { Title } = Typography;
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Received values of form: ', values);
            handleClose();
            form.resetFields();
        } catch (error) {
            console.error('Validation Failed:', error);
        }
    };

    return (
        <Modal
            title="Add Hubstaff Hours"
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
                <Form.Item label="Hubstaff Hours">
                    <Form.Item
                        name={"hours"}
                        rules={[{ required: true, message: 'Please enter the Hubstaff hours' }]}
                        noStyle
                    >
                        <InputNumber min={0} max={24} defaultValue={0} style={{ width: "100%" }} />
                    </Form.Item>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default HubstaffHours;
