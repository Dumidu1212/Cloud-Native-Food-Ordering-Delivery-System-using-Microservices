// src/ui/adminGlobalStyle.ts
import { createGlobalStyle } from 'styled-components';   // ← ADD THIS LINE

export const GlobalStyle = createGlobalStyle`
  :root{ --sidebar-w:70px }

  *{
    box-sizing:border-box;
    margin:0;
    padding:0;
    font-family:Inter,system-ui,sans-serif;
  }

  body{
    background:${({theme})=>theme.colours.gray100};
    color:${({theme})=>theme.colours.gray900};
  }

  a{ text-decoration:none; color:inherit; }
  button{ cursor:pointer; }
`;
