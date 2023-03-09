import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import { createPortal } from 'react-dom';
import { tableDf } from "./staticData";
import { propsToCommands, requestDf } from "./utils";
import DataGrid from 'react-data-grid';
import { columns, rows } from "./staticData";
import _ from 'lodash';

export type Direction = 'ltr' | 'rtl';
export interface Props {
  direction: Direction;
}

function rowKeyGetter(row: any) {
  return row.index;
}

const sym = (symbolName:string) => {
  return {'symbol':symbolName}
}

const bakedCommands = [
  [sym("dropcol"), sym('df'), 'col1'],
  [sym("fillna"), sym('df'), 'col2', 5]
]
const UnknownCommand = [sym("nonexistent"), sym('df'), 'col1']


const CommandPatterns:Record<string, any[]> = {
  "dropcol":[],
  "fillna":[[3, 'fillVal', 'type', 'integer']],
  "resample":[[3, 'frequency', 'enum', ['daily', 'weekly', 'monthly']]],
}

//@ts-ignore
const ArgGetter = ({argProps, val, setter}) => {

  //@ts-ignore
  const [argPos, label, argType, lastArg] = argProps

  //type should actually be lined up with the column somehow, punting for now
  if(argType === 'type') {
    if(lastArg === 'integer'){
      return (<fieldset>
	<label> {label} </label>
	  <input type="number" value={val} step="1" />
	</fieldset>)
    } else {
      return (<fieldset>
	<label> {label} </label>
	  <input  value="dont know"/>
	</fieldset>)
    }
  } else if (argType === 'enum') {
    return (<fieldset>
      <label> {label} </label>
      <select>
      //@ts-ignore
      {lastArg.map((optionVal:any) => <option value={optionVal}>{optionVal}</option>)}
	</select>
      </fieldset>)
  } else {
    return <h3> unknown argtype </h3>
  }

}

//@ts-ignore
const CommandDetail = ({command}) => {
  const commandName = command[0]['symbol']
  const pattern = CommandPatterns[commandName]
  if (! _.isArray(pattern)){
    //we shouldn't get here
    return <h2>unknown command {commandName}</h2>
  } else if (pattern.length===0) {
    return <h2>no arguments</h2>
  } else {
    
  }
  return <h2></h2>
}



//@ts-ignore
const CommandViewer = ({commands}) => {
  //@ts-ignore
  const columns = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name+index.toString()
    const column = {key, name}
    return column
  })

  //@ts-ignore
  const rowElements = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name+index.toString()
    const rowEl: Record<string, any> = {}
    rowEl[key] = element[2]
    return rowEl
  })

  const rows = [_.merge({}, ...rowElements)]
  return <DataGrid style={{height:"150px"}}
        //@ts-ignore
        columns={columns}
        rows={rows}
      />
}

export default function DoubleTableMenu2() {

  const row1:Record<string,any> = {}
  columns.map((col:any) => {row1[col.key] = "false"})
  const [columnSelectRows, setColumnSelect] = useState([row1])

  const commandsColumns = [{key:"fillna", name:"fillna-name"}, {key:"drop", name:"drop-name"}]
  const commandRows = [{fillna:"false", drop:"false"}]
  
  const [generatedCommands, setGeneratedCommands] = useState([])
  
  return (
    <div className="TableColumnsMenu" style={{padding:"0 10px 0 0", width:"100%"}}>
      <CommandViewer commands={bakedCommands}/>
      <DataGrid style={{height:"150px"}}
        columns={columns}
         rows={columnSelectRows}
        //@ts-ignore
        onCellClick={({ row, column }:any, event:any) => {
	  console.log("column", column.name);
	  const tempRow = _.clone(columnSelectRows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
	  setColumnSelect([tempRow])
        }}
      />
    <DataGrid style={{height:"150px"}}
        columns={commandsColumns}
        rows={commandRows}
    onCellClick={({ row, column }:any, event:any) => {
	  console.log("column", column.name);
          // add to generated commands
	  const tempRow = _.clone(columnSelectRows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
	  setColumnSelect([tempRow])
        }}
    />

    </div>
  );
}

