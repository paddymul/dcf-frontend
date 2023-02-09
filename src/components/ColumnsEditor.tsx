import React, { Component, useState, useEffect } from "react";
import { propsToCommands } from "./utils";
import _ from 'lodash';


// onChange={handleChange('drop')}
// onChange={handleChange('fillna')}	
// interface ColumnState
// {
// drop:boolean
// rename:false|string
// fillna:false|string

// }



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
     //console.log("fillNA changed", e.target.value, e)
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
function ColumnList({ fullProps, deepSet }) {
  const [columnProps, setColumnProps] = useState({drop:false, fillNa:false, fillNaVal:"zsdf" })	

  console.log("fullProps", fullProps)
  const throwAway = _.keys(fullProps).map((name:any) => {
     console.log("throwAway", name, fullProps[name])
  })
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
export function ColumnsEditor({ df }) {

  const schema = df.schema;
  const baseState = {drop:false, fillNa:false, fillNaVal:"zsdf", type:'foo' }
  const totalProps:Record<string, any> = {}
  schema.fields.map((f:any) => {
  	totalProps[f.name] = baseState
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

  const filledCommands = propsToCommands(fullProps)
  return (<div style={{width:'100%', outline:'3px solid blue',   }}>
   	      <ColumnList  fullProps={totalProps} deepSet={deepSetColumnProps} />
	      <CommandDisplayer filledCommands={ filledCommands }/>
	</div>)
}



