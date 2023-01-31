import React, { Component } from "react";
//import { App, columns, rows } from "./App";
import { App } from "./App";
import { Hello } from "./components/Hello";
import { columns, rows } from "./components/staticData";
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';


console.log(columns)

export interface MainProps
{
    app: App;
}

interface MainState 
{
}



export class Main extends Component<MainProps, MainState>
{
    constructor(props: MainProps)
    {
        super(props);
    }

    public render(): JSX.Element
    {
        return (
            <Hello message="React TypeScript Webpack Starter">
	        <DataGrid columns={columns} rows={rows} />;  
                <div className="features">
                    <div>Webpack 5 + HMR</div>
                    <div>TypeScript + React</div>
                    <div>SCSS + Autoprefixing</div>
                </div>
            </Hello>
        );
    }
}