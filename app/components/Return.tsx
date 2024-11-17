import * as React from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { StaticImageData } from 'next/image';

const baseWidth = 90;
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '40px',
          border: '1px solid #000',
          borderRadius: "50px",
          backgroundColor: '#FFF',
          color: 'black',
          fontFamily: "JPFont",
          marginTop: '10px',
          '&:hover': {
            backgroundColor: '#F5F5F5',
            color: '#000'
          },
          textTransform: 'none',
        },
      }
    }
  }
});

type ButtonProps = {
  type: 'submit' | 'button';
  text: string;
  onClick?: () => void;
  iconSrc?: string|StaticImageData;
};

export default function Btn({
  type,
  text,
  onClick,
  iconSrc,  // Optional prop for an icon source
}: ButtonProps) {
  // Check if the screen width is 600px or more
  const isLargeScreen = useMediaQuery('(min-width:600px)');
  const buttonWidth = isLargeScreen ? baseWidth * 2 : baseWidth;

  return (
    <ThemeProvider theme={theme}>
      <Button 
        variant="outlined" 
        onClick={onClick} 
        type={type} 
        style={{ width: `${buttonWidth}px`, marginTop: "30px" }}
      >
        {/* 画像が渡された場合に表示 */}
        {iconSrc && (
          <img
          src={typeof iconSrc === 'string' ? iconSrc : iconSrc.src} // 型に応じて処理
          alt="icon"
            style={{
              width: '20px',
              height: '20px',
              marginRight: '8px',
            }}
          />
        )}
        {text}
      </Button>
    </ThemeProvider>
  );
}
