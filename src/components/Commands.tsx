import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import { bakedCommands } from './CommandUtils'
import { CommandDetail } from './CommandDetail'
//@ts-ignore
const CommandViewer = ({commands, setCommands}) => {
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
  const idxObjs = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name + index.toString()
    const rowEl: Record<string, any> = {}
    rowEl[key] = index
    return rowEl
  })
  const keyToIdx = _.merge({}, ...idxObjs)


  //@ts-ignore
  const [activeCommand, setActiveCommand] = useState(null)
  
  const [activeKey, setActiveKey] = useState(null)
  /*
  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  function handleSetCommand(key, newCommand) {
    const index = keyToIdx[key]
    const nextCommands = commands.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return newCommand
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCommands(nextCommands);
  }
  */

  function getSetCommand(key:any) {
    return (newCommand:any) => {
    const index = keyToIdx[key]
    //@ts-ignore
    const nextCommands = commands.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return newCommand
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCommands(nextCommands);
    }
  }

    /*{ activeCommand && <CommandDetail command={activeCommand}/> }*/
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
	  //setActiveCommand(commandDict[column.key])
	  setActiveKey(column.key)
        }}
    />


    { activeKey && <CommandDetail command={commandDict[activeKey]}
                                  setCommand={getSetCommand(activeKey)}/> }
	  </div>)
}


export const Commands = ()=> {
  const [c, setC] = useState(bakedCommands)
  return (<div style={{width:"100%", height:"100%"}}>
    <CommandViewer commands={c} setCommands={setC}/>
    <code style={{fontSize:"1em", textAlign:"left"}}> {JSON.stringify(c, null, "\t\n\r")} </code>
    </div>)
}
