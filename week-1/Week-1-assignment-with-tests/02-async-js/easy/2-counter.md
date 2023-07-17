## Counter without setInterval

Without using setInterval, try to code a counter in Javascript. There is a hint at the bottom of the file if you get stuck.

var counter = 0;

function printsCounter(){
console.clear();
console.log(counter);
counter++;
setTimeout(printsCounter, 1 \* 1000);
}

setTimeout(printsCounter, 1 \* 1000);

(Hint: setTimeout)
