## Write to a file

Using the fs library again, try to write to the contents of a file.
You can use the fs library to as a black box, the goal is to understand async tasks.

const fs = require("fs");

function sum(n){
var sum = 0;
for(let i = 0; i < n; i++){
sum += i;
}
console.log(sum);
}

function fileIsRead(err,fileContent){
console.log(fileContent);
}

function fileIsWritten(err){
console.log("Data is written to the file");
}

fs.writeFile("a.txt","Adding this", fileIsWritten);
fs.readFile("a.txt","utf-8", fileIsRead);

sum(100000);
