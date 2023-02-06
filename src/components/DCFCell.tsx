import React, { Component, useState, useEffect } from "react";
import _ from 'lodash';
import { ColumnsEditor } from "./ColumnsEditor";
import { tableDf, convertTableDF, columns, rows } from "./staticData";
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';


//@ts-ignore
export function DCFCell() {

  const [schema, setSchema] = useState({})
  const [columns, setColumns] = useState([])
  const [rows, setRows]  = useState([])
  
  useEffect(() => {
  	       fetch('http://localhost:8080/static-json/base-df.json')
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

        return (
	    <div style={{width:'100%'}}>
	        <ColumnsEditor schema={tableDf.schema} />
	        <DataGrid columns={columns} rows={rows} />
	    </div>
        );

}



