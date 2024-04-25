import { Matrix } from "react-spreadsheet";

export type DocumentContent = Matrix<{ value: string }>;

function generateRowsAndColumns(): { rows: string[]; columns: string[] } {
  const rows = [];
  const columns = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
  for (let i = 1; i <= 100; i++) {
    rows.push(String(i));
  }

  return { rows, columns };
}

export const { rows, columns } = generateRowsAndColumns();

export function fillData(content: DocumentContent): DocumentContent {
  const data: DocumentContent = [];
  for (let i = 0; i < rows.length; i++) {
    data.push([]);
    for (let j = 0; j < columns.length; j++) {
      data[i].push(content[i] && content[i][j] ? content[i][j] : { value: "" });
    }
  }
  return data;
}

export function trimData(content: DocumentContent): DocumentContent {
  const data: DocumentContent = [];
  let rowCount = rows.length;
  let columnCount = columns.length;

  while (
    rowCount > 1 &&
    content[rowCount - 1]?.every((cell) => cell?.value === "")
  ) {
    rowCount -= 1;
  }

  while (
    columnCount > 1 &&
    content.every(
      (row) => !row[columnCount - 1] || row[columnCount - 1]?.value === ""
    )
  ) {
    columnCount -= 1;
  }

  for (let i = 0; i < rowCount; i++) {
    data.push([]);
    for (let j = 0; j < columnCount; j++) {
      data[i].push(content[i][j]);
    }
  }

  return data;
}
