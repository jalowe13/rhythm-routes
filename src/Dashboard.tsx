// Dashboard.tsx
// Jacob Lowe
import "./Dashboard.css";
import React from "react";
import { API, ENDPOINTS } from "./Api.ts";
import { Button, Col, Collapse, Divider, Image, Row } from "antd";

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
  /*
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
  */
  return (
    <>
      <h4>Rhythm & Routes</h4>
      <Divider orientation="left" style={{ color: "red" }}></Divider>
      <Row justify="start" gutter={[8, 8]}>
        {/* Menu Col */}
        <Col span={5}>
          Instrument Menu
          <div>
            <Collapse
              items={[
                {
                  key: "1",
                  label: (
                    <span className="instrument-dropdown">Percussion</span>
                  ),
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
            <Collapse
              items={[
                {
                  key: "1",
                  label: <span className="instrument-dropdown">Guitar</span>,
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
            <Collapse
              items={[
                {
                  key: "1",
                  label: <span className="instrument-dropdown">Bass</span>,
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
            <Collapse
              items={[
                {
                  key: "1",
                  label: <span className="instrument-dropdown">Vocals</span>,
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
            <Collapse
              items={[
                {
                  key: "1",
                  label: <span className="instrument-dropdown">Horns</span>,
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
            <Collapse
              items={[
                {
                  key: "1",
                  label: <span className="instrument-dropdown">Strings</span>,
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
            <Collapse
              items={[
                {
                  key: "1",
                  label: <span className="instrument-dropdown">Synth</span>,
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
            <Collapse
              items={[
                {
                  key: "1",
                  label: <span className="instrument-dropdown">Other</span>,
                  children: (
                    <Image
                      width={32}
                      height={32}
                      draggable
                      preview={false}
                      src="https://mario.wiki.gallery/images/0/05/Music-block.png"
                    />
                  ),
                },
              ]}
            />
          </div>
        </Col>
        {/* Editor Col */}
        <Col span={40}>
          Editor everything for the editor goes here you would drag and drop
          your components here and they would be saved to the database and
          websocket
          {/* Percussion, Guitar, Bass, Vocals, Keys, Horns, Strings, Synth, Other*/}
          <div
            className="drop-zone"
            style={{
              minHeight: "200px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div
              className="line"
              style={{
                top: "20%",
              }}
            ></div>
            <div className="line" style={{ top: "40%" }}></div>
            <div className="line" style={{ top: "60%" }}></div>
            <div className="line" style={{ top: "80%" }}></div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
