import React from "react";
import Link from "next/link";
import style from "./Component.module.scss";
import styles from "styles/Home.module.scss";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export interface ButtonProps {
    title?: string;
    search?: boolean;
    onClick?: Function;
}

const Header = ({ title }: ButtonProps) => {
    const [state, setState] = React.useState(false);

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setState(false)}
            onKeyDown={() => setState(false)}
        >
            <List>
                <div style={{ textAlign: "center" }}>Raj.lanka@outlook.com</div>
            </List>
            <Divider />
            <List>
                {routeSideMenu.admin.map(({text,link}, index) => (
                  <Link href={link?link:'#'} passHref key={index}>
                   <ListItem button >
                        <ListItemText primary={text} />
                    </ListItem>
                  </Link>
                ))}
            </List>
        </Box>
    );

    return (
        <div className={style.containerHeader}>
            <div
                className={style.center}
                style={{ width: "15%", paddingLeft: 10 }}
            >
                <MenuIcon
                    className="cursor-pointer"
                    fontSize="large"
                    onClick={() => setState(true)}
                />
            </div>
            <div
                className={style.titleHeader}
                style={{ width: "70%", textAlign: "center", color: "white" }}
            >
                {title}
            </div>
            <div className={style.center} style={{ width: "15%" }}>
                {/* <SearchIcon className="cursor-pointer" fontSize="large" /> */}
            </div>
            <Drawer
                    anchor="left"
                    open={state}
                    onClose={() => setState(false)}
                >
                    {list()}
                </Drawer>
        </div>
    );
};
export default Header;
const routeSideMenu = {
  admin: [
      { text: "Add Camp", link: "/add-camp" },
      { text: "Add Event", link: "/add-event" },
      { text: "Add Supplies", link: "/add-supplies" },
      { text: "Add Volunteer", link: "/add-volunteer" },
      { text: "Add Organization", link: "/add-organization" },
      { text: "Manage Camps", link: "/manage-camp" },
      { text: "Manage Events", link: "/manage-events" },
      { text: "Manage Supplies", link: "/manage-supplies" },
      { text: "Manage Volunteer", link: "/manage-volunteer" },
      { text: "Manage Organization", link: "/manage-organization" },
      { text: "Manage Requests", link: "/manage-requests" },
      { text: "My Inventory Dashboard", link: "/my-inventory-dashboard" },
      { text: "All Organizations Dashboard", link: "/my-orgnizations-dashboard" },
      { text: "Update Profile", link: "/update-profile" },
      { text: "Update Password", link: "/update-password" },
      { text: "Show Tutorial", link: "/show-tutorial" },
      { text: "Donate", link: "/donate" },
      { text: "Terms of Use", link: "/terms-of-use" },
      { text: "Privacy-policy", link: "/privacy-policy" },
      { text: "About Outreach App", link: "/about" },
      { text: "Logout", },
  ],
  orgnLead:[
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/add-event" },
    { text: "Add Supplies", link: "/add-supplies" },
    { text: "Add Volunteer", link: "/add-volunteer" },
    { text: "Manage Camps", link: "/manage-camp" },
    { text: "Manage Events", link: "/manage-events" },
    { text: "Manage Supplies", link: "/manage-supplies" },
    { text: "Manage Volunteer", link: "/manage-volunteer" },
    { text: "Manage Requests", link: "/manage-requests" },
    { text: "My Inventory Dashboard", link: "/my-inventory-dashboard" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    { text: "Show Tutorial", link: "/show-tutorial" },
    { text: "Donate", link: "/donate" },
    { text: "Terms of Use", link: "/terms-of-use" },
    { text: "Privacy-policy", link: "/privacy-policy" },
    { text: "About Outreach App", link: "/about" },
    { text: "Logout", },
  ],
  volunteer:[
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/add-event" },
    { text: "Add Claims", link: "/add-claims" },
    { text: "My Work", link: "/my-work" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    { text: "Show Tutorial", link: "/show-tutorial" },
    { text: "Donate", link: "/donate" },
    { text: "Terms of Use", link: "/terms-of-use" },
    { text: "Privacy-policy", link: "/privacy-policy" },
    { text: "About Outreach App", link: "/about" },
    { text: "Logout", },
  ]
};
