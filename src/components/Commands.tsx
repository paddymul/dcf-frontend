import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import _ from 'lodash';
import DataGrid from 'react-data-grid';

const sym = (symbolName:string) => {
  return {'symbol':symbolName}
}

//@ts-ignore
const CommandDetail = ({command}) => {
  const commandName = command[0]['symbol']
  const pattern = CommandPatterns[commandName]
  if (! _.isArray(pattern)){
    //we shouldn't get here
    return <h2>unknown command {commandName}</h2>
  } else if (_.isEqual(pattern, [null])) {
    return <h2>no arguments</h2>
  } else {
    //insert ArgGetter for each remaining argument
  }
  return <h2></h2>
}


const bakedCommands = [
  [sym("dropcol"), sym('df'), 'col1'],
  [sym("fillna"), sym('df'), 'col2', 5]
]
const UnknownCommand = [sym("nonexistent"), sym('df'), 'col1']

const ArgNames =   ['Idx', 'label', 'specName',   'extraSpecArgs']
type TypeSpec =    [number, string, 'type',       'integer' | 'float' | 'string']
type EnumSpec =    [number, string, 'enum',       string[]]
type ColEnumSpec = [number, string, 'colEnum',    string[]]
type NoArgs = null
type ArgSpec = TypeSpec | EnumSpec | ColEnumSpec | NoArgs

const CommandPatterns:Record<string, ArgSpec[]> = {
  "dropcol":[null],
  "fillna":[[3, 'fillVal', 'type', 'integer']],
  "resample":[[3, 'frequency', 'enum', ['daily', 'weekly', 'monthly']]],
}

//@ts-ignore
const ArgGetter = ({argProps, val, setter}) => {
  //@ts-ignore
  const [argPos, label, argType, lastArg] = argProps
  console.log("argProps", argProps)
  //type should actually be lined up with the column somehow, punting for now
  if (argType === 'enum') {
    return (<fieldset>
      <label> {label} </label>
      <select>
      //@ts-ignore
      {lastArg.map((optionVal:any) => <option value={optionVal}>{optionVal}</option>)}
	</select>
      </fieldset>)
  }
  else if(argType === 'type') {
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
  } else {
    return <h3> unknown argtype </h3>
  }

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
    <ArgGetter argProps={CommandPatterns['fillna'][0]} val={3} setter={()=> 5} />
    <ArgGetter argProps={CommandPatterns['resample'][0]} val={'daily'} setter={()=> 5} />
    </div>)
}
