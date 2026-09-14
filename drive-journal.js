const DRIVE_FOLDER_NAME = "Devotional_Journal";
const DRIVE_SHEET_NAME = "Devotional_Entries";
const DRIVE_SHEET_HEADERS = [
  "Timestamp",
  "Period",
  "TextContent",
  "MediaURL",
  "Language",
];
const DRIVE_FOLDER_KEY = "noah-drive-folder-id";
const DRIVE_SHEET_KEY = "noah-drive-sheet-id";
const DRIVE_MIGRATED_KEY = "noah-drive-migrated-v1";
const SCOPE_FILE =
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata";
const SCOPE_FULL =
  "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata";

function driveApi(url, opts) {
  opts = opts || {};
  const headers = Object.assign({}, driveHeaders(), opts.headers || {});
  return fetch(url, Object.assign({}, opts, { headers: headers })).then(
    function (res) {
      if (!res.ok) {
        const err = new Error("http " + res.status);
        err.status = res.status;
        return res.text().then(function (body) {
          err.body = body;
          throw err;
        });
      }
      if (res.status === 204) return null;
      const ct = res.headers.get("content-type") || "";
      if (ct.indexOf("application/json") >= 0) return res.json();
      return res.text();
    },
  );
}

function driveNeedsWiderScope(err) {
  if (!err) return false;
  if (err.status === 403 || err.status === 401) return true;
  const body = String(err.body || err.message || "");
  return /insufficientPermissions|accessNotConfigured|ACCESS_TOKEN_SCOPE_INSUFFICIENT/i.test(
    body,
  );
}

function ensureFolder(name) {
  const cached = localStorage.getItem(DRIVE_FOLDER_KEY);
  if (cached) return Promise.resolve(cached);
  const q = encodeURIComponent(
    "name='" +
      name +
      "' and mimeType='application/vnd.google-apps.folder' and trashed=false",
  );
  return driveApi(
    "https://www.googleapis.com/drive/v3/files?q=" +
      q +
      "&fields=files(id,name)&pageSize=10&spaces=drive",
  ).then(function (data) {
    const hit = ((data && data.files) || []).find(function (f) {
      return f && f.id;
    });
    if (hit) {
      localStorage.setItem(DRIVE_FOLDER_KEY, hit.id);
      return hit.id;
    }
    return driveApi("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        mimeType: "application/vnd.google-apps.folder",
      }),
    }).then(function (created) {
      localStorage.setItem(DRIVE_FOLDER_KEY, created.id);
      return created.id;
    });
  });
}

function writeSheetHeaders(id) {
  return driveApi(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      id +
      "/values/A1:E1?valueInputOption=USER_ENTERED",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: [DRIVE_SHEET_HEADERS] }),
    },
  ).then(function () {
    return id;
  });
}

function ensureSheetHeaders(id) {
  return driveApi(
    "https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/A1:E1",
  )
    .then(function (data) {
      const row =
        data && data.values && data.values[0] ? data.values[0] : [];
      if (row[0] === "Timestamp" && row.length >= 5) return id;
      return writeSheetHeaders(id);
    })
    .catch(function () {
      return writeSheetHeaders(id);
    });
}

function ensureSheet(name, headers, folderId) {
  const cached = localStorage.getItem(DRIVE_SHEET_KEY);
  if (cached) return ensureSheetHeaders(cached).then(function () { return cached; });
  const q = encodeURIComponent(
    "name='" +
      name +
      "' and mimeType='application/vnd.google-apps.spreadsheet' and '" +
      folderId +
      "' in parents and trashed=false",
  );
  return driveApi(
    "https://www.googleapis.com/drive/v3/files?q=" +
      q +
      "&fields=files(id,name)&pageSize=10&spaces=drive",
  ).then(function (data) {
    const hit = ((data && data.files) || []).find(function (f) {
      return f && f.id;
    });
    if (hit) {
      localStorage.setItem(DRIVE_SHEET_KEY, hit.id);
      return ensureSheetHeaders(hit.id).then(function () {
        return hit.id;
      });
    }
    return driveApi("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        mimeType: "application/vnd.google-apps.spreadsheet",
        parents: [folderId],
      }),
    }).then(function (created) {
      localStorage.setItem(DRIVE_SHEET_KEY, created.id);
      return writeSheetHeaders(created.id);
    });
  });
}

function ensureDriveJournal() {
  return ensureFolder(DRIVE_FOLDER_NAME).then(function (folderId) {
    return ensureSheet(DRIVE_SHEET_NAME, DRIVE_SHEET_HEADERS, folderId).then(
      function (sheetId) {
        return { folderId: folderId, sheetId: sheetId };
      },
    );
  });
}

