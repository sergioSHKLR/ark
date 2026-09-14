const DAY_TZ = "America/Sao_Paulo";

const OFFICE_WINDOWS = [
  { period: "morning", pane: "morning", start: 5, end: 9, closes: "09:00" },
  { period: "midday", pane: "day", start: 12, end: 15, closes: "15:00" },
  { period: "night", pane: "night", start: 21, end: 24, closes: "24:00" },
];

function tzClock(d) {
  const dt = d || new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: DAY_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(dt);
    const get = function (type) {
      const p = parts.find(function (x) {
        return x.type === type;
      });
      return p ? p.value : "";
    };
    return {
      date: get("year") + "-" + get("month") + "-" + get("day"),
      hour: Number(get("hour")),
      minute: Number(get("minute")),
      second: Number(get("second")),
    };
  } catch (e) {
    return {
      date:
        dt.getFullYear() +
        "-" +
        String(dt.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dt.getDate()).padStart(2, "0"),
      hour: dt.getHours(),
      minute: dt.getMinutes(),
      second: dt.getSeconds(),
    };
  }
}

function todayKey(d) {
  return tzClock(d).date;
}

function paneToPeriod(pane) {
  if (pane === "day") return "midday";
  if (pane === "morning" || pane === "night") return pane;
  return null;
}

function periodToPane(period) {
  if (period === "midday") return "day";
  if (period === "morning" || period === "night") return period;
  return "log";
}

function periodLabelKey(period) {
  if (period === "morning") return "periodMorning";
  if (period === "midday") return "periodMidday";
  if (period === "night") return "periodNight";
  return "officeClosed";
}

function clockHours(clock) {
  return clock.hour + clock.minute / 60 + clock.second / 3600;
}

function TIMENOW(d) {
  const clock = tzClock(d);
  const h = clockHours(clock);
  let period = null;
  let closesAt = null;
  for (let i = 0; i < OFFICE_WINDOWS.length; i++) {
    const w = OFFICE_WINDOWS[i];
    if (h >= w.start && h < w.end) {
      period = w.period;
      closesAt = w.closes;
      break;
    }
  }
  let nextPeriod = "morning";
  let nextAt = "05:00";
  if (period === "morning") {
    nextPeriod = "midday";
    nextAt = "12:00";
  } else if (period === "midday") {
    nextPeriod = "night";
    nextAt = "21:00";
  } else if (period === "night" || h >= 21) {
    nextPeriod = "morning";
    nextAt = "05:00";
  } else if (h < 5) {
    nextPeriod = "morning";
    nextAt = "05:00";
  } else if (h < 12) {
    nextPeriod = "midday";
    nextAt = "12:00";
  } else {
    nextPeriod = "night";
    nextAt = "21:00";
  }
  let prevPeriod = null;
  let prevEnd = null;
  if (h >= 9 && h < 12) {
    prevPeriod = "morning";
    prevEnd = "09:00";
  } else if (h >= 15 && h < 21) {
    prevPeriod = "midday";
    prevEnd = "15:00";
  } else if (h < 5) {
    prevPeriod = "night";
    prevEnd = "24:00";
  }
  return {
    date: clock.date,
    period: period,
    open: !!period,
    nextAt: nextAt,
    nextPeriod: nextPeriod,
    prevPeriod: prevPeriod,
    prevEnd: prevEnd,
    closesAt: closesAt,
    hour: clock.hour,
    minute: clock.minute,
  };
}

function periodHasEnded(dateKey, period, now) {
  now = now || TIMENOW();
  if (!period) return false;
  if (dateKey < now.date) return true;
  if (dateKey > now.date) return false;
  const h = now.hour + now.minute / 60;
  if (period === "morning") return h >= 9;
  if (period === "midday") return h >= 15;
  if (period === "night") return false;
  return false;
}

function periodHasStarted(dateKey, period, now) {
  now = now || TIMENOW();
  if (!period) return false;
  if (dateKey < now.date) return true;
  if (dateKey > now.date) return false;
  const h = now.hour + now.minute / 60;
  if (period === "morning") return h >= 5;
  if (period === "midday") return h >= 12;
  if (period === "night") return h >= 21;
  return false;
}

function officeAccess(pane, now) {
  now = now || TIMENOW();
  if (pane === "log") return "log";
  const period = paneToPeriod(pane);
  if (!period) return "future";
  if (now.open && now.period === period) return "open";
  if (periodHasEnded(now.date, period, now)) return "past";
  return "future";
}

function landingPane(now) {
  now = now || TIMENOW();
  if (now.period) return periodToPane(now.period);
  return periodToPane(now.nextPeriod || "morning");
}
