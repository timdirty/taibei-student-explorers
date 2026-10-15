const printButton = document.getElementById('print-guide');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}
