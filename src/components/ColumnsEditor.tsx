import React, { Component, useState, useEffect } from "react";
import { tableDf } from "./staticData";
import { propsToCommands, requestDf } from "./utils";
import { DFViewer } from "./DFViewer"
import _ from 'lodash';
import { CommandViewer } from './Commands'
import { bakedCommands } from './CommandUtils'

//import ContextMenuDemo from "./TableColumnMenu"
import DoubleTableMenu from "./DoubleTableMenu"

interface ColumnState {
    drop:boolean
    fillna:boolean
}




export function ColumnEditor(props:any) {
 const colState:any = props.colState
 const colStateChanged:any = props.colStateChanged

   const handleDropChanged = () => {
     colStateChanged({...colState, drop:!colState.drop}) }  
   const fillNaChanged = (e:any) => {
     colStateChanged({...colState, fillNa:!colState.fillNa}) }  
   const fillNaValChanged = (e:any) => {
     colStateChanged({...colState, fillNaVal:e.target.value}) }  

   return (
     	   <div className="column-editor">
	       <label>
		    <span> FillNa</span>
		    <input
		       type="checkbox"
                       checked={colState.fillNa}
		       onChange={fillNaChanged}/>
                   <input
                       value={colState.fillNaVal}
		       onChange={fillNaValChanged}/>
	       </label>
	       <label>
                  <span> Drop</span>
                   <input
		       type="checkbox"
                       checked={colState.drop}
		       onChange={handleDropChanged}/>
	       </label>
     </div>
  )
}


//@ts-ignore
function ColumnList({ fullProps, deepSet }) {
  const [columnProps, setColumnProps] = useState({drop:false, fillNa:false, fillNaVal:"zsdf" })	

  const listItems = _.keys(fullProps).map((name:any) =>
    <div className="list-item" key={name} >
        <dt>{name}</dt>
        <dd>{fullProps[name].type}</dd>
        <ColumnEditor key={name} colState={fullProps[name]} colStateChanged={deepSet([name])}/>
    </div>);

  return (<div className="column-list" >
              <dl>{listItems}</dl>
	  </div>)
}





//@ts-ignore
export function CommandDisplayer({filledCommands, style}) {
  const baseStyle = {margin:"0",  textAlign:"left"}
  const localStyle = {...baseStyle, ...style } 
    return (
     	   <div className="command-displayer"  style={{width:'100%'}}>
	       <pre style={localStyle}>{JSON.stringify(filledCommands)}</pre>
           </div>)
}

//@ts-ignore
export function PythonDisplayer({filledCommands, style}) {
  const [pyString, setPyString] = useState("")

  const URLBase = "http://localhost:5000/dcf/"
  const sliceArgs = "slice_start=3&slice_end=50"
  const emptyUrl = `${URLBase}df/1?${sliceArgs}`

  useEffect(() => {
     

  const pyCodeUrl = `${URLBase}dcf_to_py/1?instructions=${JSON.stringify(filledCommands)}`
  if(filledCommands.length == 0) {
     return
  }
  else {
    fetch(pyCodeUrl)
      .then(async (response) => {
	console.log(response)
	//@ts-ignore	
	const fullResp = await response.json()
	console.log("fullResp", fullResp)
	//@ts-ignore	
	const pyCode = fullResp['py']
	console.log("pyCode", pyCode)
	setPyString(pyCode)
      });
  }
  }, [filledCommands]);
  const baseStyle = {margin:"0",  textAlign:"left"}
  const localStyle = {...baseStyle, ...style } 
    return (
     	   <div className="python-displayer" style={{width:'100%',   }}>
	       <pre style={localStyle}>{pyString}</pre>
           </div>)
}

//@ts-ignore
const transformInstructions = (raw) => {
      return JSON.stringify([{'symbol':'begin'}, ...raw])
}


//@ts-ignore
export function TransformViewer({ filledCommands, style }) {
  const [transDf, setTransDf] = useState(tableDf)

  const URLBase = "http://localhost:5000/dcf/"
  const sliceArgs = "slice_start=3&slice_end=50"
  const emptyUrl = `${URLBase}df/1?${sliceArgs}`

  useEffect(() => {
     
  const instructions = transformInstructions(filledCommands)
  console.log("filledCommands", filledCommands)
  console.log("instructions", instructions)

  const transUrl = `${URLBase}transform_df/1?instructions=${instructions}&${sliceArgs}`
  if(filledCommands.length == 0) {
    requestDf(emptyUrl, setTransDf);
  }
  else {
   requestDf(transUrl, setTransDf);
  }
  }, [filledCommands]);
  return (<div className="transform-viewer"> <DFViewer style={style}  df={transDf} /> </div>);
}



//@ts-ignore
export function DependentTabs({ filledCommands }) {
  const [tab, _setTab] = useState('python')
  const setTab = (tabName:string) => {
      const retFunc = (e:any) => {
        _setTab(tabName);
      }
      return retFunc
  }
  const baseStyle = {background:'grey'}
  const [dfStyle, pythonStyle, commandStyle] = [_.clone(baseStyle), _.clone(baseStyle), _.clone(baseStyle)]

  const activeBackground = "#261d1d"
  if (tab === 'df') {
    dfStyle['background'] = activeBackground
  }
  if (tab === 'python') {
    pythonStyle['background'] = activeBackground
  }
  if (tab === 'command') {
    commandStyle['background'] = activeBackground
  }
  const style={height:"45vh"}

  return (<div className="dependent-tabs" style={{width:'100%'}}>
           <ul className="tabs">
	       <li onClick={setTab('df')}  style={dfStyle}>DataFrame</li>
	       <li onClick={setTab('python')} style={pythonStyle}>Python</li>
	       <li onClick={setTab('command')} style={commandStyle}>Command</li>
	    </ul>
	    <div className="output-area">
                {{'command': <CommandDisplayer style={style}  filledCommands={ filledCommands }/>,
                  'python': <PythonDisplayer style={style}  filledCommands={ filledCommands }/>,
	          'df': <TransformViewer style={style} filledCommands={ filledCommands }/>}[tab]}
            </div>		      
	</div>)
}



//@ts-ignore
export function ColumnsEditor({ df }) {

  const schema = df.schema;
  const baseState = {drop:false, fillNa:false, fillNaVal:"zsdf", type:'foo' }
  const totalProps:Record<string, any> = {}
  schema.fields.map((f:any) => {
        const props = _.clone(baseState)
	props.type = f.type
  	totalProps[f.name] = props
  })
  console.log("totalProps", totalProps)

  const [fullProps, setFullProps] = useState(totalProps)
  const deepSetColumnProps = (field:string) => {
      const retFunc = (newSingleColumnProps:any) => {
            const baseProps = _.cloneDeep(fullProps)
	    baseProps[field] = newSingleColumnProps
	    setFullProps(baseProps)
      }
      return retFunc
  }

  const [commands, setCommands] = useState(bakedCommands)
  const allColumns = df.schema.fields.map((field:any) => field.name)
    //<ColumnList  fullProps={fullProps} deepSet={deepSetColumnProps} /> 
  return (<div className="columns-editor" style={{width:'100%',    }}>
    <CommandViewer commands={commands} setCommands={setCommands} 
	  activeColumn={'new-column2'}
	  allColumns={allColumns} />

	      <DependentTabs filledCommands={commands}/>
	</div>)
}



