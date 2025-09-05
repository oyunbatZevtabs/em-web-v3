export default function tooOronKhyazgaarliy(number, maxDecimals) {
  if (!number) {
    return 0;
  } else {
    const roundedNumber = +Number(number).toFixed(maxDecimals);
    const formattedNumber = roundedNumber.toString();
    return formattedNumber;
  }
}
