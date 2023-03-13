import 'react-data-grid/lib/styles.css';
import React, { Component, useState, useEffect } from "react";
import DataGrid from 'react-data-grid';
import { convertTableDF } from "./staticData";

//@ts-ignore
export function DFViewer(
  {df, style, setActiveCol}:
  {df:any, style?:Record<string, any>, setActiveCol?:any} =
    {df:{}, style:{height:"300px"}, setActiveCol:()=>null}
) {
  const [localColumns, localRows] = convertTableDF(df)
  //Record<string, string|number>
  const localStyle = style;
  return (
    <DataGrid style={localStyle} columns={localColumns} rows={localRows}
    onCellClick={({ row, column }:any, event:any) => {
      //@ts-ignore
      setActiveCol(column.key)
        }}
      />
  );
}
