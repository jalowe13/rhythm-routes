import React from "react";
import { HomeFilled } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useView, View } from "../App.tsx";

const MenuHeader: React.FC = () => {
  // States
  const { view, setView } = useView();
  const handleClickMenu: MenuProps["onClick"] = (e) => {
    console.log(e.key);
    console.log(view);
    switch (e.key) {
      case "sub1":
        setView(View.Dashboard);
        break;
    }
  };

  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      key: "sub1",
      label: "Dashboard",
      icon: <HomeFilled />,
    },
  ];

  // Default selected Menu Key
  return (
    <div className="App">
      <Menu
        defaultSelectedKeys={["sub1"]}
        defaultOpenKeys={["sub1"]}
        mode="horizontal"
        items={items}
        theme="dark"
        onClick={handleClickMenu}
      />
    </div>
  );
};

export default MenuHeader;
