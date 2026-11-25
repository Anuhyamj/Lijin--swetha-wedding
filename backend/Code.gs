/* Lijin & Swetha — private Google Sheet RSVP service. Run setup() once. */
const SETTINGS = {
  sheetId: '1-e-sOEdc0_ygY8-ieLOpwLlG45iszFtJEL3B6RkLiVg',
  sheetName: 'Lijin & Swetha | Wedding RSVP 2026', tab: 'RSVPs', timezone: 'Asia/Kolkata',
  minFillMs: 2500, maxPerMinute: 40,
  headers: ['Submitted (IST)', 'Updated', 'Response ID', 'Name', 'Status', 'Wedding', 'Reception', 'Guests', 'Message'],
  statuses: ['Joyfully Accepts', 'Not Sure Yet', 'Sending Love From Afar']
};
function setup() {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const p = PropertiesService.getScriptProperties();
    if (!p.getProperty('RSVP_SECRET')) p.setProperty('RSVP_SECRET', Utilities.getUuid()+Utilities.getUuid()+Utilities.getUuid());
    const id = p.getProperty('RSVP_SHEET_ID') || SETTINGS.sheetId;
    const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create(SETTINGS.sheetName);
    ss.setSpreadsheetTimeZone(SETTINGS.timezone);
    let sheet = ss.getSheetByName(SETTINGS.tab); if (!sheet) sheet = ss.insertSheet(SETTINGS.tab);
    if (!sheet.getLastRow()) sheet.appendRow(SETTINGS.headers);
    const header = sheet.getRange(1,1,1,9).getValues()[0];
    if (header.join('|') !== SETTINGS.headers.join('|')) throw new Error('The RSVPs column headings do not match.');
    sheet.setFrozenRows(1); p.setProperty('RSVP_SHEET_ID', ss.getId());
    return {ok:true, sheet:ss.getId(), tab:SETTINGS.tab};
  } finally { lock.releaseLock(); }
}
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function doGet() {
  const p = PropertiesService.getScriptProperties(); let ready = false;
  try { const ss=SpreadsheetApp.openById(p.getProperty('RSVP_SHEET_ID')); ready=!!ss.getSheetByName(SETTINGS.tab)&&!!p.getProperty('RSVP_SECRET'); } catch (_) {}
  return json_({ok:true,service:'rsvp',secret:!!p.getProperty('RSVP_SECRET'),sheet:p.getProperty('RSVP_SHEET_ID')?'configured':'',tab:SETTINGS.tab,ready:ready});
}
function token_(id,secret) {return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(id,secret)).replace(/=+$/,'');}
function equal_(a,b) {if(typeof a!=='string'||typeof b!=='string')return false;let n=a.length^b.length;for(let i=0;i<b.length;i++)n|=(a.charCodeAt(i)||0)^b.charCodeAt(i);return n===0;}
function clean_(value,max) {const s=String(value||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);return /^[=+\-@]/.test(s)?"'"+s:s;}
function plain_(value) {return String(value||'').replace(/^'(?=[=+\-@])/,'');}
function valid_(d) {
  if(typeof d.name!=='string'||!d.name.trim()||d.name.length>100||typeof d.message!=='string'||d.message.length>1000||!SETTINGS.statuses.includes(d.status)||!Number.isInteger(d.guests)||d.guests<1||d.guests>20||typeof d.wedding!=='boolean'||typeof d.reception!=='boolean')return false;
  if(d.status===SETTINGS.statuses[2]){d.wedding=false;d.reception=false;}else if(!d.wedding&&!d.reception)return false;
  return true;
}
function doPost(e) {
  let lock=null;
  try {
    const raw=e&&e.postData&&e.postData.contents;if(!raw||raw.length>10000)return json_({ok:false,error:'rejected'});
    let d;try{d=JSON.parse(raw);}catch(_){return json_({ok:false,error:'rejected'});}
    if(!d||!['submit','update','get'].includes(d.action)||d.website)return json_({ok:false,error:'rejected'});
    const write=d.action!=='get';
    if(write&&(!Number.isFinite(d.elapsedMs)||d.elapsedMs<SETTINGS.minFillMs))return json_({ok:false,error:'too_fast'});
    const p=PropertiesService.getScriptProperties(),secret=p.getProperty('RSVP_SECRET'),sheetId=p.getProperty('RSVP_SHEET_ID');
    if(!secret||!sheetId)return json_({ok:false,error:'failed'});
    if(d.action!=='submit'&&(!/^[a-f0-9-]{36}$/i.test(d.id||'')||typeof d.token!=='string'||d.token.length>100||!equal_(d.token,token_(d.id,secret))))return json_({ok:false,error:'forbidden'});
    if(write&&!valid_(d))return json_({ok:false,error:'rejected'});
    lock=LockService.getScriptLock();if(!lock.tryLock(5000)){lock=null;return json_({ok:false,error:'busy'});}
    if(write){const now=Date.now();let times;try{times=JSON.parse(p.getProperty('RSVP_SUBMISSIONS')||'[]');}catch(_){times=[];}times=times.filter(t=>t>now-60000);if(times.length>=SETTINGS.maxPerMinute)return json_({ok:false,error:'busy'});times.push(now);p.setProperty('RSVP_SUBMISSIONS',JSON.stringify(times));}
    const sheet=SpreadsheetApp.openById(sheetId).getSheetByName(SETTINGS.tab);if(!sheet)return json_({ok:false,error:'failed'});
    let id=d.id,row=0;
    if(d.action!=='submit') {if(sheet.getLastRow()>1){const match=sheet.getRange(2,3,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).useRegularExpression(false).findNext();if(match)row=match.getRow();}if(!row)return json_({ok:false,error:'not_found'});}
    if(d.action==='get'){const r=sheet.getRange(row,1,1,9).getValues()[0];return json_({ok:true,response:{name:plain_(r[3]),status:r[4],wedding:r[5]==='Yes',reception:r[6]==='Yes',guests:Number(r[7]),message:plain_(r[8])}});}
    const now=Utilities.formatDate(new Date(),SETTINGS.timezone,'yyyy-MM-dd HH:mm:ss');
    if(d.action==='submit')id=Utilities.getUuid();
    const values=[now,id,clean_(d.name,100),d.status,d.wedding?'Yes':'No',d.reception?'Yes':'No',d.guests,clean_(d.message,1000)];
    if(d.action==='submit')sheet.appendRow([now].concat(values));else sheet.getRange(row,2,1,8).setValues([values]);
    SpreadsheetApp.flush();return json_({ok:true,id:id,token:token_(id,secret)});
  } catch (_) {return json_({ok:false,error:'failed'});} finally {if(lock)lock.releaseLock();}
}
