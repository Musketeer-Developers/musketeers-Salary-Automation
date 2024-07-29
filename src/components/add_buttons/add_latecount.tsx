import React from 'react';
import { Modal, Button, Form ,Divider, Typography, DatePicker} from 'antd';

interface LateCountProps {
    isVisible: boolean;
    handleClose: () => void;
}

const LateCount: React.FC<LateCountProps> = ({ isVisible, handleClose }) => {
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
            title="Add Late"
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
                    name={"latedate"}
                    rules={[{ required: true, message: 'Please enter the date' }]}
                     noStyle
                     >
                        <DatePicker style={{ width: "100%" }}/>
                    </Form.Item>
                </Form.Item>
                <Divider></Divider>
            </Form>
        </Modal >
    );
};

export default LateCount;