import React from "react";
import { Main } from "./Main";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

/*
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <BrowserRouter>
       <App />
    </BrowserRouter>
 </React.StrictMode>
);
*/
export class App
{
    constructor()
    {
        this.render();
    }

    private render(): void
    {
        const root = createRoot(document.getElementById("app") as HTMLElement)
        root.render(React.createElement(Main, { app: this }, null));
    }
}

new App();
