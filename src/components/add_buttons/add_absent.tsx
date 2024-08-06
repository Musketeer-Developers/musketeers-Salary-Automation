import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Divider, Typography, DatePicker } from 'antd';
import { useNotification } from "@refinedev/core";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { API_URL} from "../../constants";
import { axiosInstance } from '../../authProvider';

interface AbsentProps {
    isVisible: boolean;
    handleClose: () => void;
    setRefreshData:(refresh:boolean) => void;
}

const Absent: React.FC<AbsentProps> = ({ isVisible, handleClose, setRefreshData }) => {
    const { id } = useParams<{ id: string }>();
    const { open, close } = useNotification();
    const [form] = Form.useForm();
    const { Title } = Typography;
    const [checkDate, setcheckDate] = useState(false);
    const [dailyWorkID, setdailyWorkID] = useState(0);
    const [SalaryMonthID, setSalaryMonthID] = useState(0);
    const [Count, setCount] = useState(0);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Received values of form: ', values);
            handleClose();
            await putData(values);
            setRefreshData(true);
            form.resetFields();
        } catch (error) {
            console.error('Validation Failed:', error);
        }
    };

    interface Date {
        workDate: moment.Moment;
    }

    useEffect(() => {
        if (dailyWorkID !== 0) {
            const Data2 = {
                data: {
                    isLeave: true
                }
            };
            async function update() {
                try {
                    const response = await axiosInstance.put(`${API_URL}/daily-works/${dailyWorkID}`, JSON.stringify(Data2),
                        {
                            headers: {
                                "Content-Type": "application/json",
                            }
                        });
                    console.log('Response-daily:', response.data);
                } catch (error: any) {
                    console.error('Error posting data:', error);
                    open?.({ type: 'error', message: `Error!`, description: `${error?.response?.data?.error?.message}` });
                }
            }
            update();
        }
    }, [dailyWorkID])

    useEffect(() => {
        if (SalaryMonthID !== 0) {
            const Data1 = {
                data: {
                    absentCount: Count + 1
                }
            };
            async function update() {
                try {
                    const response = await axiosInstance.put(`${API_URL}/monthly-salaries/${SalaryMonthID}`, JSON.stringify(Data1),
                        {
                            headers: {
                                "Content-Type": "application/json",
                            }
                        });
                    console.log('Response-monthly:', response.data);
                } catch (error: any) {
                    console.error('Error posting data:', error);
                    open?.({ type: 'error', message: `Error!`, description: `${error?.response?.data?.error?.message}` });
                }
                setCount(0);
            }
            update();
        }
    }, [SalaryMonthID])

    async function Employee() {
        try {
            const response = await axiosInstance.get(`${API_URL}/employees/${id}?populate=*`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            console.log('Response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error posting data:', error);
            open?.({ type: 'error', message: `Error!`, description: `${error?.response?.data?.error?.message}` });
        }
    }

    async function putData(formData: Date) {
        const date = formData.workDate?.format('YYYY-MM-DD');
        let attributes = await Employee();
        const MonthlySalaries = attributes.data.monthly_salaries;
        MonthlySalaries.map(async (item: any) => {
            try {
                const response = await axiosInstance.get(`${API_URL}/monthly-salaries/${item.id}?populate=*`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                console.log('Response:', response.data);
                const dailyWorks = response.data.data?.dailyWorks;
                dailyWorks.map((data: any) => {
                    if (data.workDate == date) {
                        console.log("found");
                        setcheckDate(true);
                        setdailyWorkID(data.id);
                        setSalaryMonthID(item.id);
                        setCount(item.absentCount);
                        open?.({ type: 'success', message: 'Success!', description: 'Successfully added!' });
                    }
                })
            } catch (error: any) {
                console.error('Error posting data:', error);
                open?.({ type: 'error', message: `Error!`, description: `${error?.response?.data?.error?.message}` });
            }
        });
    }

    return (
        <Modal
            forceRender
            title="Add Absent"
            open={isVisible}
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
            <Form form={form} layout="vertical">
                <Divider></Divider>
                <Form.Item label="Date">
                    <Form.Item
                        name={"workDate"}
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

export default Absent;