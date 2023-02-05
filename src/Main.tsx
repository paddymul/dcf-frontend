import React, { Component, useState } from "react";
import { App } from "./App";
import { Hello } from "./components/Hello";
//import { ColumnEditor } from "./components/ColumnEditor";
import { ColumnsEditor } from "./components/ColumnsEditor";
import { tableDf, columns, rows } from "./components/staticData";
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


/*

*/


export class Main extends Component<MainProps, MainState>
{
    constructor(props: MainProps)
    {
        super(props);
    }

    public render(): JSX.Element
    {
	const columnProps = {drop:false, fillna:false };
        return (
	    <div style={{width:'100%'}}>
	        <ColumnsEditor schema={tableDf.schema} />
	        <DataGrid columns={columns} rows={rows} />
	    </div>
        );
    }
}