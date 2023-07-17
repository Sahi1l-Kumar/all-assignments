/*
 * Write 3 different functions that return promises that resolve after 1, 2, and 3 seconds respectively.
 * Write a function that uses the 3 functions to wait for all 3 promises to resolve using Promise.all,
 * Print how long it took for all 3 promises to resolve.
 */

function waitOneSecond() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

function waitTwoSecond() {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}

function waitThreeSecond() {
  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
}

var promise1 = waitOneSecond().then(() => {});
var promise2 = waitTwoSecond().then(() => {});
var promise3 = waitThreeSecond().then(() => {});

function calculateTime() {
  var start = new Date().getTime() / 1000;
  Promise.all([promise1, promise2, promise3]).then(() => {
    var end = new Date().getTime() / 1000;
    console.log(`It took ${end - start} seconds for all Promises to resolve`);
  });
}
calculateTime();

// better syntax

// function waitOneSecond() {
//     return new Promise((resolve) => {
//         setTimeout(() =>{
//           resolve();
//         }, 1000);
//     });
// }

// function waitTwoSecond() {
//   return new Promise((resolve) => {
//         setTimeout(() =>{
//           resolve();
//         }, 2000);
//     });
// }

// function waitThreeSecond() {
//   return new Promise((resolve) => {
//         setTimeout(() =>{
//           resolve();
//         }, 3000);
//     });
// }

// function calculateTime() {
//   var start = new Date().getTime()/1000;
//   Promise.all([waitOneSecond(), waitTwoSecond(), waitThreeSecond()]).then(() =>{
//     var end = new Date().getTime()/1000;
//   console.log(`It took ${end - start} seconds for all Promises to resolve`);
//   })
// }
// calculateTime();
