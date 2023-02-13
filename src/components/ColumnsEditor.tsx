import React, { Component, useState, useEffect } from "react";
import { tableDf } from "./staticData";
import { propsToCommands, requestDf } from "./utils";
import { DFViewer } from "./DFViewer"
import _ from 'lodash';


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
     	   <div style={{width:'100%',  height:'30px', border:'1px solid green'}}>
	       <label>
                   <input
		       type="checkbox"
                       checked={colState.drop}
		       onChange={handleDropChanged}/>
		    Drop
	       </label>
	       <label>
                   <input
                       value={colState.fillNaVal}
		       onChange={fillNaValChanged}/>
                   <input
		       type="checkbox"
                       checked={colState.fillNa}
		       onChange={fillNaChanged}/>
		    FillNa
	       </label>
     </div>
  )
}

//@ts-ignore
export function CommandDisplayer({filledCommands}) {
    return (
     	   <div style={{width:'100%',   border:'1px solid orange'}}>
	       <pre style={{border:'1px solid gray', height:'50px'}}>{JSON.stringify(filledCommands)}</pre>
           </div>)
}

//@ts-ignore
export function PythonDisplayer({filledCommands}) {
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
    return (
     	   <div style={{width:'100%',   border:'1px solid orange'}}>
	       <pre style={{border:'1px solid gray', height:'50px', textAlign:"left"}}>{pyString}</pre>
           </div>)
}

//@ts-ignore
function ColumnList({ fullProps, deepSet }) {
  const [columnProps, setColumnProps] = useState({drop:false, fillNa:false, fillNaVal:"zsdf" })	

  console.log("fullProps", fullProps)
  const listItems = _.keys(fullProps).map((name:any) =>
    <div key={name} style={{border:"1px solid black", padding:"3px"}}>
        <dt>{name}</dt>
        <dd>{fullProps[name].type}
              <ColumnEditor key={name} colState={fullProps[name]} colStateChanged={deepSet([name])}/>
	      </dd>
    </div>);

  return (<div style={{width:'100%', outline:'3px solid blue'}}>
              <dl style={{display:"flex"}}>{listItems}</dl>
	  </div>)
}

//@ts-ignore
const transformInstructions = (raw) => {
      return JSON.stringify([{'symbol':'begin'}, ...raw])
}


//@ts-ignore
export function TransformViewer({ filledCommands }) {
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
  return (<DFViewer df={transDf} />);
}



//@ts-ignore
export function DependentTabs({ fullProps }) {
  const filledCommands = propsToCommands(fullProps)
  return (<div style={{width:'100%', outline:'3px solid blue',   }}>

 	      <CommandDisplayer filledCommands={ filledCommands }/>
 	      <PythonDisplayer filledCommands={ filledCommands }/>
	      <TransformViewer filledCommands={ filledCommands }/>
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

 
  return (<div style={{width:'100%', outline:'3px solid blue',   }}>
   	      <ColumnList  fullProps={fullProps} deepSet={deepSetColumnProps} />
	      <DependentTabs fullProps={fullProps}/>
	</div>)
}



