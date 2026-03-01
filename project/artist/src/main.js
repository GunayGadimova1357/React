import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from 'react-hot-toast';
import './locales';
ReactDOM.createRoot(document.getElementById("root")).render(_jsxs(React.StrictMode, {
    children: [_jsx(App, {}), _jsx(Toaster, {
        position: "top-center", toastOptions: {
            style: {
                background: '#18181b',
                color: '#fafafa',
                border: '1px solid #27272a',
            },
        }
    })]
}));
