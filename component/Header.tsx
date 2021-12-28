import React from "react";
import Link from "next/link";
import style from "./Component.module.scss";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
  user?: any;
  back?: string;
}
interface Role<String> {
  Admin: object[];
  orgnLead: object[];
  volunteer: object[];
}

const Header = ({ title, user, back, onClick }: ButtonProps) => {
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
        {routeSideMenu[user.userType].map(({ text, link }: any, index: number) => (
          <Link href={link ? link : '#'} passHref key={index}>
            <ListItem button onClick={() => text == 'Logout' ? logout() : null}>
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
        {
          onClick && typeof onClick === 'function' && (
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                padding: 0
              }}
              onClick={() => onClick()
            }>
              <ArrowBackIosNewIcon
                className="cursor-pointer"
                fontSize="large"
              />
            </button>
          )
        }
        {
          !onClick && (
            <>
              {
                back ?
                <Link href={back} passHref>
                  <ArrowBackIosNewIcon
                    className="cursor-pointer"
                    fontSize="large"
                  />
                </Link>
                : <MenuIcon
                  className="cursor-pointer"
                  fontSize="large"
                  onClick={() => setState(true)} />
              }
            </>
          )
        }
      </div>
      <div
        className={style.titleHeader}
        style={{ width: "70%", textAlign: "center", color: "white"  ,paddingTop:4 }} >
        {title}
      </div>
      <div className={style.center} style={{ width: "15%" }}>
        {/* <SearchIcon className="cursor-pointer" fontSize="large" /> */}
      </div>
      <Drawer
        anchor="left"
        open={state}
        onClose={() => setState(false)} >
        {!!user && list()}
      </Drawer>
    </div>
  );
};
export default Header;
const routeSideMenu: any = {
  Admin: [
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/events/add" },
    { text: "Add Supplies", link: "/supplies/add/" },
    { text: "Add Volunteer", link: "/volunteers/add/" },
    { text: "Add Organization", link: "/organizations/add/" },
    { text: "Add Supply Items", link: "/supply-items/add" },
    { text: "Manage Camps", link: "manage-camps" },
    { text: "Manage Events", link: "/events" },
    { text: "Manage Supplies", link: "/supplies" },
    { text: "Manage Volunteer", link: "/volunteers" },
    { text: "Manage Organization", link: "/organizations" },
    { text: "Manage Requests", link: "/manage-requests" },
    { text: "Manage Supply Items", link: "/supply-items" },
    { text: "My Inventory Dashboard", link: "#" },
    { text: "All Organizations Dashboard", link: "#" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    { text: "Show Tutorial", link: "#" },
    { text: "Donate", link: "#" },
    { text: "Terms of Use", link: "#" },
    { text: "Privacy Policy", link: "#" },
    { text: "About Outreach App", link: "#" },
    { text: "Logout", },
  ],
  OrgLead: [
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/events/add" },
    { text: "Add Supply Items", link: "/supply-items/add" },
    { text: "Add Volunteer", link: "/volunteers/add/" },
    { text: "Manage Camps", link: "manage-camps" },
    { text: "Manage Events", link: "/events" },
    { text: "Manage Supply Items", link: "/supply-items" },
    { text: "Manage Volunteer", link: "/volunteers" },
    { text: "Manage Requests", link: "/manage-requests" },
    { text: "My Inventory Dashboard", link: "#" },
    { text: "My Events", link: "/my-events" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    { text: "Show Tutorial", link: "#" },
    { text: "Donate", link: "#" },
    { text: "Terms of Use", link: "#" },
    { text: "Privacy Policy", link: "#" },
    { text: "About Outreach App", link: "#" },
    { text: "Logout", },
  ],
  Volunteer: [
    { text: "Add Camp", link: "/add-camp" },
    { text: "Add Event", link: "/events" },
    { text: "Add Claims", link: "/add-claims" },
    { text: "My Work", link: "/my-work" },
    { text: "My Events", link: "/my-events" },
    { text: "Update Profile", link: "/update-profile" },
    { text: "Update Password", link: "/update-password" },
    { text: "Show Tutorial", link: "#" },
    { text: "Donate", link: "#" },
    { text: "Terms of Use", link: "#" },
    { text: "Privacy Policy", link: "#" },
    { text: "About Outreach App", link: "#" },
    { text: "Logout", },
  ]
};
