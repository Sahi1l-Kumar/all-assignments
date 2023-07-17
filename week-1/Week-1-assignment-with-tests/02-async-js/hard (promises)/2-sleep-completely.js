/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
    const start = new Date().getTime();
    while (true) {
      if ((new Date().getTime() - start) / 1000 >= seconds) {
        break;
      }
    }
  });
}

sleep(5).then(() => {
  console.log("Logged after n seconds");
});

console.log("HI");
