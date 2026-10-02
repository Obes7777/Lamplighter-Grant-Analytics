# CsvTable Library

`CsvTable` is a dependency-free JavaScript class for displaying CSV data in an HTML table. It supports CSV strings, browser `File` objects, and CSV URLs.

Excel support uses SheetJS from a browser script tag. No npm installation is required.

The table is edited through JavaScript methods. The rendered cells are not directly editable by users.

The class stores the table in its `data` attribute:

```js
table.data.headers;
table.data.rows;
```

This attribute is the source of truth. Getters read from it, setters update it, and every successful edit calls `render()` to refresh the HTML table.

## Setup

Include the library after the element that will contain the table:

```html
<div id="table-container"></div>
<script src="table.js"></script>
<script>
    const table = new CsvTable("#table-container");
</script>
```

You can also pass the container element directly:

```js
const container = document.querySelector("#table-container");
const table = new CsvTable(container);
```

The constructor throws an error if the target element does not exist.

## Loading CSV Data

The first CSV row becomes the table header. All remaining rows become table data.

### CSV string

```js
table.loadCSV(`Name,Department,Notes
Ada,Research,"Works with, commas"
Grace,Engineering,"Line one
Line two"`);
```

`loadCSV` supports quoted values, commas inside quoted values, escaped quotes, and line breaks inside quoted values.

### Browser file

```html
<input id="csv-file" type="file" accept=".csv,text/csv">
```

```js
document.querySelector("#csv-file").addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (file) {
        await table.loadFile(file);
    }
});
```

### CSV URL

```js
await table.loadUrl("data/example.csv");
```

The URL must allow the browser to fetch it. A failed HTTP response causes `loadUrl` to throw an error.

All loading methods return the table instance, so calls can be chained after the returned promise resolves for `loadFile` and `loadUrl`.

## Loading XLS and XLSX Files

Include the SheetJS script before `table.js`:

```html
<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
<script src="table.js"></script>
```

Load a local `.xls` or `.xlsx` file with `loadExcel`:

```html
<input id="excel-file" type="file" accept=".xls,.xlsx">
```

```js
document.querySelector("#excel-file").addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (file) {
        await table.loadExcel(file);
    }
});
```

The first worksheet is loaded by default. Select a worksheet by name or zero-based index:

```js
await table.loadExcel(file, { sheet: "Grants" });
await table.loadExcel(file, { sheet: 1 });
```

You can also load an Excel file from a URL:

```js
await table.loadExcelUrl("data/grants.xlsx", { sheet: "Grants" });
```

SheetJS converts the selected worksheet to CSV inside the class. That CSV is passed to `loadCSV`, so the converted headers and rows become `table.data.headers` and `table.data.rows`, and all existing getters, setters, rendering, and `getData()` behavior continue to work.

## Reading Data

Indexes are zero-based. The first data row is row `0`, and the first column is column `0`. Header rows are not included in row indexes.

```js
const headers = table.getHeaders();
const firstRow = table.getRow(0);
const firstColumn = table.getColumn(0);
const cell = table.getCell(0, 1);
```

Methods return copies of row, column, and header arrays, so changing a returned array does not directly change the table.

If a requested row, column, or cell does not exist, the method returns `null`.

## Editing Data

Every editing method updates the displayed table immediately.

### Edit one cell

```js
table.setCell(0, 1, "Updated value");
```

### Replace one row

```js
table.setRow(0, ["Ada", "Research", "Updated notes"]);
```

Values beyond the number of headers are ignored. Missing values become empty strings.

### Replace one column

```js
table.setColumn(1, ["Research", "Engineering"]);
```

Only existing rows are updated. Values beyond the number of existing rows are ignored.

### Edit a header

```js
table.setHeader(1, "Team");
```

Invalid row, column, cell, or header edits return `null` and leave the table unchanged.

### Clear the table

```js
table.clear();
```

## Getting the Complete Table as CSV

Use `getData` to get the current headers and rows as a CSV string:

```js
const csv = table.getData();
console.log(csv);
```

Values containing commas, quotes, or line breaks are automatically escaped according to standard CSV quoting rules.

`toCSV()` is also available as an alias for `getData()`.

## Complete Example

```html
<div id="table-container"></div>
<script src="table.js"></script>
<script>
    const table = new CsvTable("#table-container");

    table.loadCSV(`Name,Role,Status
Ada,Research,Active
Grace,Engineering,Active`);

    console.log(table.getRow(0));
    console.log(table.getColumn(1));
    console.log(table.getCell(1, 2));

    table.setCell(0, 2, "On leave");
    console.log(table.getData());
</script>
```