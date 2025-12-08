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

/*
'8:00' - начало рабочего дня
'17:30' - конец рабочего дня
'14:00' - начало встречи
90 - продолжительность встречи в минутах
*/

function isMeetingWithinWorkHours(workStart, workEnd, meetingStart, meetingDuration) {
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours*60 + minutes;
  }

  const workStartMinutes = timeToMinutes(workStart);
  const workEndMinutes = timeToMinutes(workEnd);
  const meetingStartMinutes = timeToMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;
  return meetingStartMinutes >= workStartMinutes && meetingEndMinutes <= workEndMinutes;
}

export { isMeetingWithinWorkHours };


