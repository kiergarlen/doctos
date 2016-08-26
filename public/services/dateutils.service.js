/*global angular*/
(function() {
  'use strict';
  angular
    .module('docsApp')
    .factory('DateUtilsService', DateUtilsService);

  function DateUtilsService() {
    var DateUtils = {};

    DateUtils.padNumber = padNumber;
    DateUtils.dateToIso = dateToIso;
    DateUtils.isValidDate = isValidDate;

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
      return [
        date.getFullYear(),
        '-',
        padNumber(date.getMonth() + 1, 2),
        '-',
        padNumber(date.getDate(), 2),
        'T',
        padNumber(date.getHours(), 2),
        ':',
        padNumber(date.getMinutes(), 2),
        ':',
        padNumber(date.getSeconds(), 2),
        '.',
        (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5),
        (date.getTimezoneOffset() / 60 > -1) ? '-' : '+',
        padNumber(date.getTimezoneOffset() / 60, 2),
        ':00'
      ].join('');
    }

    function isValidDate(date) {
      if (Object.prototype.toString.call(date) !== '[object Date]') {
        return false;
      }
      return !isNaN(date.getTime());
    }

    return DateUtils;
  }
})();
