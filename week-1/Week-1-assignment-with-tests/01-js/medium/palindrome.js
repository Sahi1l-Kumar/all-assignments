/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function removeSpaceAndPunc(str) {
  let temp = "";
  for (let i = 0; i < str.length; i++) {
    if (
      str.charAt(i) == " " ||
      str.charAt(i) == "," ||
      str.charAt(i) == "." ||
      str.charAt(i) == "?" ||
      str.charAt(i) == "!"
    ) {
      continue;
    } else {
      temp += str.charAt(i);
    }
  }
  return temp;
}

function isPalindrome(str) {
  str = str.toLowerCase();
  str = removeSpaceAndPunc(str);
  if (str.split("").reverse().join("") == str) {
    return true;
  } else {
    return false;
  }
}

module.exports = isPalindrome;
