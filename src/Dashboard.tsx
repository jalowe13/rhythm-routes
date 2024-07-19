// Dashboard.tsx
// Jacob Lowe
import React from "react";
import { API, ENDPOINTS } from "./Api.ts";
import { Button } from "antd";

//type MenuItem = Required<MenuProps>['items'][number];
interface DashboardProps {
  items: { label: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const handleButtonClick = (endpoint: string, data?: any): void => {
    const example_endpoint = ENDPOINTS.HEALTH;
    console.log("Call the API with the endpoint: ", endpoint);
    console.log("Could be for example: " + example_endpoint);
    API.fetch(example_endpoint, data);
  };

  return (
    <div>
      <h1>Rhythm Routes</h1>
      <Button
        style={{ justifyContent: "center" }}
        type="primary"
        onClick={() => handleButtonClick("ENDPOINTS.HEALTH_CHECK")}
      >
        Test button
      </Button>
    </div>
  );
};

export default Dashboard;
