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
  let count = parseFloat(staffDropdown.value) || 0;
  let salary = parseFloat(annualSalaryInput.value.replace(/[^0-9.]/g, '')) || 0;

  const totalTraditional = count * salary * timeframe;

  const minSaved = totalTraditional * 0.20;
  const maxSaved = totalTraditional * 0.45;
  
  const baseSolutionCost = totalTraditional * 0.15; 

  traditionalcostDisplay.innerText = '$' + totalTraditional.toLocaleString();
  cost.innerText = '$' + baseSolutionCost.toLocaleString() + ' +'; 

  savings.innerText = '$' + minSaved.toLocaleString() + ' - $' + maxSaved.toLocaleString();
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

    fetch('https://formspree.io/f/mdawdqrp', {
      method: 'POST',
      body: JSON.stringify(leadData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
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