import React, { Component, useState, useEffect } from "react";
import _ from 'lodash';
import { ColumnsEditor } from "./ColumnsEditor"
import { tableDf, convertTableDF, columns, rows } from "./staticData";
import { DFViewer } from "./DFViewer"
import { requestDf } from "./utils"



//@ts-ignore
export function TransformedDf({instructions}) {

   
  const [schema, setSchema] = useState({})
  const [columns, setColumns] = useState([])
  const [rows, setRows]  = useState([])
  useEffect(() => {
  	       //fetch('http://localhost:8080/static-json/base-df.json')
  	       fetch('http://localhost:5000/dcf/df/1?slice_start=3&slice_end=50')
	       //fetch(`http://localhost:5000/dcf/transform_df/1?instructions=${transformInstructions(instructions)}&slice_start=3&slice_end=50`)
	        .then(async (response) => {
		   console.log(response)
		   const tableDf = await response.json()
		   setSchema(tableDf.schema)
		   const [localColumns, localRows] = convertTableDF(tableDf)
		   setColumns(localColumns)
		   setRows(localRows)
		   
		   }
 );
 }, []);
}

//@ts-ignore
export function DCFCell() {
  const [origDf, setOrigDf] = useState(tableDf)
  useEffect(() => {
     	        requestDf('http://localhost:5000/dcf/df/1?slice_start=3&slice_end=8',
		setOrigDf)
 }, []);
        return (
	    <div style={{width:'100%'}}>
		<DFViewer df={origDf} />
	        <ColumnsEditor df={origDf} />

	    </div>
        );

}



