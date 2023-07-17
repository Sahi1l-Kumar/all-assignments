Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
clock that shows you the current machine time?

Can you make it so that it updates every second, and shows time in the following formats -

- HH:MM::SS (Eg. 13:45:23)

- HH:MM::SS AM/PM (Eg 01:45:23 PM)

function updateClock(){
var hours = new Date().getHours();
var minutes = new Date().getMinutes();
var seconds = new Date().getSeconds();

hours = (hours < 10 ? "0" : "") + hours;
minutes = (minutes < 10 ? "0" : "") + minutes;
seconds = (seconds < 10 ? "0" : "") + seconds;

console.clear();
if(hours > 12){
console.log(hours - 12 + ":" + minutes + ":" + seconds + " PM");
}
else{
console.log(hours + ":" + minutes + ":" + seconds + " AM");
}
}

updateClock();
setInterval(updateClock, 1000);
