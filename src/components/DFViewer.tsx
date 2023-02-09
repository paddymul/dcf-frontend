import 'react-data-grid/lib/styles.css';
import React, { Component, useState, useEffect } from "react";
import DataGrid from 'react-data-grid';
import { convertTableDF } from "./staticData";

//@ts-ignore
export function DFViewer({df}) {
  const [localColumns, localRows] = convertTableDF(df)
  return (
    <div style={{width:'100%'}}>
      <DataGrid columns={localColumns} rows={localRows} />
    </div>
  );
}
