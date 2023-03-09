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
  console.log("argProps", argProps)
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


export const Commands = ()=> {
  return (<div style={{width:"100%", height:"100%"}}>
    <CommandViewer commands={bakedCommands}/>
    <ArgGetter argProps={CommandPatterns['fillna'][0]} val={3} setter={()=> 5} />
    <ArgGetter argProps={CommandPatterns['resample'][0]} val={'daily'} setter={()=> 5} />
    </div>)
}
