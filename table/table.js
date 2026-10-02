class CsvTable {
    constructor(target, options = {}) {
        this.container = typeof target === "string"
            ? document.querySelector(target)
            : target;
        this.data = {
            headers: [],
            rows: []
        };
        this.table = null;

        if (!this.container) {
            throw new Error("Table container was not found.");
        }

        if (options.csv) {
            this.loadCSV(options.csv);
        }
    }

    loadCSV(csv) {
        const records = this.parseCSV(csv);

        if (records.length === 0) {
            this.data = {
                headers: [],
                rows: []
            };
            this.render();
            return this;
        }

        this.data = {
            headers: [...records[0]],
            rows: records.slice(1).map((row) => this.normalizeRow(row, records[0]))
        };
        this.render();
        return this;
    }

    async loadFile(file) {
        if (!(file instanceof File)) {
            throw new TypeError("loadFile expects a File object.");
        }

        this.loadCSV(await file.text());
        return this;
    }

    async loadUrl(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Unable to load CSV: ${response.status} ${response.statusText}`);
        }

        this.loadCSV(await response.text());
        return this;
    }

    async loadExcel(file, options = {}) {
        if (!(file instanceof Blob)) {
            throw new TypeError("loadExcel expects a File or Blob object.");
        }

        return this.loadExcelBuffer(await file.arrayBuffer(), options);
    }

    async loadExcelUrl(url, options = {}) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Unable to load Excel file: ${response.status} ${response.statusText}`);
        }

        return this.loadExcelBuffer(await response.arrayBuffer(), options);
    }

    getRow(rowIndex) {
        return this.data.rows[rowIndex] ? [...this.data.rows[rowIndex]] : null;
    }

    getColumn(columnIndex) {
        if (!Number.isInteger(columnIndex) || columnIndex < 0 || columnIndex >= this.data.headers.length) {
            return null;
        }

        return this.data.rows.map((row) => row[columnIndex] ?? "");
    }

    getCell(rowIndex, columnIndex) {
        const row = this.data.rows[rowIndex];
        return row && Number.isInteger(columnIndex) && columnIndex >= 0 && columnIndex < this.data.headers.length
            ? row[columnIndex] ?? ""
            : null;
    }

    getHeaders() {
        return [...this.data.headers];
    }

    setCell(rowIndex, columnIndex, value) {
        if (!this.hasCell(rowIndex, columnIndex)) {
            return null;
        }

        this.data.rows[rowIndex][columnIndex] = String(value);
        this.render();
        return this.getCell(rowIndex, columnIndex);
    }

    setRow(rowIndex, values) {
        if (!this.data.rows[rowIndex] || !Array.isArray(values)) {
            return null;
        }

        this.data.rows[rowIndex] = this.normalizeRow(values);
        this.render();
        return this.getRow(rowIndex);
    }

    setColumn(columnIndex, values) {
        if (!Array.isArray(values) || columnIndex < 0 || columnIndex >= this.data.headers.length) {
            return null;
        }

        values.forEach((value, rowIndex) => {
            if (this.data.rows[rowIndex]) {
                this.data.rows[rowIndex][columnIndex] = String(value);
            }
        });

        this.render();
        return this.getColumn(columnIndex);
    }

    setHeader(columnIndex, value) {
        if (columnIndex < 0 || columnIndex >= this.data.headers.length) {
            return null;
        }

        this.data.headers[columnIndex] = String(value);
        this.render();
        return this.data.headers[columnIndex];
    }

    clear() {
        this.data = {
            headers: [],
            rows: []
        };
        this.render();
        return this;
    }

    getData() {
        return [this.data.headers, ...this.data.rows]
            .map((row) => row.map((value) => this.escapeCSV(value)).join(","))
            .join("\n");
    }

    toCSV() {
        return this.getData();
    }

    loadExcelBuffer(buffer, options = {}) {
        const xlsx = this.getXLSX();
        const workbook = xlsx.read(buffer, { type: "array" });
        const sheetName = this.getSheetName(workbook, options.sheet);
        const worksheet = workbook.Sheets[sheetName];
        const csv = xlsx.utils.sheet_to_csv(worksheet);

        this.loadCSV(csv);
        return this;
    }

    getSheetName(workbook, requestedSheet) {
        if (workbook.SheetNames.length === 0) {
            throw new Error("The Excel workbook does not contain any worksheets.");
        }

        if (requestedSheet === undefined) {
            return workbook.SheetNames[0];
        }

        if (Number.isInteger(requestedSheet)) {
            const sheetName = workbook.SheetNames[requestedSheet];
            if (sheetName) {
                return sheetName;
            }
        }

        if (typeof requestedSheet === "string" && workbook.SheetNames.includes(requestedSheet)) {
            return requestedSheet;
        }

        throw new Error(`Worksheet not found: ${requestedSheet}`);
    }

    getXLSX() {
        if (typeof XLSX !== "undefined") {
            return XLSX;
        }

        throw new Error("SheetJS is not loaded. Include the SheetJS script before table.js.");
    }

    render() {
        this.container.replaceChildren();

        if (this.data.headers.length === 0) {
            this.table = null;
            return this;
        }

        this.table = document.createElement("table");
        this.table.className = "data-table";

        const headerRow = document.createElement("tr");
        this.data.headers.forEach((header) => {
            const cell = document.createElement("th");
            cell.scope = "col";
            cell.textContent = header;
            headerRow.append(cell);
        });

        const thead = document.createElement("thead");
        thead.append(headerRow);
        this.table.append(thead);

        const tbody = document.createElement("tbody");
        this.data.rows.forEach((row) => {
            const rowElement = document.createElement("tr");
            row.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                rowElement.append(cell);
            });
            tbody.append(rowElement);
        });
        this.table.append(tbody);
        this.container.append(this.table);
        return this;
    }

    parseCSV(csv) {
        const records = [];
        let record = [];
        let value = "";
        let inQuotes = false;

        for (let index = 0; index < csv.length; index += 1) {
            const character = csv[index];
            const nextCharacter = csv[index + 1];

            if (character === '"' && inQuotes && nextCharacter === '"') {
                value += '"';
                index += 1;
            } else if (character === '"') {
                inQuotes = !inQuotes;
            } else if (character === "," && !inQuotes) {
                record.push(value);
                value = "";
            } else if ((character === "\n" || character === "\r") && !inQuotes) {
                if (character === "\r" && nextCharacter === "\n") {
                    index += 1;
                }
                record.push(value);
                records.push(record);
                record = [];
                value = "";
            } else {
                value += character;
            }
        }

        if (value !== "" || record.length > 0) {
            record.push(value);
            records.push(record);
        }

        return records;
    }

    normalizeRow(row, headers = this.data.headers) {
        return headers.map((_, columnIndex) => String(row[columnIndex] ?? ""));
    }

    hasCell(rowIndex, columnIndex) {
        return Boolean(
            this.data.rows[rowIndex]
            && Number.isInteger(columnIndex)
            && columnIndex >= 0
            && columnIndex < this.data.headers.length
        );
    }

    escapeCSV(value) {
        const stringValue = String(value ?? "");
        return /[",\n\r]/.test(stringValue)
            ? `"${stringValue.replaceAll('"', '""')}"`
            : stringValue;
    }
}

if (typeof window !== "undefined") {
    window.CsvTable = CsvTable;
}

if (typeof module !== "undefined") {
    module.exports = CsvTable;
}