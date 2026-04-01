const staffDropdown = document.getElementById('numberdropdown');
const annualSalaryInput = document.getElementById('annualsalary');
const traditionalcostDisplay = document.getElementById('traditionalcost');
const savings = document.getElementById('savings');
const timeframe = 4;
const cost = document.getElementById('bespokesolutionbase');

const calculator = document.getElementById('calculator');
const openBtn = document.getElementById('open-calc-btn');
const closeBtn = document.getElementById('close-calc-btn');

openBtn.addEventListener('click', function () {
  calculator.style.display = 'block';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      calculator.classList.add('open');
    });
  });
  updateMath();
});

closeBtn.addEventListener('click', function () {
  calculator.classList.remove('open');
  document.body.style.overflow = '';
  calculator.addEventListener('transitionend', function handler() {
    calculator.style.display = 'none';
    calculator.removeEventListener('transitionend', handler);
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && calculator.classList.contains('open')) {
    closeBtn.click();
  }
});

function updateMath() {
  let totalStaff = parseFloat(staffDropdown.value) || 0;
  let avgHRSalary = parseFloat(annualSalaryInput.value.toString().replace(/[^0-9.]/g, '')) || 0;

  // 1. REALISTIC TRADITIONAL HR HEADCOUNT
  // Industry standard is roughly 1 HR professional per 50-75 employees.
  // We use totalStaff / 60 as a realistic middle ground.
  let virtualHRStaffCount = totalStaff / 60; 
  if (virtualHRStaffCount < 0.5) virtualHRStaffCount = 0.5;

  const totalTraditional = (virtualHRStaffCount * (avgHRSalary * 1.2)) * timeframe;

  // 3. RESSONATE FRACTIONAL PRICE ($38k per 100 employees per year)
  const fractionalCost = (totalStaff / 100) * 38000 * timeframe;
  
  const totalSaved = totalTraditional - fractionalCost;

  traditionalcostDisplay.innerText = '$' + Math.round(totalTraditional).toLocaleString();
  
  cost.innerText = 'Starting at $' + Math.round(fractionalCost).toLocaleString(); 

  savings.innerText = '$' + (totalSaved > 0 ? Math.round(totalSaved).toLocaleString() : "Contact for custom ROI");
}

staffDropdown.addEventListener('change', updateMath);
annualSalaryInput.addEventListener('input', updateMath);

const auditForm = document.getElementById('audit-form');
const nameinput = document.getElementById('name');
const emailinput = document.getElementById('email');

auditForm.addEventListener('submit', function (event) {
  event.preventDefault();
  SendtoAdmin();
});

function SendtoAdmin() {
  const namevalue = nameinput.value.trim();
  const emailvalue = emailinput.value.trim();

  nameinput.style.border = '';
  emailinput.style.border = '';

  let isFormValid = true;

  if (namevalue === '') {
    nameinput.style.border = '1px solid red';
    isFormValid = false;
  }

  if (emailvalue === '' || !emailvalue.includes('@')) {
    emailinput.style.border = '1px solid red';
    isFormValid = false;
  }

  if (isFormValid) {
    const leadData = {
      name: namevalue, 
      email: emailvalue,
      company_size: staffDropdown.value,
      traditional_spend_raw: traditionalcostDisplay.innerText.replace(/[^0-9.]/g, ''),
      value_range_estimate: savings.innerText.replace(/\$/g, ''),
      service_type: "Bespoke_4_Service_Min",
      status: "Unlocked"
    };

    fetch('https://hrcalculator.onrender.com/send-audit', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('audit-form').style.display = 'none';
        const revealSection = document.getElementById('reveal-section');
        revealSection.style.display = 'grid';
        setTimeout(() => {
          revealSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        alert('Submission failed. Please try again.');
      }
    })
  }
}