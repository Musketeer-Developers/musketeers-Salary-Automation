import React from "react";
import { AuthPage } from "@refinedev/antd";
import {Space,Typography} from 'antd';
import logo from '../../logo.png';

export const Login = () => {
    const { Text } = Typography;
    return (
        <AuthPage
            type="login"
            registerLink={false}
            forgotPasswordLink={false}
            title={
                <Space>
                    <img src={logo} alt="Logo" style={{ height: '80px' }} />
                    <Text strong style={{marginLeft:"12px", fontSize:"30px"}}>Automator</Text>
                </Space>
            }
            formProps={{
                initialValues: {
                    email: "demo@demo.com",
                    password: "demodemo",
                },
            }}
        />
    )
};