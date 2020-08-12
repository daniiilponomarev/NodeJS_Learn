// csv.

var fs = require("fs");
var csv = require("csvtojson");

var file = "./csv/file.csv";
var file2 = "./result.txt";

var readable = fs.createReadStream(file);
var writable = fs.createWriteStream(file2);

function onNext(json) {
  return new Promise((resolve) => {
    try {
      writable.write(JSON.stringify(json) + "\n");
      resolve();
    } catch (error) {
      console.log(error);
    }
  });
}
function onError(error) {
  console.log(error);
}
function onComplete() {
  console.log("Completed");
}

csv({ delimiter: ";" })
  .fromStream(readable)
  .subscribe(onNext, onError, onComplete);
