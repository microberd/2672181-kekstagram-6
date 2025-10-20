//первая функция
function checkStringLength (ourString, maxLength) {
  if (ourString.length <= maxLength) {
    return true;
  }
  return false;
}
checkStringLength('лунтик', 20);
checkStringLength('уга буга', 2);
checkStringLength('пустой лес', 10);

//вторая функция
function isPalindrome (firstString) {
  const secondString = firstString.replaceAll(' ', '').toLowerCase();
  const reverseString = secondString.split('').reverse().join('');
  if (secondString === reverseString) {
    return true;
  }
  else {
    return false;
  }
}

isPalindrome('топот');
isPalindrome('ДовОд');
isPalindrome('Кекс');
