import React, { Component } from "react";
import { App } from "./App";
import { Hello } from "./components/Hello";
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

export interface MainProps
{
    app: App;
}

interface MainState 
{
}


const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' }
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' }
];


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