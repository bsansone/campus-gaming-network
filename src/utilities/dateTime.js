////////////////////////////////////////////////////////////////////////////////
// Date/Time Utilities

import range from "lodash.range";
import { DateTime, Interval } from "luxon";

export const hasStarted = (startDateTime, endDateTime) => {
  if (!Boolean(startDateTime) || !Boolean(endDateTime)) {
    return undefined;
  }

  return Interval.fromDateTimes(
    startDateTime.toDate(),
    endDateTime.toDate()
  ).contains(DateTime.local());
};

export const hasEnded = (endDateTime) => {
  if (!Boolean(endDateTime)) {
    return undefined;
  }

  return (
    DateTime.local() > DateTime.fromISO(endDateTime.toDate().toISOString())
  );
};

export const formatCalendarDateTime = (dateTime) => {
  if (!Boolean(dateTime)) {
    return undefined;
  }

  return DateTime.fromISO(dateTime.toDate().toISOString()).toRelativeCalendar();
};

export const buildDateTime = (dateTime) => {
  if (!Boolean(dateTime)) {
    return undefined;
  }

  const _dateTime = dateTime.toDate();
  const _dateTimeISO = _dateTime.toISOString();
  // TODO: Move to constants
  const localeFormat = {
    ...DateTime.DATETIME_FULL,
    ...{ month: "long", day: "numeric" },
  };

  return {
    firestore: dateTime,
    base: _dateTime,
    iso: _dateTimeISO,
    locale: DateTime.fromISO(_dateTimeISO).toLocaleString(localeFormat),
    relative: DateTime.fromISO(_dateTimeISO).toRelativeCalendar(),
  };
};

export const firebaseToLocaleString = (dateTime) => {
  if (!Boolean(dateTime)) {
    return undefined;
  }

  const seconds = dateTime._seconds || dateTime.seconds;

  if (!Boolean(seconds) || typeof seconds !== "number") {
    return undefined;
  }

  return DateTime.fromSeconds(seconds).toLocaleString({
    ...DateTime.DATETIME_FULL,
    ...{ month: "long", day: "numeric" },
  });
};

export const getYears = (
  min = 2020,
  max = 2020,
  options = { reverse: false }
) => {
  let years = [];

  if (min < 0 || max < 0) {
    return years;
  }

  years = [...range(min, max).map((year) => year.toString())];

  if (options.reverse) {
    years = [...years.reverse()];
  }

  return years;
};

export const getTimes = (options = { increment: 15 }) => {
  let hour = 0;
  let times = [];

  // So we dont create negative times
  if (options.increment < 0) {
    return times;
  }

  while (hour <= 23) {
    let minutes = 0;

    while (minutes <= 45) {
      const _hour = hour < 10 ? `0${hour}` : hour;
      const _minutes = minutes < 10 ? `0${minutes}` : minutes;
      times.push(`${_hour}:${_minutes}`);
      minutes += options.increment;
    }

    hour++;
  }

  return times;
};

export const getClosestTimeByN = (hour, minutes, n) => {
  let _hour = hour;
  let _minutes = Math.ceil(minutes / 10) * 10;

  while (_minutes % n !== 0) {
    _minutes += 1;
  }

  if (_minutes === 60) {
    _minutes = "00";
    _hour += 1;
  }

  return `${_hour}:${_minutes}`;
};
