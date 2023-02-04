import React, { Component, useState } from "react";
import { App } from "./App";
import { Hello } from "./components/Hello";
//import { ColumnEditor } from "./components/ColumnEditor";
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

export function ColumnEditor(
  colState:any, 
  colStateChanged:any) {
   const handleDropChanged = () => {
     colStateChanged({...colState, drop:!colState.drop})
   }  
   const handleFillnaChanged = () => {
     colStateChanged({...colState, fillna:!colState.fillna})
   }  

 
    return (
     	   <div style={{width:'100%',  height:'30px', border:'1px solid green'}}>
	       <label>
                   <input
		       type="checkbox"
                       checked={colState.drop}
		       onChange={handleDropChanged}
                    />
		    Drop
		  </label>
	       <label>
                   <input
		       type="checkbox"
                       checked={colState.fillna}
		       onChange={handleFillnaChanged}	
                    />
		    FillNa
		  </label>

     </div>
  )
}


//@ts-ignore
function ColumnList({ schema }) {
  console.log("schema", schema)
  const [columnProps, setColumnProps] = useState({drop:false, fillna:false })	
  const listItems = schema.fields.map((f:any) =>
    <div style={{border:"1px solid black", padding:"3px"}}>
        <dt key={f.name}>{f.name}</dt>
        <dd key={f.name}>{f.type}</dd>
    </div>);

  return (<div style={{width:'100%', outline:'3px solid blue',   }}>

<ColumnEditor colState={columnProps} colStateChanged={setColumnProps}/>
<dl style={{display:"flex"}}>{listItems}</dl>


	</div>)
}


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
	        <ColumnList schema={tableDf.schema} />
	        <DataGrid columns={columns} rows={rows} />
	    </div>
        );
    }
}