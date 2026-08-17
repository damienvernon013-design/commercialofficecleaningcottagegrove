// Submits the quote request form to /api/contact via fetch instead of a
// full page navigation, and shows inline success/error status.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var status = document.getElementById('quote-form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    function showStatus(message, isError) {
      if (!status) return;
      status.textContent = message;
      status.style.display = 'block';
      status.style.color = isError ? '#c0392b' : '#1e7e34';
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());

      if (!data.name || !data.phone) {
        showStatus('Please provide your name and phone number.', true);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      showStatus('', false);
      status.style.display = 'none';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (response) {
          return response.json().then(function (body) {
            return { ok: response.ok, body: body };
          });
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            showStatus("Thanks — your request is in. We'll call during business hours to confirm details.", false);
          } else {
            showStatus(result.body && result.body.error ? result.body.error : 'Something went wrong. Please call us instead.', true);
          }
        })
        .catch(function () {
          showStatus('Something went wrong. Please call us instead.', true);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send My Quote Request';
          }
        });
    });
  });
})();
