// Captures utm_source/medium/campaign/term/content from the landing URL,
// persists them in sessionStorage for the visit, and fills any hidden
// utm_source field on quote forms so leads carry attribution to the CRM.
(function () {
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var STORAGE_KEY = 'qm_utm';

  function readStored() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function captureFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    var hasAny = false;
    KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        found[key] = value.slice(0, 255);
        hasAny = true;
      }
    });
    if (hasAny) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      } catch (e) {
        /* sessionStorage unavailable (private mode, etc.) — non-fatal */
      }
      return found;
    }
    return readStored();
  }

  function buildCombinedSource(data) {
    if (!data.utm_source) return '';
    var parts = [data.utm_source];
    if (data.utm_medium) parts.push(data.utm_medium);
    if (data.utm_campaign) parts.push(data.utm_campaign);
    return parts.join(' / ');
  }

  var data = captureFromUrl();
  var combined = buildCombinedSource(data);

  document.addEventListener('DOMContentLoaded', function () {
    var fields = document.querySelectorAll('input[name="utm_source"]');
    fields.forEach(function (field) {
      field.value = combined;
    });
  });
})();
