import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import { sym, bakedCommands } from './CommandUtils'

const nullSetter = ()=> 5

const replaceInArr = (arr:any[], old:any, subst:any) => {
  return arr.map((item:any) => item === old ? subst : item)
}

const replaceAtIdx = (arr:any[], idx:number, subst:any) => {
  return arr.map((item:any, innerIdx:number) => innerIdx === idx? subst : item)
}


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
    const fullPattern = pattern as ActualArg[]
    return (<div>
      <ArgGetters command={command} fullPattern={fullPattern} setCommand={setCommand}/>
      <button onClick={deleteCB}>X</button>
      </div>)
  }
  return <h2></h2>
}

//@ts-ignore
export const ArgGetters = (
  {command, fullPattern, setCommand}:
  {command:any, fullPattern:ActualArg[], setCommand:any}) => {

    const makeArgGetter = (pattern:ActualArg) => {
      const idx = pattern[0]
    
      const val = command[idx]
      const valSetter = (newVal:any) => {
	const newCommand = replaceAtIdx(command, idx, newVal)
	console.log("newCommand", newCommand)
	setCommand(newCommand)
      }
      return (<ArgGetter argProps={pattern} val={val} setter={valSetter} />)
    }

    return (<div className={"argGetters"}>
      {fullPattern.map(makeArgGetter)}
	    </div>)
}



const UnknownCommand = [sym("nonexistent"), sym('df'), 'col1']

const ArgNames =   ['Idx', 'label', 'specName',   'extraSpecArgs']
type TypeSpec =    [number, string, 'type',       'integer' | 'float' | 'string']
type EnumSpec =    [number, string, 'enum',       string[]]
type ColEnumSpec = [number, string, 'colEnum',    string[]]
type NoArgs = null
type ActualArg = TypeSpec | EnumSpec | ColEnumSpec
type ArgSpec = TypeSpec | EnumSpec | ColEnumSpec | NoArgs



const CommandPatterns:Record<string, ArgSpec[]> = {
  "dropcol":[null],
  "fillna":[[3, 'fillVal', 'type', 'integer']],
  "resample":[[3, 'frequency', 'enum', ['daily', 'weekly', 'monthly']],
	      [4, 'colMap', 'enum', ['daily', 'weekly', 'monthly']]]
}

const CommandDefaults:Record<string, any> = {
  "dropcol":  [sym("dropcol"), sym("df"), "col"],
  "fillna":   [sym("fillna"), sym("df"), "col", 8],
  "resample": [sym("resample"), sym('df'), 'col', 'monthly']
}


//@ts-ignore
export const CommandAdder = ({column, addCommandCb}) => {
  //@ts-ignore
  const [commandName, setCommand] = useState(_.keys(CommandDefaults)[0])
  const setCommandShim = (event:any) => setCommand(event.target.value)
  const addCommand = () => {
    const defaultCommand = CommandDefaults[commandName]
    addCommandCb(replaceInArr(defaultCommand, "col", column))
  }
  return (<div>
    <button onClick={addCommand}>Add</button>
    <fieldset>
    <span> Column: {column}</span>
      <label> Command Name </label>
      <select defaultValue={commandName} onChange={setCommandShim}>
      //@ts-ignore
    {_.keys(CommandDefaults).map((optionVal:any) => <option key={optionVal} value={optionVal}>{optionVal}</option>)}
	</select>
    </fieldset>
    </div>)
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
