// ============ GRIT - Dictate Workout -> Supabase + Sheet ============
// 1. In Apps Script (script.google.com) > Project Settings, add Script Properties:
//    SUPABASE_URL = https://YOURPROJECT.supabase.co   (no trailing slash)
//    SUPABASE_KEY = your Supabase anon key (same one in GRIT Coach > Supabase)
//    SHEET_ID     = the ID of a Google Sheet to log workouts (optional, create one)
// 2. Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone
//    (or Anyone within your org). Copy the /exec URL into your iPhone Shortcut.
// 3. The Shortcut POSTs JSON (see GRIT-Dictation-Shortcut.md).
// 4. The site reads grit_training + grit_athletes from Supabase on load,
//    so the dictated workout appears on that athlete's training + discipline pages.

const TITLES = [
  'Dynamic Stretch | Warm Up',
  'Core',
  'Main Lift',
  'Acceleration and Speed',
  'Coach | Trainer Progress Notes',
];

function supabase(path, method, payload) {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty('SUPABASE_URL') + '/rest/v1/' + path;
  const res = UrlFetchApp.fetch(url, {
    method: method || 'get',
    contentType: 'application/json',
    payload: payload ? JSON.stringify(payload) : undefined,
    headers: {
      apikey: props.getProperty('SUPABASE_KEY'),
      Authorization: 'Bearer ' + props.getProperty('SUPABASE_KEY'),
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    muteHttpExceptions: true,
  });
  return { code: res.getResponseCode(), body: res.getContentText() };
}

function findAthleteId(name) {
  const r = supabase('grit_athletes?select=id,name&limit=100', 'get');
  if (r.code !== 200) throw new Error('Supabase athletes lookup failed: ' + r.body);
  const rows = JSON.parse(r.body);
  const want = String(name || '').trim().toLowerCase();
  const hit = rows.find((a) => String(a.name || '').trim().toLowerCase() === want);
  if (!hit) throw new Error('No athlete named "' + name + '" found in Supabase. Add them in GRIT first, then dictate.');
  return hit.id;
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const athleteId = findAthleteId(d.athlete);

    // --- Keep the existing Coach Notes block (5th section) ---
    let coachNotes = '';
    const existing = supabase('grit_training?athlete_id=eq.' + encodeURIComponent(athleteId) + '&select=sections', 'get');
    if (existing.code === 200) {
      const rows = JSON.parse(existing.body);
      if (rows.length && rows[0].sections && rows[0].sections[4]) coachNotes = rows[0].sections[4].desc || '';
    }
    const sections = [
      { mins: TITLES[0], sub: '', desc: d.dynamic || '', media: null },
      { mins: TITLES[1], sub: '', desc: d.core || '', media: null },
      { mins: TITLES[2], sub: '', desc: d.mainLift || '', media: null },
      { mins: TITLES[3], sub: '', desc: d.acceleration || '', media: null },
      { mins: TITLES[4], sub: '', desc: coachNotes, media: null },
    ];
    const tr = supabase('grit_training?on_conflict=athlete_id', 'post', {
      athlete_id: athleteId, sections: sections, updated_at: new Date().toISOString(),
    });
    if (tr.code >= 300) throw new Error('grit_training upsert failed: ' + tr.body);

    // --- Mindset / Homework / Remember live on the athlete record ---
    const ar = supabase('grit_athletes?id=eq.' + encodeURIComponent(athleteId), 'patch', {
      mindset: d.mindset || '', homework: d.homework || '', remember: d.remember || '',
      session: d.session || '', updated_at: new Date().toISOString(),
    });
    if (ar.code >= 300) throw new Error('grit_athletes patch failed: ' + ar.body);

    // --- Optional Sheet log (one row per dictation) ---
    try {
      const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
      if (sheetId) {
        const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
        sheet.appendRow([new Date(), d.athlete, d.session || '', d.dynamic || '', d.core || '', d.mainLift || '', d.acceleration || '', d.mindset || '', d.homework || '', d.remember || '']);
      }
    } catch (err) { /* Sheet is a bonus - don't fail the sync if it errors */ }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, athleteId: athleteId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
