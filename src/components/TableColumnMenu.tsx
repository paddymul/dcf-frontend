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

export default function ContextMenuDemo() {
  const [contextMenuProps, setContextMenuProps] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLMenuElement | null>(null);
  const isContextMenuOpen = contextMenuProps !== null;

  useLayoutEffect(() => {
    if (!isContextMenuOpen) return;
    function onClick(event: MouseEvent) {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) {
        return;
      }
      setContextMenuProps(null);
    }
    addEventListener('click', onClick);
    return () => {
      removeEventListener('click', onClick);
    };
  }, [isContextMenuOpen]);

//        onCellContextMenu={({ row }:any, event:any) => {
  return (
    <>
      <DataGrid
        columns={columns}
    rows={rows.slice(0,2)}
    rowKeyGetter={rowKeyGetter}
        className="fill-grid"
    direction="ltr"
        //@ts-ignore
        onCellClick={({ row }:any, event:any) => {
	  console.log("row", row);
          event.preventDefault();

          setContextMenuProps({
            top: event.clientY,
            left: event.clientX
          });
        }}
      />
      {isContextMenuOpen &&
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
    </>
  );
}
