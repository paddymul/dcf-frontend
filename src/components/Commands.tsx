import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import { bakedCommands } from './CommandUtils'
import { CommandDetail } from './CommandDetail'
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

  //@ts-ignore
  const commandObjs = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name + index.toString()
    const rowEl: Record<string, any> = {}
    rowEl[key] = element
    return rowEl
  })

  const commandDict = _.merge({}, ...commandObjs)
  //@ts-ignore
  const [activeCommand, setActiveCommand] = useState(null)



  return (<div>
    <DataGrid style={{height:"150px"}}
        //@ts-ignore
        columns={columns}
        rows={rows}
        onCellClick={({ row, column }:any, event:any) => {
	  console.log("column", column.key);
          // add to generated commands
	  const tempRow = _.clone(rows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
          //@ts-ignore
	  setActiveCommand(commandDict[column.key])
      //setColumnSelect([tempRow])
      
        }}
    />

    { activeCommand && <CommandDetail command={activeCommand}/> }
	  </div>)
}


export const Commands = ()=> {
  return (<div style={{width:"100%", height:"100%"}}>
    <CommandViewer commands={bakedCommands}/>
    </div>)
}
