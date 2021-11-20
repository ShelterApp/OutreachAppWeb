import React from "react";
import Link from "next/link";
import style from "./Component.module.scss";
import styles from "styles/Home.module.scss";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { userService } from "services";

export interface ButtonProps {
    title?: string;
    search?: boolean;
    onClick?: Function;
    user?:object;
    back?:string;
}

const Header = ({ title,user,back }: ButtonProps) => {
    const [state, setState] = React.useState(false);
    const logout = () => {
        userService.logout();
      };
    
    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setState(false)}
            onKeyDown={() => setState(false)}
        >
            <List>
    <div style={{ textAlign: "center" }}>{user?.email}</div>
            </List>
            <Divider />
            <List>
                {routeSideMenu[user.userType].map(({text,link}, index) => (
                  <Link href={link?link:'#'} passHref key={index}>
                   <ListItem button onClick={()=>text=='Logout'?logout():null}>
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
                style={{ width: "15%", paddingLeft: 10 }}>
                {back?
                <Link href={back} passHref>
                    <ArrowBackIosNewIcon
                    className="cursor-pointer"
                    fontSize="large"
                />
                </Link>
                :<MenuIcon
                className="cursor-pointer"
                fontSize="large"
                onClick={() => setState(true)}
            /> }
                
            </div>
            <div
                className={style.titleHeader}
                style={{ width: "70%", textAlign: "center", color: "white" }} >
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
                    {!!user && list()}
                </Drawer>
        </div>
    );
};
export default Header;
const routeSideMenu = {
  Admin: [
      { text: "Add Camp", link: "/add-camp" },
      { text: "Add Event", link: "/add-event" },
      { text: "Add Supplies", link: "/add-supplies" },
      { text: "Add Volunteer", link: "/volunteers/add/" },
      { text: "Add Organization", link: "/organizations/add/" },
      { text: "Manage Camps", link: "/manage-camp" },
      { text: "Manage Events", link: "/manage-events" },
      { text: "Manage Supplies", link: "/manage-supplies" },
      { text: "Manage Volunteer", link: "/volunteers" },
      { text: "Manage Organization", link: "/organizations" },
      { text: "Manage Requests", link: "/manage-requests" },
      { text: "My Inventory Dashboard", link: "/my-inventory-dashboard" },
      { text: "All Organizations Dashboard", link: "/my-orgnizations-dashboard" },
      { text: "Update Profile", link: "/update-profile" },
      { text: "Update Password", link: "/update-password" },
      { text: "Show Tutorial", link: "/show-tutorial" },
      { text: "Donate", link: "/donate" },
      { text: "Terms of Use", link: "/terms-of-use" },
      { text: "Privacy Policy", link: "/privacy-policy" },
      { text: "About Outreach App", link: "/about" },
      { text: "Logout", },
  ],
  orgnLead:[
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/add-event" },
    { text: "Add Supplies", link: "/add-supplies" },
    { text: "Add Volunteer", link: "/volunteers/add/" },
    { text: "Manage Camps", link: "/manage-camp" },
    { text: "Manage Events", link: "/manage-events" },
    { text: "Manage Supplies", link: "/manage-supplies" },
    { text: "Manage Volunteer", link: "/volunteers" },
    { text: "Manage Requests", link: "/manage-requests" },
    { text: "My Inventory Dashboard", link: "/my-inventory-dashboard" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    { text: "Show Tutorial", link: "/show-tutorial" },
    { text: "Donate", link: "/donate" },
    { text: "Terms of Use", link: "/terms-of-use" },
    { text: "Privacy Policy", link: "/privacy-policy" },
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
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "About Outreach App", link: "/about" },
    { text: "Logout", },
  ]
};
