const STORAGE_KEY = 'taibei-student-guide-steps-v1';

function loadCompletedSteps(win) {
  try {
    const raw = win.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveCompletedSteps(win, state) {
  try {
    win.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or privacy mode errors.
  }
}

function initStudentGuide(doc, win) {
  const printButton = doc.getElementById('print-guide');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => win.print());
  }

  const completed = loadCompletedSteps(win);
  const workflows = doc.querySelectorAll('section.workflow');

  workflows.forEach(section => {
    const flowList = section.querySelector('ol.flow');
    if (!flowList) return;
    const steps = [...flowList.querySelectorAll('li.flow-step')];
    if (!steps.length) return;

    const progressBar = doc.createElement('div');
    progressBar.className = 'workflow-progress';
    progressBar.setAttribute('role', 'status');
    progressBar.setAttribute('aria-live', 'polite');

    const statusText = doc.createElement('span');
    const resetBtn = doc.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'workflow-reset-btn';
    resetBtn.textContent = '重設進度';

    progressBar.append(statusText, resetBtn);
    flowList.parentNode.insertBefore(progressBar, flowList);

    const checkboxes = [];

    const updateSectionProgress = () => {
      let doneCount = 0;
      steps.forEach((li, idx) => {
        const isDone = Boolean(completed[li.id]);
        if (isDone) doneCount += 1;
        li.classList.toggle('is-completed', isDone);
        if (checkboxes[idx]) checkboxes[idx].checked = isDone;
      });
      statusText.textContent = `✅ 已完成 ${doneCount} / ${steps.length} 步`;
      resetBtn.disabled = doneCount === 0;
    };

    steps.forEach(li => {
      const content = li.querySelector('.step-content');
      if (!content || !li.id) return;
      const label = doc.createElement('label');
      label.className = 'step-check-label';
      const checkbox = doc.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'step-checkbox';
      checkbox.dataset.stepId = li.id;
      checkbox.checked = Boolean(completed[li.id]);
      const span = doc.createElement('span');
      span.textContent = '已完成這一步';
      label.append(checkbox, span);
      content.append(label);
      checkboxes.push(checkbox);

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          completed[li.id] = true;
        } else {
          delete completed[li.id];
        }
        saveCompletedSteps(win, completed);
        updateSectionProgress();
      });
    });

    resetBtn.addEventListener('click', () => {
      steps.forEach(li => {
        if (li.id) delete completed[li.id];
      });
      saveCompletedSteps(win, completed);
      updateSectionProgress();
    });

    updateSectionProgress();
  });
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  initStudentGuide(document, window);
}
