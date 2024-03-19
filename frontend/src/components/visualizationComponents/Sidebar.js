import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { BiLogoGoogle, BiLogoBing } from 'react-icons/bi';
import { SiDuckduckgo } from 'react-icons/si';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function SentimentPieChart() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="d-flex align-items-center text-success" >
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: '#2E3337',
          },
        }}
        collapsed={collapsed}
        onMouseEnter={toggleSidebar}
        onMouseLeave={toggleSidebar}
      >
        <Menu>
          <SubMenu label="Google" icon={<BiLogoGoogle />}>
          <MenuItem> Pie chart </MenuItem>
            <MenuItem> Classified Snippets </MenuItem>
            <MenuItem> Sentiment Trend </MenuItem>
            <MenuItem> Sentiment Comparison </MenuItem>
            <MenuItem> Individual Snippet Sentiment </MenuItem>
          </SubMenu>
          <SubMenu label="Bing" icon={<BiLogoBing />}>
          <MenuItem> Pie chart </MenuItem>
            <MenuItem> Classified Snippets </MenuItem>
            <MenuItem> Sentiment Trend </MenuItem>
            <MenuItem> Sentiment Comparison </MenuItem>
            <MenuItem> Individual Snippet Sentiment </MenuItem>
          </SubMenu>
          <SubMenu label="DuckDuckGo" icon={<SiDuckduckgo />}>
            <MenuItem> Pie chart </MenuItem>
            <MenuItem> Classified Snippets </MenuItem>
            <MenuItem> Sentiment Trend </MenuItem>
            <MenuItem> Sentiment Comparison </MenuItem>
            <MenuItem> Individual Snippet Sentiment </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>

        </div>
      
    
  );
}

