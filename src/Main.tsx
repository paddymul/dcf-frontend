import React, { Component, useState } from "react";
import { App } from "./App";
import { DCFCell } from "./components/DCFCell";
import DoubleTableMenu  from "./components/DoubleTableMenu"
import 'react-data-grid/lib/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export interface MainProps
{
    app: App;
}

interface MainState 
{
}




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



export class Main extends Component<MainProps, MainState>
{
    constructor(props: MainProps)
    {
        super(props);

    }

    public render(): JSX.Element
    {
      return (
    <BrowserRouter>
	  <Routes>
	    <Route path="/" element={<DCFCell />} />
	    <Route path="/double" element={ <DoubleTableMenu /> } />
	  </Routes>
    </BrowserRouter>


        );
    }
}
