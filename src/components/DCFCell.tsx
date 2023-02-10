import React, { Component, useState, useEffect } from "react";
import _ from 'lodash';
import { ColumnsEditor } from "./ColumnsEditor"
import { tableDf, convertTableDF, columns, rows } from "./staticData";
import { DFViewer } from "./DFViewer"
import { requestDf } from "./utils"


//@ts-ignore
export function DCFCell() {
  const [origDf, setOrigDf] = useState(tableDf)
  useEffect(() => {
     	        requestDf('http://localhost:5000/dcf/df/1?slice_start=3&slice_end=50',
		setOrigDf)
 }, []);
        return (
	    <div style={{width:'100%', height:"100%"}}>
	        <h1 style={{height:"30px"}}>Data Cleaning Framework </h1>
	        <div style={{height:"30%"}}>
		<DFViewer df={origDf} />
		</div>
	        <ColumnsEditor df={origDf} />
	    </div>
        );

}



