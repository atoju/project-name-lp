// JavaScript for Tokyo Medical & Care Supplies Cooperative Landing Page

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-links a, .nav-cta a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const triggerBottom = (window.innerHeight / 5) * 4.5;
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('active');
      }
    });
  };

  // Initial trigger and bind scroll event
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Interactive Calculator ---
  const levelButtons = document.querySelectorAll('#calc-level-group .calc-btn-option');
  const slider = document.getElementById('calc-slider-range');
  const sliderVal = document.getElementById('calc-slider-val');
  
  // Output elements
  const outReferral = document.getElementById('out-referral');
  const outInitialCosts = document.getElementById('out-initial-costs');
  const outMonthlyUnit = document.getElementById('out-monthly-unit');
  const outTotalInitial = document.getElementById('out-total-initial');
  const outTotalMonthly = document.getElementById('out-total-monthly');

  // Calculator State
  let selectedLevel = 'N3';
  let personCount = 1;

  // Fee Rules
  const placementFees = {
    N3: 200000,
    N2: 250000,
    N1: 300000
  };
  const flightAndOrientationPerPerson = 120000; // Airport pickup (50k-70k) + Flight ticket (50k-80k) average

  const calculateFees = () => {
    // 1. Placement fee per person based on N level
    const unitPlacementFee = placementFees[selectedLevel];
    const totalPlacementFee = unitPlacementFee * personCount;

    // 2. Flight + Orientation per person
    const totalInitialRealCosts = flightAndOrientationPerPerson * personCount;

    // 3. Monthly Support fee (N人数 5人以上 25,000円、5名以下 30,000円)
    const unitMonthlySupportFee = personCount >= 5 ? 25000 : 30000;
    const totalMonthlySupportFee = unitMonthlySupportFee * personCount;

    // 4. Totals
    const totalInitial = totalPlacementFee + totalInitialRealCosts;

    // Format utility
    const formatYen = (num) => new Intl.NumberFormat('ja-JP').format(num) + '円';

    // Update DOM
    outReferral.textContent = `${formatYen(totalPlacementFee)} （${formatYen(unitPlacementFee)} × ${personCount}名）`;
    outInitialCosts.textContent = `${formatYen(totalInitialRealCosts)} （航空券・入国手続等）`;
    outMonthlyUnit.textContent = `${formatYen(unitMonthlySupportFee)} / 名`;
    outTotalInitial.innerHTML = `${formatYen(totalInitial)}<span>（税別）</span>`;
    outTotalMonthly.innerHTML = `${formatYen(totalMonthlySupportFee)}<span>/月（税別）</span>`;
  };

  // Event Listeners for Level selection
  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      levelButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLevel = btn.getAttribute('data-level');
      calculateFees();
    });
  });

  // Event Listener for Slider count
  if (slider && sliderVal) {
    slider.addEventListener('input', (e) => {
      personCount = parseInt(e.target.value);
      sliderVal.innerHTML = `${personCount}<span>名</span>`;
      calculateFees();
    });
  }

  // Initial Calculation Run
  calculateFees();

  // --- Contact Form Submission & Simulation ---
  const inquiryForm = document.getElementById('lp-inquiry-form');
  const successMessage = document.getElementById('success-message');

  if (inquiryForm && successMessage) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation check
      const companyName = document.getElementById('company-name').value.trim();
      const contactName = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const consent = document.getElementById('privacy-consent').checked;

      if (!companyName || !contactName || !email || !phone || !consent) {
        alert('必須項目をすべて入力し、個人情報保護方針に同意してください。');
        return;
      }

      // Show sending state
      const submitBtn = document.getElementById('submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '送信中 <i class="fa-solid fa-spinner fa-spin"></i>';

      // Simulate API network request (1.5 seconds)
      setTimeout(() => {
        // Hide form and show success message
        inquiryForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    });
  }
});
