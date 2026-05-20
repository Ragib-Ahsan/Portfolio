var SPREADSHEET_ID = '101o7m6NkU3o1mhmKwtw8KBYSNcC90x3hZEC1GKtGRcQ';
var API_KEY = 'AIzaSyATU9JBZ7V8-Pz1GtMkETvTC3wenl-nn5c';

var GID_TO_NAME = {
  '613394614': 'Products',
  '674646137': 'Projects',
  '1552066230': 'Insights',
  '2087264122': 'DeepDiveContent'
};

const SHEET_GIDS = {
  products: '613394614',
  projects: '674646137',
  insights: '1552066230',
  deepDive: '2087264122'
};

async function fetchTab(gid) {
  var sheetName = GID_TO_NAME[String(gid)];
  if (!sheetName) throw new Error('Unknown sheet gid: ' + gid);
  var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + '/values/' + encodeURIComponent(sheetName) + '?key=' + API_KEY;
  var res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch sheet tab "' + sheetName + '": ' + res.status);
  var data = await res.json();
  var rows = data.values || [];
  if (rows.length < 2) return [];
  var headers = rows[0];
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i] || ''; });
    return obj;
  });
}

function parseList(str) {
  return (str || '').split('|').map(function(s) { return s.trim(); }).filter(Boolean);
}

function getInitials(str) {
  if (!str) return '??';
  var words = str.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return words.map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  return str.slice(0, 2).toUpperCase();
}

function sortByOrder(arr) {
  return arr.slice().sort(function(a, b) { return (parseInt(a.order) || 99) - (parseInt(b.order) || 99); });
}
