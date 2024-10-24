import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#F5F5F5",
          color: "black",
          boxShadow: "-moz-initial",
          height: "140px",//wwwwwww
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
            alignItems: "flex-end",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "JPFont",
              height: "100%",
              flexGrow: 4,
              display: "flex",
              //justifyContent: "center",
              alignItems: "flex-end",
              fontWeight: "bold",
              marginLeft: "10px",
              marginBottom: "10px",
              color: "#5D4C72",
            }}
          >
            推し一覧
          </Typography>
  
          <Box
            sx={{ paddingLeft: "0px", display: "flex", alignItems: "center" }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle sx={{ fontSize: 40 }} />{" "}
              {/* Increase the icon size */}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