function uploadMultipart(file, folderId) {
  const meta = {
    name: file.name || "attachment",
    parents: [folderId],
  };
  if (file.type) meta.mimeType = file.type;
  const boundary = "ark" + Date.now();
  const body = new Blob([
    "--" + boundary + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n",
    JSON.stringify(meta),
    "\r\n--" +
      boundary +
      "\r\nContent-Type: " +
      (file.type || "application/octet-stream") +
      "\r\n\r\n",
    file,
    "\r\n--" + boundary + "--",
  ]);
  return driveApi(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/related; boundary=" + boundary,
      },
      body: body,
    },
  ).then(function (created) {
    const id = created.id;
    return {
      id: id,
      webViewLink:
        created.webViewLink ||
        (id ? "https://drive.google.com/file/d/" + id + "/view" : ""),
    };
  });
}

function appendEntry(row) {
  const id = localStorage.getItem(DRIVE_SHEET_KEY);
  if (!id) return Promise.reject(new Error("sheet"));
  return driveApi(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      id +
      "/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: [row] }),
    },
  );
}

function listEntries() {
  const id = localStorage.getItem(DRIVE_SHEET_KEY);
  if (!id) return Promise.resolve([]);
  return driveApi(
    "https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/A2:E",
  ).then(function (data) {
    return (data && data.values) || [];
  });
}

function periodToSlot(period) {
  if (period === "midday" || period === "day") return "day";
  if (period === "morning" || period === "night") return period;
  return period;
}

function entriesToJournal(rows) {
  const out = {};
  (rows || []).forEach(function (row) {
    const ts = row[0] || "";
    const period = String(row[1] || "").toLowerCase();
    const text = row[2] || "";
    const media = row[3] || "";
    const d = ts ? new Date(ts) : null;
    const date =
      d && !isNaN(d.getTime()) ? todayKey(d) : String(ts).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    const slot = periodToSlot(period);
    out[date] = out[date] || { checks: {}, notes: {}, media: {}, updatedAt: ts };
    if (String(text).trim()) out[date].notes[slot] = text;
    if (media) {
      out[date].media = out[date].media || {};
      out[date].media[slot] = media;
    }
    if (ts) out[date].updatedAt = ts;
  });
  return out;
}

function cacheEntries(rows) {
  const fromSheet = entriesToJournal(rows);
  const local = loadJournal();
  if (!Object.keys(fromSheet).length) return local;
  const merged = Object.assign({}, local, fromSheet);
  saveJournalSilent(merged);
  localStorage.setItem(DRIVE_SYNC_KEY, new Date().toISOString());
  return merged;
}

function restoreEntries() {
  return listEntries().then(function (rows) {
    const merged = cacheEntries(rows);
    if (typeof bindJournalRefresh === "function") bindJournalRefresh();
    if (typeof renderLog === "function") renderLog();
    return merged;
  });
}

const LOCAL_MIGRATED_KEY = "noah-drive-local-migrated-v1";

function appendNotesMap(data) {
  let writes = Promise.resolve();
  Object.keys(data || {}).forEach(function (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    const notes = (data[date] && data[date].notes) || {};
    const updated = (data[date] && data[date].updatedAt) || date + "T12:00:00";
    ["morning", "day", "night"].forEach(function (slot) {
      const text = notes[slot];
      if (!text || !String(text).trim()) return;
      writes = writes.then(function () {
        return appendEntry([
          updated,
          paneToPeriod(slot),
          String(text),
          "",
          lang === "pt" ? "pt" : "en",
        ]);
      });
    });
  });
  return writes;
}

function migrateLocalOnce() {
  if (localStorage.getItem(LOCAL_MIGRATED_KEY) === "1")
    return Promise.resolve(false);
  return listEntries().then(function (rows) {
    if (rows.length) {
      localStorage.setItem(LOCAL_MIGRATED_KEY, "1");
      return false;
    }
    return appendNotesMap(loadJournal()).then(function () {
      localStorage.setItem(LOCAL_MIGRATED_KEY, "1");
      return true;
    });
  });
}

function migrateAppDataOnce() {
  if (localStorage.getItem(DRIVE_MIGRATED_KEY) === "1")
    return Promise.resolve(false);
  if (typeof driveListJournals !== "function") return Promise.resolve(false);
  return driveListJournals()
    .then(function (files) {
      if (!files || !files.length) {
        localStorage.setItem(DRIVE_MIGRATED_KEY, "1");
        return false;
      }
      let remote = {};
      let chain = Promise.resolve();
      files.forEach(function (file) {
        chain = chain.then(function () {
          return driveDownload(file.id).then(function (part) {
            if (part) remote = mergeJournals(remote, part);
          });
        });
      });
      return chain.then(function () {
        return appendNotesMap(remote).then(function () {
          localStorage.setItem(DRIVE_MIGRATED_KEY, "1");
          return true;
        });
      });
    })
    .catch(function () {
      return false;
    });
}
