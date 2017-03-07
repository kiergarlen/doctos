/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('DateUtilsService', DateUtilsService);

  function DateUtilsService() {
    function padNumber(number, places) {
      var paddedNumber = String(number);
      var i = 0;
      var l = paddedNumber.length;
      var padding = '';
      if (l < places) {
        l = places - l;
        for (i = 0; i < l; i += 1) {
          padding += '0';
        }
        return [
          padding,
          paddedNumber
        ].join('');
      }
      return paddedNumber;
    }

    function dateToIso(date) {
      var parts = getDateParts(date);
      return [
        parts.years(),
        '-',
        padNumber(parts.months() + 1, 2),
        '-',
        padNumber(parts.days(), 2),
        'T',
        padNumber(parts.hours(), 2),
        ':',
        padNumber(parts.minutes(), 2),
        ':',
        padNumber(parts.seconds(), 2),
        '.',
        (parts.milliseconds() / 1000).toFixed(3).slice(2, 5),
        (parts.offset() / 60 > -1) ? '-' : '+',
        padNumber(parts.offset() / 60, 2),
        ':00'
      ].join('');
    }

    function isValidDate(date) {
      if (Object.prototype.toString.call(date) !== '[object Date]') {
        return false;
      }
      return !isNaN(date.getTime());
    }

    function getDateParts(date) {
      return {
        years: date.getFullYear(),
        months: date.getMonth(),
        days: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        milliseconds: date.getMilliseconds(),
        offset: date.getTimezoneOffset()
      };
    }

    return {
      padNumber: padNumber,
      dateToIso: dateToIso,
      isValidDate: isValidDate,
      getDateParts: getDateParts
    };
  }
})();
