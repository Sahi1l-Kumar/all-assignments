## File cleaner

Read a file, remove all the extra spaces and write it back to the same file.

For example, if the file input was

```
hello     world    my    name   is       raman
```

After the program runs, the output should be

```
hello world my name is raman
```

const fs = require("fs");

fs.readFile("a.txt", "utf-8", (err, fileContents) => {
fileContents = fileContents.trim();
var str = "";
for (let i = 0; i < fileContents.length - 1; i++) {
if (fileContents.charAt(i) == " " && fileContents.charAt(i + 1) == " ") {
} else {
str += fileContents.charAt(i);
}
}
fs.writeFile("a.txt", str, (err) => {});
});
