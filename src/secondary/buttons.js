'use strict';
function createNewButton() {
  let id = prompt('Input a unique identifier for the button:');
  if (id === null) return;
  if (buttons[id] !== undefined && buttons[id] !== null) {
    alert('Identifier already exists.');
    return;
  }
  buttons[id] = {
    text: '',
    href: '',
    imagePath: '',
    hotkey: '',
    order: '',
    checked: false
  };
  setActiveButton(buttons[id], id);
  byId('buttons-list').insertAdjacentHTML('beforeend',
  `<li id="${id}">
    <a href="#!">${id}</a>
  </li>`
  );
}

function removeButton() {
  if (!confirm('Are you sure you want to delete this button?')) return;
  let id = byId('button-text').getAttribute('data-button-id');
  delete buttons[id];
  byId(id).parentNode.removeChild(byId(id));
  activateDefaultButton();
  storage.store('buttons');
}

function saveFocusedButton(id) {
  buttons[id] = {
    text: byId('button-text').value,
    href: byId('button-link').value,
    imagePath: byId('button-image').value,
    position: byId('button-position').value,
    hotkey: byId('button-hotkey').value.toUpperCase(),
    openInNew: Boolean(byId('button-replace-tab').checked)
  };
  storage.store('buttons');
}

function initDropdown() {
  let dropdown = byId('buttons-list');
  for (let id in buttons) {
    dropdown.insertAdjacentHTML('beforeend',
      `<li id="${id}">
        <a href="#!">${id}</a>
      </li>`
    );
    byId(id).addEventListener('click', event => setActiveButton(buttons[id], id));
  }
}

function setActiveButton(buttonData, id) {
  byId('button-name').innerText = id;
  byId('button-text').setAttribute('data-button-id', id);
  byId('button-text').value = buttonData.text;
  byId('button-link').value = buttonData.href;
  byId('button-image').value = buttonData.imagePath;
  byId('button-position').value = buttonData.position;
  byId('button-hotkey').value = buttonData.hotkey;
  byId('button-replace-tab').checked = buttonData.openInNew;
  Materialize.updateTextFields();
}

function activateDefaultButton() {
  let firstButtonId = Object.keys(buttons)[0];
  if (firstButtonId !== undefined) setActiveButton(buttons[firstButtonId], firstButtonId);
}

module.exports = {
  createNewButton,
  removeButton,
  initDropdown,
  setActiveButton,
  activateDefaultButton,
  saveFocusedButton
};