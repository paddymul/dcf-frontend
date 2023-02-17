import React, { Component, useState } from "react";
import { App } from "./App";
import { DCFCell } from "./components/DCFCell";
import 'react-data-grid/lib/styles.css';


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
	<div style={{width:"100%", height:"500px"}}>
	  <DCFCell />
	</div>
        );
    }
}
