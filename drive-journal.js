const DRIVE_FOLDER_NAME = "Devotional_Journal";
const DRIVE_SHEET_NAME = "Devotional_Entries";
const DRIVE_JSON_NAME = "Devotional_Entries.json";
const DRIVE_SHEET_HEADERS = [
  "Timestamp",
  "Period",
  "TextContent",
  "MediaURL",
  "Language",
];
const DRIVE_FOLDER_KEY = "noah-drive-folder-id";
const DRIVE_SHEET_KEY = "noah-drive-sheet-id";
const DRIVE_JSON_KEY = "noah-drive-json-id";
const DRIVE_STORE_KEY = "noah-drive-store";
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
        err.url = url;
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

function driveErrBody(err) {
  return String((err && (err.body || err.message)) || "");
}

function isSheetsUnavailable(err) {
  if (!err) return false;
  const url = String((err && err.url) || "");
  if (/sheets\.googleapis\.com/i.test(url)) return true;
  return /accessNotConfigured|has not been used in project|Sheets API/i.test(
    driveErrBody(err),
  );
}

function isInsufficientScope(err) {
  if (!err) return false;
  return /insufficientPermissions|ACCESS_TOKEN_SCOPE_INSUFFICIENT/i.test(
    driveErrBody(err),
  );
}

function driveNeedsWiderScope(err) {
  if (!err) return false;
  if (isSheetsUnavailable(err)) return false;
  if (err.status === 401) return false;
  return isInsufficientScope(err);
}

function journalStore() {
  return localStorage.getItem(DRIVE_STORE_KEY) || "";
}

function verifyFile(id) {
  return driveApi(
    "https://www.googleapis.com/drive/v3/files/" +
      encodeURIComponent(id) +
      "?fields=id,trashed",
  ).then(function (data) {
    if (!data || !data.id || data.trashed) throw new Error("gone");
    return data.id;
  });
}

function createFolder(name) {
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
}

function ensureFolder(name) {
  const cached = localStorage.getItem(DRIVE_FOLDER_KEY);
  const afterCache = cached
    ? verifyFile(cached).catch(function () {
        localStorage.removeItem(DRIVE_FOLDER_KEY);
        return null;
      })
    : Promise.resolve(null);
  return afterCache.then(function (id) {
    if (id) return id;
    const q = encodeURIComponent(
      "name='" +
        name +
        "' and mimeType='application/vnd.google-apps.folder' and trashed=false",
    );
    return driveApi(
      "https://www.googleapis.com/drive/v3/files?q=" +
        q +
        "&fields=files(id,name)&pageSize=10&spaces=drive",
    )
      .then(function (data) {
        const hit = ((data && data.files) || []).find(function (f) {
          return f && f.id;
        });
        if (hit) {
          localStorage.setItem(DRIVE_FOLDER_KEY, hit.id);
          return hit.id;
        }
        return createFolder(name);
      })
      .catch(function (err) {
        if (isInsufficientScope(err)) throw err;
        return createFolder(name);
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
    .catch(function (err) {
      if (isSheetsUnavailable(err) || isInsufficientScope(err)) throw err;
      return writeSheetHeaders(id);
    });
}

function ensureSheet(name, headers, folderId) {
  const cached = localStorage.getItem(DRIVE_SHEET_KEY);
  const afterCache = cached
    ? ensureSheetHeaders(cached).catch(function (err) {
        localStorage.removeItem(DRIVE_SHEET_KEY);
        throw err;
      })
    : Promise.resolve(null);
  return afterCache.then(function (id) {
    if (id) return id;
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
  });
}

function uploadJsonFile(folderId, payload, fileId) {
  const body = JSON.stringify(payload == null ? {} : payload);
  if (fileId) {
    return driveApi(
      "https://www.googleapis.com/upload/drive/v3/files/" +
        encodeURIComponent(fileId) +
        "?uploadType=media",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body,
      },
    ).then(function () {
      localStorage.setItem(DRIVE_JSON_KEY, fileId);
      return fileId;
    });
  }
  const meta = {
    name: DRIVE_JSON_NAME,
    parents: [folderId],
    mimeType: "application/json",
  };
  const boundary = "arkjson" + Date.now();
  const mixed =
    "--" +
    boundary +
    "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(meta) +
    "\r\n--" +
    boundary +
    "\r\nContent-Type: application/json\r\n\r\n" +
    body +
    "\r\n--" +
    boundary +
    "--";
  return driveApi(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/related; boundary=" + boundary,
      },
      body: mixed,
    },
  ).then(function (created) {
    localStorage.setItem(DRIVE_JSON_KEY, created.id);
    return created.id;
  });
}

function parseJsonJournal(text) {
  if (!String(text || "").trim()) return {};
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return {};
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    return {};
  return parsed;
}

function loadJsonJournal() {
  const id = localStorage.getItem(DRIVE_JSON_KEY);
  if (!id) return Promise.resolve({});
  return driveApi(
    "https://www.googleapis.com/drive/v3/files/" +
      encodeURIComponent(id) +
      "?alt=media",
  ).then(function (data) {
    if (data && typeof data === "object" && !Array.isArray(data)) return data;
    return parseJsonJournal(typeof data === "string" ? data : "");
  });
}

function saveJsonJournal(data) {
  const folderId = localStorage.getItem(DRIVE_FOLDER_KEY);
  const fileId = localStorage.getItem(DRIVE_JSON_KEY) || "";
  if (!folderId) return Promise.reject(new Error("folder"));
  return uploadJsonFile(folderId, data, fileId);
}

function ensureJsonJournal(folderId) {
  const cached = localStorage.getItem(DRIVE_JSON_KEY);
  const afterCache = cached
    ? verifyFile(cached).catch(function () {
        localStorage.removeItem(DRIVE_JSON_KEY);
        return null;
      })
    : Promise.resolve(null);
  return afterCache.then(function (id) {
    if (id) return id;
    const q = encodeURIComponent(
      "name='" +
        DRIVE_JSON_NAME +
        "' and '" +
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
        localStorage.setItem(DRIVE_JSON_KEY, hit.id);
        return hit.id;
      }
      return uploadJsonFile(folderId, {}, "");
    });
  });
}

