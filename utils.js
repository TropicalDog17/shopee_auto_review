module.exports = function chooseRandomFromBank(bank) {
  let len = bank.length;
  return bank[randomNumberPicker(0, len - 1, 1)[0]];
};

function randomNumberPicker(min, max, count) {
  var numbers = [];

  while (numbers.length < count) {
    var random = Math.floor(Math.random() * (max - min)) + min;
    if (numbers.indexOf(random) === -1) numbers.push(random);
  }
  return numbers;
}
