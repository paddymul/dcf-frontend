import React, { Component, useState } from "react";
import { App } from "./App";
import { Hello } from "./components/Hello";
//import { ColumnEditor } from "./components/ColumnEditor";
import { ColumnsEditor } from "./components/ColumnsEditor";
import { DCFCell } from "./components/DCFCell";
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

        return (
	    <DCFCell />
        );
    }
}