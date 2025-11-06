"use client";

import {Table as ChakraTable} from "@chakra-ui/react";
import type {
    TableRootProps,
    TableHeaderProps,
    TableBodyProps,
    TableRowProps,
    TableCellProps,
    TableColumnHeaderProps,
    TableCaptionProps,
} from "@chakra-ui/react";
import React from "react";

const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
    (props, ref) => <ChakraTable.Root ref={ref} {...props} />
);
TableRoot.displayName = "TableRoot";

const Header = (props: TableHeaderProps) => <ChakraTable.Header {...props} />;
const Body = (props: TableBodyProps) => <ChakraTable.Body {...props} />;
const Row = (props: TableRowProps) => <ChakraTable.Row {...props} />;
const Cell = (props: TableCellProps) => <ChakraTable.Cell {...props} />;
const ColumnHeader = (props: TableColumnHeaderProps) => (
    <ChakraTable.ColumnHeader {...props} />
);
const Caption = (props: TableCaptionProps) => (
    <ChakraTable.Caption {...props} />
);

export const Table = Object.assign(TableRoot, {
    Root: TableRoot,
    Header: Header,
    Body: Body,
    Row: Row,
    Cell: Cell,
    ColumnHeader: ColumnHeader,
    Caption: Caption,
});
