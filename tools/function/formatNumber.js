function formatNumber(num, fixed = 0) {
  if (num === undefined || num === null || num === "") return "0.00";
  var fixedNum = parseFloat(num).toFixed(fixed)?.toString();
  var numSplit = fixedNum.split(".");
  if (numSplit === null || numSplit.length === 0) {
    return "0.00";
  }
  var firstFormatNum = numSplit[0]
    ?.toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  if (fixed === 0) return firstFormatNum;
  return firstFormatNum + "." + numSplit[1];
}

export default formatNumber;

// function formatNumber(num, fixed) {
//   if (num === undefined || num === null || num === "") return "0.0";
//   var fixedNum = parseFloat(num).toFixed(fixed)?.toString();
//   var numSplit = fixedNum.split(".");
//   if (numSplit === null || numSplit.length === 0) {
//     return "0.0";
//   }
//   var firstFormatNum = numSplit[0]
//     ?.toString()
//     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
//   if (fixed === 0) return firstFormatNum;
//   return firstFormatNum + "." + numSplit[1];
// }

// export default formatNumber;

// function formatNumber(num) {
//   if (num === undefined || num === null || num === "") return "0.00";
//   var numSplit = num.toString().split(".");
//   if (numSplit === null || numSplit.length === 0) {
//     return "0.00";
//   }
//   var firstFormatNum = numSplit[0]
//     ?.toString()
//     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1");

//   if (numSplit[1]) {
//     var fractionalPart = numSplit[1].substring(0, 2); // Take the first 2 digits of the fractional part
//     return firstFormatNum + "." + fractionalPart;
//   }

//   return firstFormatNum;
// }

// export default formatNumber;
