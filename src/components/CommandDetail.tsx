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

const replaceAtKey = (obj:Record<string, any>, key:string, subst:any) => {
  const objCopy = _.clone(obj)
  objCopy[key] = subst
  return objCopy
}


const objWithoutNull = (obj:Record<string, any>, extraStrips:any[]=[]) =>
  _.pickBy(obj, (x) => ![null, undefined].includes(x))


//@ts-ignore
export const CommandDetail = ({command, setCommand, deleteCB, columns}) => {
  const commandName = command[0]['symbol']
  const pattern = CommandPatterns[commandName]
  
  if (! _.isArray(pattern)){
    //we shouldn't get here
    return <h2>unknown command {commandName}</h2>
  } else if (_.isEqual(pattern, [null])) {
    return <div className="command-detail"><h4>no arguments</h4><button onClick={deleteCB}>X</button></div>
  } else {
    const fullPattern = pattern as ActualArg[]
    return (<div className="command-detail">
      <ArgGetters command={command} fullPattern={fullPattern} setCommand={setCommand} columns={columns}/>
      <button onClick={deleteCB}>X</button>
      </div>)
  }
  return <h2></h2>
}

//@ts-ignore
export const ArgGetters = (
  {command, fullPattern, setCommand, columns}:
  {command:any, fullPattern:ActualArg[], setCommand:any
   columns:string[]}) => {
    const makeArgGetter = (pattern:ActualArg) => {
      const idx = pattern[0]
      const val = command[idx]
      const valSetter = (newVal:any) => {
	const newCommand = replaceAtIdx(command, idx, newVal)
	console.log("newCommand", newCommand)
	setCommand(newCommand)
      }
      return (<ArgGetter argProps={pattern} val={val} setter={valSetter}
	      columns={columns} />)
    }
    return (<div className="arg-getters">
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
	      [4, 'colMap', 'colEnum', ['null', 'sum', 'mean', 'count']]]
}

const CommandDefaults:Record<string, any> = {
  "dropcol":  [sym("dropcol"), sym("df"), "col"],
  "fillna":   [sym("fillna"), sym("df"), "col", 8],
  "resample": [sym("resample"), sym('df'), 'col', 'monthly', {}]
}

//@ts-ignore
const ArgGetter = (
  {argProps, val, setter, columns}:
  {argProps:ActualArg, val:any, setter:any, columns:string[]}
) => {
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
  }
  else if (argType === 'colEnum') {
    const widgetRow = columns.map((colName:string) => {

    //const widgetRow = columns.map((colName:any) => {
      const colSetter = (event:any) => {
	const newColVal = event.target.value
	const updatedColDict = replaceAtKey(val, colName, newColVal)
	setter(objWithoutNull(updatedColDict, ['null']))
      }
      const colVal = _.get(val, colName, 'null')
      return (<td><select defaultValue={colVal} onChange={colSetter}>
	//@ts-ignore
	{lastArg.map((optionVal:any) => <option key={optionVal} value={optionVal}>{optionVal}</option>)}
	      </select>
	</td>
	)
    })
				  
    
    return (<table>
      <thead><tr>
      {columns.map((colName) => (<th>{colName}</th>))}
	    </tr>
      </thead>
      <tbody>
      <tr>
          {widgetRow} 
	    </tr>
      </tbody>
      </table>)
  }
  else {
    return <h3> unknown argtype </h3>
  }
}


//@ts-ignore
export const CommandAdder = ({column, addCommandCb}) => {
  //@ts-ignore
  const [commandName, setCommand] = useState(_.keys(CommandDefaults)[0])
  const setCommandShim = (event:any) => setCommand(event.target.value)
/*
      <select defaultValue={commandName} onChange={setCommandShim}>
      //@ts-ignore
    {_.keys(CommandDefaults).map((optionVal:any) => <option key={optionVal} value={optionVal}>{optionVal}</option>)}
	</select>
	*/


  const addCommand = () => {
    const defaultCommand = CommandDefaults[commandName]
    addCommandCb(replaceInArr(defaultCommand, "col", column))
  }

  const addCommandByName = (localCommandName:string) => {
    return () => {
      const defaultCommand = CommandDefaults[localCommandName]
      addCommandCb(replaceInArr(defaultCommand, "col", column))
    }
  }

  const setCommandViaButton = (commandName:string) => {
    const retFunc = () => {
      setCommand(commandName)
    }
    return retFunc
  }
  return (<div className="command-adder">
    <button onClick={addCommand}>Add</button>
    <fieldset>
    <button> Column: {column}</button>
      <label> Command Name </label>
	  {_.keys(CommandDefaults).map(
	    (optionVal:any) => <button onClick={addCommandByName(optionVal)}> {optionVal} </button> )}
    </fieldset>
    </div>)
}



/*
    <ArgGetter argProps={CommandPatterns['fillna'][0]} val={3} setter={nullSetter} columns={[]} />
    <ArgGetter argProps={CommandPatterns['resample'][0]} val={'daily'} setter={nullSetter} columns={[]} />

  */
//@ts-ignore
export const CommandDetailHarness = () => {
      const activeCommand = bakedCommands[0]
  return (<div>
    <CommandDetail command={activeCommand} setCommand={nullSetter} deleteCB={nullSetter}
	  columns={['foo', 'bar', 'baz']}/> 
    </div>)
}
