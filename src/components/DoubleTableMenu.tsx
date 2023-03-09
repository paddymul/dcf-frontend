import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import { createPortal } from 'react-dom';
import { tableDf } from "./staticData";
import { propsToCommands, requestDf } from "./utils";
import DataGrid from 'react-data-grid';
import { columns, rows } from "./staticData";
import _ from 'lodash';

export type Direction = 'ltr' | 'rtl';
export interface Props {
  direction: Direction;
}

function rowKeyGetter(row: any) {
  return row.index;
}

export function ContextCellMenu() {
  const [contextMenuProps, setContextMenuProps] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLMenuElement | null>(null);
  const isContextMenuOpen = contextMenuProps !== null
  useLayoutEffect(() => {
    if (!isContextMenuOpen) return;
    function onClick(event: MouseEvent) {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) {
        return; }
      setContextMenuProps(null); }
    addEventListener('click', onClick);
    return () => {
      removeEventListener('click', onClick);};
  }, [isContextMenuOpen]);

  const row1:Record<string,any> = {}
  columns.map((col:any) => {row1[col.key] = "false"})
  const [columnSelectRows, setColumnSelect] = useState([row1])
  return (
    <div className="TableColumnsMenu" style={{padding:"0 10px 0 0"}}>
      <DataGrid style={{height:"150px"}}
        columns={columns}
         rows = {columnSelectRows}
        //@ts-ignore
        onCellContextMenu={({ row, column }:any, event:any) => {
	  console.log("column", column.name);

	  const tempRow = _.clone(columnSelectRows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
	  setColumnSelect([tempRow])
	  console.log("event", event);
	  event.preventDefault();

          setContextMenuProps({
            top: event.clientY,
            left: event.clientX
          });
	  console.log("after setContextMenuProps")
        }}
      />
      {contextMenuProps !== null &&
        createPortal(
          <menu
            ref={menuRef}
            className="modal"
            style={
              {
                top: contextMenuProps.top,
                left: contextMenuProps.left
              } as unknown as React.CSSProperties
            }
          >
            <li><button
                  onClick={() => {
                    console.log("delete row clicked");
                    setContextMenuProps(null);
                  }}
              >
                Delete Row
              </button>
            </li>
          </menu>,
          document.body
        )}
    </div>
  );

}

const sym = (symbolName:string) => {
  return {'symbol':symbolName}
}

const bakedCommands = [
  [sym("dropcol"), sym('df'), 'col1'],
  [sym("fillna"), sym('df'), 'col2', 5]
]



//@ts-ignore
const CommandViewer = ({commands}) => {
  //@ts-ignore
  const columns = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name+index.toString()
    const column = {key, name}
    return column
  })

  //@ts-ignore
  const rowElements = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name+index.toString()
    const rowEl: Record<string, any> = {}
    rowEl[key] = element[2]
    return rowEl
  })

  const rows = [_.merge({}, ...rowElements)]
  return <DataGrid style={{height:"150px"}}
        //@ts-ignore
        columns={columns}
        rows={rows}
      />
}

export default function DoubleTableMenu2() {

  const row1:Record<string,any> = {}
  columns.map((col:any) => {row1[col.key] = "false"})
  const [columnSelectRows, setColumnSelect] = useState([row1])

  const commandsColumns = [{key:"fillna", name:"fillna-name"}, {key:"drop", name:"drop-name"}]
  const commandRows = [{fillna:"false", drop:"false"}]
  
  const [generatedCommands, setGeneratedCommands] = useState([])
  
  return (
    <div className="TableColumnsMenu" style={{padding:"0 10px 0 0", width:"100%"}}>
      <CommandViewer commands={bakedCommands}/>
      <DataGrid style={{height:"150px"}}
        columns={columns}
         rows={columnSelectRows}
        //@ts-ignore
        onCellClick={({ row, column }:any, event:any) => {
	  console.log("column", column.name);
	  const tempRow = _.clone(columnSelectRows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
	  setColumnSelect([tempRow])
        }}
      />
    <DataGrid style={{height:"150px"}}
        columns={commandsColumns}
        rows={commandRows}
    onCellClick={({ row, column }:any, event:any) => {
	  console.log("column", column.name);
          // add to generated commands
	  const tempRow = _.clone(columnSelectRows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
	  setColumnSelect([tempRow])
        }}
    />

    </div>
  );
}

