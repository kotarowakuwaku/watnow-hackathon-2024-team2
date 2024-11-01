import * as React from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const baseWidth = 255;
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
          fontFamily: "JPfont",
          marginTop: '15px',
          '&:hover': {
            backgroundColor: '#F5F5F5',
            color: '#000'
          },
        },
      }
    }
  }
});

type ButtonProps = {
  type: 'submit' | 'button';
  text: string;
  onClick?: () => void;
};

export default function Btn({
  type,
  text,
  onClick,
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
        {text}
      </Button>
    </ThemeProvider>
  );
}
