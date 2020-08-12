// csv.

const fs = require("fs");
const csv = require("csvtojson");

const file = "./csv/file.csv";
const file2 = "./result.txt";

const readable = fs.createReadStream(file);
const writable = fs.createWriteStream(file2);

const processCSV = async () => {
  try {
    const rows = await csv({
      delimiter: ";",
    }).fromStream(readable);

    rows.forEach((row) => {
      writable.write(JSON.stringify(row) + "\n");
    });
  } catch (error) {
    console.log(error);
  }
};

processCSV();
