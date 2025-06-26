import * as React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
// import "react-loading-skeleton/dist/skeleton.css";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(<App />);