function useJsonStore(folderId) {
  localStorage.setItem(DRIVE_STORE_KEY, "json");
  return ensureJsonJournal(folderId).then(function (jsonId) {
    return { folderId: folderId, jsonId: jsonId };
  });
}

function ensureDriveJournal() {
  return ensureFolder(DRIVE_FOLDER_NAME).then(function (folderId) {
    if (journalStore() === "json") return useJsonStore(folderId);
    return ensureSheet(DRIVE_SHEET_NAME, DRIVE_SHEET_HEADERS, folderId)
      .then(function (sheetId) {
        localStorage.setItem(DRIVE_STORE_KEY, "sheet");
        return { folderId: folderId, sheetId: sheetId };
      })
      .catch(function () {
        return useJsonStore(folderId);
      });
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

function appendJsonEntry(row) {
  return loadJsonJournal().then(function (data) {
    const ts = row[0] || new Date().toISOString();
    const period = String(row[1] || "").toLowerCase();
    const text = row[2] || "";
    const media = row[3] || "";
    const d = ts ? new Date(ts) : null;
    const date =
      d && !isNaN(d.getTime()) ? todayKey(d) : String(ts).slice(0, 10);
    const slot = periodToSlot(period);
    data[date] = data[date] || { checks: {}, notes: {}, media: {}, updatedAt: ts };
    if (String(text).trim()) data[date].notes[slot] = text;
    if (media) {
      data[date].media = data[date].media || {};
      data[date].media[slot] = media;
    }
    data[date].updatedAt = ts;
    return saveJsonJournal(data);
  });
}

function appendEntry(row) {
  if (journalStore() === "json") return appendJsonEntry(row);
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
  ).catch(function (err) {
    if (!isSheetsUnavailable(err) && !isInsufficientScope(err)) throw err;
    const folderId = localStorage.getItem(DRIVE_FOLDER_KEY);
    if (!folderId) throw err;
    return useJsonStore(folderId).then(function () {
      return appendJsonEntry(row);
    });
  });
}

function listJsonEntries() {
  return loadJsonJournal().then(function (data) {
    const rows = [];
    Object.keys(data || {}).forEach(function (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      const notes = (data[date] && data[date].notes) || {};
      const media = (data[date] && data[date].media) || {};
      const updated = (data[date] && data[date].updatedAt) || date;
      ["morning", "day", "night"].forEach(function (slot) {
        if (!notes[slot] && !media[slot]) return;
        rows.push([
          updated,
          paneToPeriod(slot),
          notes[slot] || "",
          media[slot] || "",
          "",
        ]);
      });
    });
    return rows;
  });
}

function listEntries() {
  if (journalStore() === "json") return listJsonEntries();
  const id = localStorage.getItem(DRIVE_SHEET_KEY);
  if (!id) return Promise.resolve([]);
  return driveApi(
    "https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/A2:E",
  )
    .then(function (data) {
      return (data && data.values) || [];
    })
    .catch(function (err) {
      if (!isSheetsUnavailable(err) && !isInsufficientScope(err)) throw err;
      const folderId = localStorage.getItem(DRIVE_FOLDER_KEY);
      if (!folderId) throw err;
      return useJsonStore(folderId).then(function () {
        return listJsonEntries();
      });
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
  if (journalStore() === "json") {
    return loadJsonJournal().then(function (remote) {
      const merged = mergeJournals(loadJournal(), remote || {});
      saveJournalSilent(merged);
      localStorage.setItem(DRIVE_SYNC_KEY, new Date().toISOString());
      if (typeof bindJournalRefresh === "function") bindJournalRefresh();
      if (typeof renderLog === "function") renderLog();
      return merged;
    });
  }
  return listEntries().then(function (rows) {
    const merged = cacheEntries(rows);
    if (typeof bindJournalRefresh === "function") bindJournalRefresh();
    if (typeof renderLog === "function") renderLog();
    return merged;
  });
}

const LOCAL_MIGRATED_KEY = "noah-drive-local-migrated-v1";

function appendNotesMap(data) {
  if (journalStore() === "json") {
    return loadJsonJournal().then(function (remote) {
      const merged = mergeJournals(remote || {}, data || {});
      return saveJsonJournal(merged);
    });
  }
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
