import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import { Layout as AntdLayout, Avatar, Space, Switch, Typography, Button, Input, Flex,theme } from "antd";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import logo from '../../../public/logo.png'; // Ensure the logo path is correct
import './style.css';
import {IconMoon} from './icons/icon-moon.tsx';
import {IconSun} from './icons/icon-sun.tsx';

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <AntdLayout.Header className={`header ${mode}`}>
      <div className="header-content">
        <Space>
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
          <Text strong className="title">Automator</Text>
        </Space>
        <Flex horizontal gap="50px" justify="flex-end">
          <Input.Search placeholder="Search..." style={{ width: 200 }} />
          <Button
            className="mode-toggle-button"
            shape="circle"
            onClick={toggleMode}
            icon={mode === 'dark' ? <IconSun /> : <IconMoon />}
          />
          <Button type="primary" onClick={() => console.log('Logout')} danger>Logout</Button>
        </Flex>
      </div>
    </AntdLayout.Header>
  );
};
