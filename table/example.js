const table = new CsvTable("#table-container");

async function runTableExample() {
    try {
        await table.loadUrl("example.csv");

        console.log("Headers:", table.getHeaders());
        console.log("First row:", table.getRow(0));
        console.log("Department column:", table.getColumn(1));
        console.log("First row status:", table.getCell(0, 2));

        table.setCell(0, 2, "On leave");
        table.setRow(2, ["Alan Turing", "Research", "Reviewed", "Ready for approval"]);
        table.setColumn(1, ["Mathematics", "Engineering", "Computer Science"]);
        table.setHeader(2, "Review status");

        console.log("Updated CSV:");
        console.log(table.getData());
    } catch (error) {
        console.error("Unable to load the table example:", error);
    }
}

runTableExample();