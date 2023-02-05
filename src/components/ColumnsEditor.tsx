import React, { Component, useState } from "react";



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
   const handleFillnaChanged = () => {
     colStateChanged({...colState, fillna:!colState.fillna}) }  

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
		       type="checkbox"
                       checked={colState.fillna}
		       onChange={handleFillnaChanged}/>
		    FillNa
	       </label>
     </div>
  )
}


export function CommandDisplayer(
  colState:any) {


  const columnName = "fooCol"
  const commands:any[] = []
  if (colState.drop) {
      commands.push(['drop', columnName])
  }
  if (colState.fillna) {
      commands.push(['fillna', columnName, 10])
  }
 
    return (
     	   <div style={{width:'100%',  height:'30px', border:'1px solid green'}}>
	       <h1> paddy </h1>
	       <pre>{JSON.stringify(commands)}</pre>
           </div>)
}


//@ts-ignore
function ColumnList({ schema }) {
  const listItems = schema.fields.map((f:any) =>
    <div style={{border:"1px solid black", padding:"3px"}}>
        <dt key={f.name}>{f.name}</dt>
        <dd key={f.name}>{f.type}</dd>
    </div>);

  return (<div style={{width:'100%', outline:'3px solid blue',   }}>
              <dl style={{display:"flex"}}>{listItems}</dl>
	  </div>)
}



//@ts-ignore
export function ColumnsEditor({ schema }) {
  console.log("schema", schema)
  const [columnProps, setColumnProps] = useState({drop:false, fillna:false })	
  //setColumnProps({drop:true, fillna:false})
   //console.log("colStateChanged", colStateChanged, typeof colStateChanged)	
   console.log("setColumnProps", setColumnProps, typeof setColumnProps)	
   //              <ColumnEditor colState={columnProps} colStateChanged={(newObj:any) => setColumnProps(newObj)}/>
  return (<div style={{width:'100%', outline:'3px solid blue',   }}>
           <ColumnEditor colState={columnProps} colStateChanged={setColumnProps}/>
              <ColumnEditor colState={columnProps} colStateChanged={setColumnProps}/>
	      <ColumnList schema={schema}/>
	      <CommandDisplayer colState={columnProps}/>
	</div>)
}



