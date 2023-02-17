import React, { Component, useState } from "react";
import { App } from "./App";
import { Hello } from "./components/Hello";
//import { ColumnEditor } from "./components/ColumnEditor";
import { ColumnsEditor } from "./components/ColumnsEditor";
import { DCFCell } from "./components/DCFCell";
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import ContextMenuDemo from "./components/TableColumnMenu"


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

	    //<DCFCell />
      return (
	<div style={{width:"100%", height:"500px"}}>
	  <ContextMenuDemo />
	</div>
        );
    }
}
