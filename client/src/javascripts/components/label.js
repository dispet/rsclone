function createLabel(text, title){
  const labelTitle = title || '';
  const label = document.createElement('span');
  label.className = 'label';
  label.setAttribute('title', labelTitle);
  return `<span class="label" title="${title}">${text}</span>`
}
export default createLabel;
