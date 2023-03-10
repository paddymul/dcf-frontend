import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import { sym, bakedCommands } from './CommandUtils'

const nullSetter = ()=> 5

//@ts-ignore
export const CommandDetail = ({command, setCommand, deleteCB}) => {
  const commandName = command[0]['symbol']
  const pattern = CommandPatterns[commandName]
  
  if (! _.isArray(pattern)){
    //we shouldn't get here
    return <h2>unknown command {commandName}</h2>
  } else if (_.isEqual(pattern, [null])) {
    return <div><h2>no arguments</h2><button onClick={deleteCB}>X</button></div>
  } else {
    const val = command[3]
    const valSetter = (newVal:any) => {
      const newCommand = [command[0], command[1], command[2], newVal];
      console.log("newCommand", newCommand)
      setCommand(newCommand)
    }
    return (<div>
      <ArgGetter argProps={pattern[0]} val={val} setter={valSetter} />
      <button onClick={deleteCB}>X</button>
      </div>)
  }
  return <h2></h2>
}


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

  const defaultShim = (event:any) => setter(event.target.value)
  //type should actually be lined up with the column somehow, punting for now

  if (argType === 'enum') {
    return (<fieldset>
      <label> {label} </label>
      <select defaultValue={val} onChange={defaultShim}>
      //@ts-ignore
      {lastArg.map((optionVal:any) => <option key={optionVal} value={optionVal}>{optionVal}</option>)}
	</select>
      </fieldset>)
  }
  else if(argType === 'type') {
    if(lastArg === 'integer'){
      const valSetterShim = (event:any) => setter(parseInt(event.target.value))
      return (<fieldset>
	<label> {label} </label>
	<input type="number" defaultValue={val} step="1" onChange={valSetterShim} />
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
export const CommandDetailHarness = () => {
      const activeCommand = bakedCommands[0]
  return (<div>
    <CommandDetail command={activeCommand} setCommand={nullSetter} deleteCB={nullSetter}/> 
    <ArgGetter argProps={CommandPatterns['fillna'][0]} val={3} setter={nullSetter} />
    <ArgGetter argProps={CommandPatterns['resample'][0]} val={'daily'} setter={nullSetter} />
    </div>)
}
