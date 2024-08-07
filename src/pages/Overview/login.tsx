import { AuthPage } from "@refinedev/antd";
import {Space,Typography} from 'antd';
import logo from '../../logo.png';

const { Text } = Typography;

export const Login = () => {
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
        />
    )
};