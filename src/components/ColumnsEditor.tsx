import React, { Component, useState } from "react";
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
export function CommandDisplayer({fullProps}) {
  const filledCommands = _.flatten(_.keys(fullProps).map((columnName) => {
  	const colState = fullProps[columnName]
	if(colState.drop === false && colState.fillna === false){
	    return []
	}
	const commands: any[] = [];
	if (colState.drop) {
	   commands.push(['drop', columnName])
	}
	if (colState.fillNa) {
	      commands.push(['fillna', columnName, colState.fillNaVal])
	}
	return commands
  }))
 
    return (
     	   <div style={{width:'100%',   border:'1px solid orange'}}>
	       <pre style={{border:'1px solid gray', height:'50px'}}>{JSON.stringify(filledCommands)}</pre>
           </div>)
}

//@ts-ignore
function ColumnList({ schema, fullProps, deepSet }) {
  const [columnProps, setColumnProps] = useState({drop:false, fillNa:false, fillNaVal:"zsdf" })	


  const listItems = schema.fields.map((f:any) =>
    <div key={f.name} style={{border:"1px solid black", padding:"3px"}}>
        <dt>{f.name}</dt>
        <dd>{f.type}

              <ColumnEditor key={f.name} colState={fullProps[f.name]} colStateChanged={deepSet([f.name])}/>	
	      </dd>
    </div>);

  return (<div style={{width:'100%', outline:'3px solid blue'}}>
              <dl style={{display:"flex"}}>{listItems}</dl>
	  </div>)
}

//@ts-ignore
export function ColumnsEditor({ schema }) {

  const baseState = {drop:false, fillNa:false, fillNaVal:"zsdf" }
  const totalProps:Record<string, any> = {}
  schema.fields.map((f:any) => {
  	totalProps[f.name] = baseState
  })	

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
   	      <ColumnList schema={schema} fullProps={fullProps} deepSet={deepSetColumnProps} />
	      <CommandDisplayer fullProps={fullProps}/>
	</div>)
}



