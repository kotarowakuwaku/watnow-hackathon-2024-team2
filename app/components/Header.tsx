import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import { radioClasses } from "@mui/material";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#888999",
          color: "black",
          boxShadow: "-moz-initial",
          height: "140px",//wwwwwww
          borderRadius: "5px",
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
              fontSize: "34px",
              flexGrow: 4,
              display: "flex",
              //justifyContent: "center",
              alignItems: "flex-end",
              fontWeight: "bold",
              marginLeft: "30px",
              marginBottom: "10px",
              color: "#FFFF",
            }}
          >
            推しリスト
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
