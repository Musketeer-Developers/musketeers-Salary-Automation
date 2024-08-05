import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Space,
  Typography,
  Button,
  Input,
  Flex,
  theme,
} from "antd";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import logo from "../../logo.png";
import "./style.css";
import { IconMoon } from "./icons/icon-moon";
import { IconSun } from "./icons/icon-sun";
import { useLogout } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

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
  const { mutate, isLoading } = useLogout();

  const toggleMode = () => setMode(mode === "light" ? "dark" : "light");

  const navigate = useNavigate();
  const goToHomePage = () => {
    console.log("go To Overview clicked");
    navigate("/");
  };
  const goToAllEmployeesPage = () => {
    console.log("go To Salary List clicked");
    navigate("/allemployees");
  };

  const onChange = (key: string) => {
    if (key == "1") {
      goToHomePage();
    } else if (key == "2") {
      goToAllEmployeesPage();
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Overview",
    },
    {
      key: "2",
      label: "Salary List",
    },
  ];

  return (
    <AntdLayout.Header className={`header ${mode}`}>
      <div className="header-content justify-between ">
        <Space>
          <img
            src={logo}
            alt="Logo"
            onClick={goToHomePage}
            style={{ cursor: "pointer", height: "40px" }}
          />
          <Text
            strong
            className="title"
            onClick={goToHomePage}
            style={{ cursor: "pointer" }}
          >
            Automator
          </Text>
        </Space>
        <Space style={{ marginTop: "25px", marginLeft: "200px" }} >
          <Tabs
            size="large"
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            onTabClick={(key) => onChange(key)} // Handle tab click
          />
        </Space>
        <Flex gap="50px" justify="flex-end">
          <Input.Search placeholder="Search..." style={{ width: 200 }} />
          <Button
            className="mode-toggle-button"
            shape="circle"
            onClick={toggleMode}
            icon={mode === "dark" ? <IconSun /> : <IconMoon />}
          />
          <Button
            type="primary"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              mutate();
            }}
            disabled={isLoading}
            danger
          >
            Logout
          </Button>
        </Flex>
      </div>
    </AntdLayout.Header>
  );
};
