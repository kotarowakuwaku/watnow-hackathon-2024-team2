import * as React from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
//import { Margin } from "@mui/icons-material";

export default function Header() {
  const [view, setView] = React.useState("list"); // 初期状態を 'list' に設定

  const handleViewChange = (
      event: React.MouseEvent<HTMLElement>,
      newView: React.SetStateAction<string> | null
  ) => {
      if (newView !== null) {
          setView(newView); // 選択状態が変更された場合に状態を更新
      }
  };


  return (
    <div
      style={{
        height: "60px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f6f6f6",
      }}
    >
      {" "}
      {/* 全体の高さを80pxに設定 */}
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        {" "}
        {/* ボックスも高さ100%で合わせる */}
        <Box
          sx={{ display: "flex", justifyContent: "center", }} /* 縦中央揃え */
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
          >
            <ToggleButton
              value="home"
              aria-label="home view"
              sx={{
                width: "200px",
                height: "40px",
                borderRadius: "20px",
                backgroundColor: "#FCFCFA",
                // "&.Mui-selected": {
                //   backgroundColor: "lightblue", // 選択時の背景色
                //   color: "white", // 選択時のテキスト色
                // },
                // "&.Mui-selected:hover": {
                //   backgroundColor: "#D3DCF9", // 選択時のホバー時の背景色
                // },
                // "&:active": {
                //   backgroundColor: "#FDEFFE", // 押されたときの背景色
                //   color: "#F0F8FE", // 押されたときのテキスト色
                // },
              }}
            >
              ホーム
            </ToggleButton>
            <ToggleButton
              value="list"
              aria-label="list view"
              sx={{
                width: "200px",
                height: "40px",
                borderRadius: "20px",
                backgroundColor: "#FCFCFA",
              }}
            >
              リスト
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    </div>
  );
}
