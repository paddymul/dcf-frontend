import 'react-data-grid/lib/styles.css';
import React, { Component, useState, useEffect } from "react";
import DataGrid from 'react-data-grid';
import { convertTableDF } from "./staticData";

//@ts-ignore
export function DFViewer({df, style={height:"300px"} }) {
  const [localColumns, localRows] = convertTableDF(df)
  //Record<string, string|number>
  const localStyle = style;
  return (
      <DataGrid style={localStyle} columns={localColumns} rows={localRows} />
  );
}
