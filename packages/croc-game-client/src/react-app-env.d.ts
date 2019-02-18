/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv extends ProcessEnv {
    REACT_APP_WS_CONNECTION_URL: string;
  }
}