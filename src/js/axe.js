(() => {

  const maybeViolationIDs = [
    "landmark-one-main",
    "page-has-heading-one",
    "region"
  ];

  function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function buildViolation(v) {
    let item = document.createElement('li');
    item.setAttribute('class',`Axe--violation--item Axe--violation--item--${v.impact}`);

    let title = document.createElement('h3');
    title.setAttribute('class','Axe--v-title');
    title.innerHTML = `<span class="Axe--v-title--impact">${v.impact}</span> ${v.description}`;
    item.appendChild(title);

    let additional = document.createElement('div');
    additional.setAttribute('class','Axe--v-additional');

    // let impact = document.createElement('p');
    // impact.setAttribute('class','Axe--v-helper Axe--v-helper--impact');
    // impact.innerHTML = `<span class="Axe--v-helper-title Axe--v-helper-title--${v.impact}">Impact:</span> <span class="Axe--v-helper-result">${v.impact}</span>`;
    // additional.appendChild(impact);

    let helpTitle = document.createElement('p');
    helpTitle.setAttribute('class','Axe--v-help-title');
    helpTitle.textContent = 'Issue Description:';
    additional.appendChild(helpTitle);

    let help = document.createElement('p');
    help.setAttribute('class','Axe--v-help');
    help.innerHTML = `<a href="${v.helpUrl}" target="blank" rel="noopener nofollow">${v.help}</a>`;
    additional.appendChild(help);

    let idRef = document.createElement('p');
    idRef.setAttribute('class','Axe--v-helper Axe--v-helper--idRef');
    idRef.innerHTML = `<span class="Axe--v-helper-title Axe--v-helper-title--${v.id}">Violation ID:</span> <span class="Axe--v-helper-result"><code>${v.id}</code></span>`;
    additional.appendChild(idRef);

    item.appendChild(additional);

    let nodesContainer = document.createElement('div');
    nodesContainer.setAttribute('class','Axe--v-nodes-container');

    let nodesTitle = document.createElement('p');
    nodesTitle.setAttribute('class','Axe--v-nodes-title');
    nodesTitle.setAttribute('id','axe-v-nodes-title');
    nodesTitle.textContent = `Relevant Nodes (${v.nodes.length}):`;
    nodesContainer.appendChild(nodesTitle);

    let nodesList = document.createElement('ul');
    nodesList.setAttribute('class','Axe--v-nodes-list');
    nodesList.setAttribute('aria-labelledby','axe-v-nodes-title');

    v.nodes.forEach(n => {
      let nodeItem = document.createElement('li');
      nodeItem.setAttribute('class','Axe--v-node-item');

      let nodeHTML = document.createElement('div');
      nodeHTML.setAttribute('class','Axe--v-notice Axe--v-notice--node-html');
      nodeHTML.innerHTML = `<span class="Axe--v-notice--title">Source:</span> <span class="Axe--v-notice--result"><pre><code>${escapeHtml(n.html)}</code></pre></span>`;
      nodeItem.appendChild(nodeHTML);

      let nodeTarget = document.createElement('div');
      nodeTarget.setAttribute('class','Axe--v-notice Axe--v-notice--node-target');
      nodeTarget.innerHTML = `<span class="Axe--v-notice--title">Target:</span> <span class="Axe--v-notice--result"><pre><code>${n.target}</code></pre></span>`;
      nodeItem.appendChild(nodeTarget);

      let summary = document.createElement('p');
      summary.setAttribute('class','Axe--v-notice Axe--v-notice--node-summary');
      summary.innerHTML = `<span class="Axe--v-notice--title">Failure Summary:</span> <span class="Axe--v-notice--result Axe--v-notice--result--failure"><p>${n.failureSummary.replace(/\n/g, "</p><p>")}</p></span>`;
      nodeItem.appendChild(summary);


      nodesList.appendChild(nodeItem);
    });

    nodesContainer.appendChild(nodesList);

    item.appendChild(nodesContainer);

    return item;
  }

  window.addEventListener('previewLoaded', function() {
    const iframe = document.querySelector('.Preview-resizer iframe');
    const iframeWin = iframe.contentWindow || iframe;
    const iframeDoc = iframe.contentDocument || iframeWin.document;

    let axeScript = iframeDoc.createElement("script");
    axeScript.type  = "text/javascript";
    axeScript.src   = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.1.3/axe.min.js";

    axeScript.onload = function() {
      let runAxeScript = iframeDoc.createElement("script");
      runAxeScript.append(`
          axe.run((err, results) => {
            // console.log(results);
            window.parent.postMessage({axeResults: results});
          });
      `);
      iframeDoc.documentElement.appendChild(runAxeScript);
    }

    iframeDoc.documentElement.appendChild(axeScript);

    window.addEventListener('message', function(event) {

      if ( event.data.axeResults ) {
        const res = event.data.axeResults;
        const vSpan = document.getElementById('axe-core-version');
        vSpan.textContent = `v${res.testEngine.version}`;

        console.log(res);
        if ( res.violations.length ) {
          const violationsCount     = document.getElementById('violations-count');
          const hardViolationList   = document.getElementById('axe-violations-list-hard');
          const hardViolationGroup  = document.getElementById('axe-violations-hard-group');
          const noHardVGroup        = document.getElementById('axe-violations-hard-group-none');
          const maybeViolationList  = document.getElementById('axe-violations-list-maybe');
          const maybeViolationGroup = document.getElementById('axe-violations-maybe-group');
          const knownViolationsEl   = document.getElementById('axe-known-violations');
          const knownViolationList  = document.getElementById('axe-violations-list-known');
          const knownViolationGroup = document.getElementById('axe-violations-known-group');
          let hardV                 = [];
          let maybeV                = [];
          let knownVSrc             = [];
          let knownV                = [];

          violationsCount.textContent = `(${res.violations.length} violations)`;

          hardViolationGroup.classList.remove('show-group');
          hardViolationList.innerHTML = '';

          noHardVGroup.classList.remove('show-group');

          maybeViolationGroup.classList.remove('show-group');
          maybeViolationList.innerHTML = '';

          if ( knownViolationsEl ) {
            knownViolationGroup.classList.remove('show-group');
            knownViolationList.innerHTML = '';
            const kvData = knownViolationsEl.getAttribute('data-known');
            knownVSrc = kvData.split(',');
          }

          res.violations.forEach(v => {
            if ( knownVSrc.includes(v.id) ) {
              knownV.push(v);
            } else if ( maybeViolationIDs.includes(v.id) ) {
              maybeV.push(v);
            } else {
              hardV.push(v);
            }
          });

          if ( hardV.length ) {
            hardViolationGroup.classList.add('show-group');

            hardV.forEach(v => {
              hardViolationList.appendChild(buildViolation(v));
            });

            const hardCount = document.getElementById('axe-hard-violations-title-count');
            hardCount.textContent = `(${hardV.length})`;

          } else {
            noHardVGroup.classList.add('show-group');
          }

          if ( knownV.length ) {

            knownViolationGroup.classList.add('show-group');

            knownV.forEach(v => {
              knownViolationList.appendChild(buildViolation(v));
            });

            const knownCount = document.getElementById('axe-known-violations-title-count');
            knownCount.textContent = `(${knownV.length})`;

          }

          if ( maybeV.length ) {

            maybeViolationGroup.classList.add('show-group');

            maybeV.forEach(v => {
              maybeViolationList.appendChild(buildViolation(v));
            });

            const maybeCount = document.getElementById('axe-maybe-violations-title-count');
            maybeCount.textContent = `(${maybeV.length})`;
          }
        }
      }
    }, false);

  });

  document.addEventListener('click', e => {
    console.log(e.target.className);
    if (e.target.classList.contains('js-toggle-violations')) {
      const btn = e.target;
      const panel = document.getElementById(btn.getAttribute('aria-controls'));

      if (btn.classList.contains('is-active')) {
        btn.focus();
        btn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        btn.classList.remove('is-active');
        panel.classList.remove('is-active');
      } else {
        btn.focus();
        btn.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        btn.classList.add('is-active');
        panel.classList.add('is-active');
      }
    }
  });
})();
