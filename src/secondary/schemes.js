'use strict';
let activeSchemeIndex = 0;

function saveSelected() {
  // Switch the active one at the top
  const originalScheme = colorSchemes[0];
  colorSchemes[0] = colorSchemes[activeSchemeIndex];
  colorSchemes[activeSchemeIndex] = originalScheme;
  storage.store('colorSchemes');
}

function removeSelected() {
  if (!confirm('Remove this scheme?')) return;
  colorSchemes.splice(activeSchemeIndex, 1);
  const schemeElement = byQSelect('#color-scheme-list > a.active');
  schemeElement.parentNode.removeChild(schemeElement);
  byId('color-scheme-list').children[0].classList.add('active');
  storage.store('colorSchemes');
}

function insertPreviewHTML(scheme) {
  const top = document.createElement('a');
  top.href = '#!';
  top.className = 'collection-item color';
  top.innerText = scheme.name;
  
  // Container for samples
  const div = document.createElement('div');
  div.className = 'row';
  top.appendChild(div);
  
  // Add scheme theme
  div.appendChild(createColorSampleElement(scheme.isDark ? 'black' : 'white'));
  // Add dark colors from darkest
  addSamples(name => name.startsWith('darken'), (a, b) => (b > a ? 1 : -1));
  // Add main color
  div.appendChild(createColorSampleElement(scheme.main));
  // Add light colors from darkest
  addSamples(name => name.startsWith('lighten'));
  // Add separator between the above and accent colors
  div.insertAdjacentHTML('beforeend', '<br style="line-height: 75px;">');
  // Add accent colors
  addSamples(name => name.startsWith('accent'));
  
  byId('color-scheme-list').appendChild(top);

  function addSamples(filterFunction, sortFunction) {
    Object.keys(scheme)
      .filter(filterFunction)
      .sort(sortFunction)
      .forEach(colorName => {
        div.appendChild(createColorSampleElement(scheme[colorName]));
      });
  }
  
  function createColorSampleElement(color) {
    const sample = document.createElement('div');
    sample.style = `background-color: ${color};`;
    sample.className = 'col s1 color-sample';
    return sample;
  }
}

function initSchemesEventListeners() {
  Array.from(byId('color-scheme-list').children).forEach((schemeElement, i, arr) => {
    if (i === 0) schemeElement.classList.add('active');
    schemeElement.addEventListener('click', event => {
      const actives = byQSelect('#color-scheme-list > a.active');
      if (actives) actives.classList.remove('active');
      schemeElement.classList.add('active');
      activeSchemeIndex = i;
    });
  });
}

module.exports = {
  saveSelected,
  removeSelected,
  insertPreviewHTML,
  initSchemesEventListeners
};
