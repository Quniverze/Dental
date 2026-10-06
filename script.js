/**
 * AURA DENTAL STUDIO — CORE ANIMATION & INTERACTION ENGINE
 * 
 * Features:
 * 1. Interactive 3D Canvas Tooth Simulation (Perspective rotation, ambient float, particles).
 * 2. Before/After Split Comparison Slider (Mouse, Touch, Keyboard, & Case-Switching).
 * 3. 3D Perspective Tilt Physics with Radial Mouse Spotlight on Treatment Cards.
 * 4. Animated Statistic Counter Tickers (IntersectionObserver triggered).
 * 5. Interactive Multi-Step Appointment Booking Wizard with Confetti Explosion.
 * 6. Interactive Tech & FAQ Accordions.
 * 7. Scroll-Driven Progress Bar & Dynamic Header State.
 * 8. Motion Reduction Toggle & Accessibility Handlers.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. MOTION REDUCTION TOGGLE
     -------------------------------------------------------------------------- */
  const motionToggleBtn = document.getElementById('motion-toggle');
  const motionStatusText = document.getElementById('motion-status-text');
  let isMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateMotionState = (reduced) => {
    isMotionReduced = reduced;
    document.body.classList.toggle('reduce-motion', reduced);
    if (motionStatusText) {
      motionStatusText.textContent = reduced ? 'Reduced' : 'Active';
    }
  };

  if (motionToggleBtn) {
    updateMotionState(isMotionReduced);
    motionToggleBtn.addEventListener('click', () => {
      updateMotionState(!isMotionReduced);
    });
  }

  /* --------------------------------------------------------------------------
     2. INTERACTIVE 3D LUXURY DENTAL SHOWCASE (HERO)
     -------------------------------------------------------------------------- */
  const heroShowcase = document.getElementById('hero-showcase');
  const showcaseGlare = document.getElementById('showcase-glare');
  const heroModeBtns = document.querySelectorAll('.hero-mode-btn');
  const layerSmile = document.getElementById('layer-smile');
  const layerAnatomy = document.getElementById('layer-anatomy');

  if (heroShowcase) {
    // Mode Switcher (Radiant Patient Smile vs 3D Tooth Anatomy)
    heroModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetMode = btn.getAttribute('data-hero-mode');
        
        // Update button states
        heroModeBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        // Crossfade layers
        if (targetMode === 'smile') {
          if (layerSmile) layerSmile.classList.add('is-active');
          if (layerAnatomy) layerAnatomy.classList.remove('is-active');
        } else {
          if (layerSmile) layerSmile.classList.remove('is-active');
          if (layerAnatomy) layerAnatomy.classList.add('is-active');
        }
      });
    });

    // 3D Perspective Tilt Physics & Glare Tracking
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isHoveringHero = false;
    let tiltAnimFrame = null;

    const updateTiltPhysics = () => {
      if (!isMotionReduced) {
        const spring = 0.085;
        currentTiltX += (targetTiltX - currentTiltX) * spring;
        currentTiltY += (targetTiltY - currentTiltY) * spring;

        heroShowcase.style.setProperty('--tilt-x', `${currentTiltX.toFixed(2)}deg`);
        heroShowcase.style.setProperty('--tilt-y', `${currentTiltY.toFixed(2)}deg`);
      }

      // Continue loop if still hovering or dampening back to zero
      if (isHoveringHero || Math.abs(currentTiltX) > 0.05 || Math.abs(currentTiltY) > 0.05) {
        tiltAnimFrame = requestAnimationFrame(updateTiltPhysics);
      } else {
        heroShowcase.style.setProperty('--tilt-x', '0deg');
        heroShowcase.style.setProperty('--tilt-y', '0deg');
        tiltAnimFrame = null;
      }
    };

    const handleHeroMouseMove = (e) => {
      if (isMotionReduced) return;
      const rect = heroShowcase.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX >= rect.left - 40 &&
        clientX <= rect.right + 40 &&
        clientY >= rect.top - 40 &&
        clientY <= rect.bottom + 40
      ) {
        isHoveringHero = true;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Calculate normalized offset [-1, 1]
        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        // Max tilt range: 12 degrees
        targetTiltY = normX * 12;
        targetTiltX = -normY * 12;

        // Update glare coordinates
        if (showcaseGlare) {
          const glarePercentX = (x / rect.width) * 100;
          const glarePercentY = (y / rect.height) * 100;
          showcaseGlare.style.setProperty('--glare-x', `${glarePercentX}%`);
          showcaseGlare.style.setProperty('--glare-y', `${glarePercentY}%`);
          showcaseGlare.style.setProperty('--glare-opacity', '0.65');
        }

        if (!tiltAnimFrame) {
          tiltAnimFrame = requestAnimationFrame(updateTiltPhysics);
        }
      } else if (isHoveringHero) {
        handleHeroMouseLeave();
      }
    };

    const handleHeroMouseLeave = () => {
      isHoveringHero = false;
      targetTiltX = 0;
      targetTiltY = 0;
      if (showcaseGlare) {
        showcaseGlare.style.setProperty('--glare-opacity', '0');
      }
      if (!tiltAnimFrame) {
        tiltAnimFrame = requestAnimationFrame(updateTiltPhysics);
      }
    };

    window.addEventListener('mousemove', handleHeroMouseMove, { passive: true });
    heroShowcase.addEventListener('mouseleave', handleHeroMouseLeave);

    // Touch support for mobile devices
    heroShowcase.addEventListener('touchmove', (e) => {
      if (isMotionReduced || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = heroShowcase.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;
      targetTiltY = normX * 8;
      targetTiltX = -normY * 8;
      isHoveringHero = true;
      if (!tiltAnimFrame) {
        tiltAnimFrame = requestAnimationFrame(updateTiltPhysics);
      }
    }, { passive: true });

    heroShowcase.addEventListener('touchend', () => {
      handleHeroMouseLeave();
    });

    // Hotspot mobile tap toggles
    const hotspotTriggers = heroShowcase.querySelectorAll('.hotspot-trigger');
    hotspotTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentHotspot = trigger.closest('.hotspot');
        const isActive = parentHotspot.classList.contains('is-open');
        
        // Close all other hotspots
        heroShowcase.querySelectorAll('.hotspot').forEach(h => h.classList.remove('is-open'));

        if (!isActive) {
          parentHotspot.classList.add('is-open');
        }
      });
    });

    // Close open hotspots when clicking elsewhere
    document.addEventListener('click', () => {
      heroShowcase.querySelectorAll('.hotspot').forEach(h => h.classList.remove('is-open'));
    });
  }

  /* --------------------------------------------------------------------------
     3. BEFORE & AFTER SMILE MAKEOVER SLIDER
     -------------------------------------------------------------------------- */
  const sliderContainer = document.getElementById('smile-slider');
  const afterLayer = document.getElementById('after-layer');
  const sliderDivider = document.getElementById('slider-divider');
  const sliderHandle = sliderContainer ? sliderContainer.querySelector('.slider-handle') : null;

  let isDraggingSlider = false;

  const setSliderPosition = (percentage) => {
    const clamped = Math.max(0, Math.min(100, percentage));
    if (afterLayer) {
      afterLayer.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
    }
    if (sliderDivider) {
      sliderDivider.style.left = `${clamped}%`;
    }
    if (sliderHandle) {
      sliderHandle.setAttribute('aria-valuenow', Math.round(clamped));
    }
  };

  const handleSliderMove = (clientX) => {
    if (!sliderContainer) return;
    const rect = sliderContainer.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  if (sliderContainer) {
    sliderContainer.addEventListener('mousedown', (e) => {
      isDraggingSlider = true;
      handleSliderMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingSlider) return;
      handleSliderMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDraggingSlider = false;
    });

    // Touch support
    sliderContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDraggingSlider = true;
        handleSliderMove(e.touches[0].clientX);
      }
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isDraggingSlider || e.touches.length === 0) return;
      handleSliderMove(e.touches[0].clientX);
    }, { passive: true });

    sliderContainer.addEventListener('touchend', () => {
      isDraggingSlider = false;
    });

    // Keyboard Accessibility for Slider Handle
    if (sliderHandle) {
      sliderHandle.addEventListener('keydown', (e) => {
        let current = parseFloat(sliderHandle.getAttribute('aria-valuenow')) || 50;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          setSliderPosition(current - 5);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          setSliderPosition(current + 5);
        }
      });
    }
  }

  // Case Tabs Switcher
  const caseTabs = document.querySelectorAll('.case-tab');
  const caseProc = document.getElementById('case-proc');
  const caseTime = document.getElementById('case-time');
  const caseDoc = document.getElementById('case-doc');

  const casesData = {
    case1: {
      proc: '8 Upper Hand-Layered E-Max Veneers',
      time: '2 Appointments over 5 Days',
      doc: 'Dr. Julian Vance, DDS, FAACD'
    },
    case2: {
      proc: 'Invisalign Diamond Full Arch & Laser Gingivectomy',
      time: '6 Months Total Aligner Therapy',
      doc: 'Dr. Marcus Ray, MS'
    },
    case3: {
      proc: 'All-on-4 Immediate Zirconia Implant Bridge',
      time: 'Same-Day Provisional & 1 Follow-up',
      doc: 'Dr. Sophia Lin, DMD, MD'
    }
  };

  caseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      caseTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const caseKey = tab.getAttribute('data-case');
      if (casesData[caseKey]) {
        if (caseProc) caseProc.textContent = casesData[caseKey].proc;
        if (caseTime) caseTime.textContent = casesData[caseKey].time;
        if (caseDoc) caseDoc.textContent = casesData[caseKey].doc;
      }

      // Smooth bounce slider to 50%
      setSliderPosition(50);
    });
  });

  /* --------------------------------------------------------------------------
     4. 3D PERSPECTIVE TILT PHYSICS ON TREATMENT CARDS
     -------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isMotionReduced) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate tilt angles [-10deg, 10deg]
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -9;
      const tiltY = ((x - centerX) / centerX) * 9;

      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  /* --------------------------------------------------------------------------
     5. STATISTIC COUNTER TICKERS
     -------------------------------------------------------------------------- */
  const counterEls = document.querySelectorAll('.counter-value');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-decimal') === '1';
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeVal = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeVal * target;

      if (isDecimal) {
        el.textContent = currentVal.toFixed(1);
      } else {
        el.textContent = Math.floor(currentVal).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterEls.forEach(el => counterObserver.observe(el));

  /* --------------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (VIEWPORT DETECTOR)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     7. MULTI-STEP APPOINTMENT BOOKING WIZARD
     -------------------------------------------------------------------------- */
  const wizardForm = document.getElementById('appointment-form');
  const panels = document.querySelectorAll('.wizard-panel');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');

  const step1Estimate = document.getElementById('step1-estimate');
  const sumService = document.getElementById('sum-service');
  const sumDoctor = document.getElementById('sum-doctor');
  const sumTime = document.getElementById('sum-time');
  const bookingDateInput = document.getElementById('booking-date');
  const successScreen = document.getElementById('booking-success');
  const resCodeEl = document.getElementById('res-code');
  const resetBookingBtn = document.getElementById('btn-reset-booking');

  // Set default minimum date to tomorrow
  if (bookingDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookingDateInput.min = tomorrow.toISOString().split('T')[0];
    bookingDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Update estimate on service change
  const serviceRadios = document.querySelectorAll('input[name="selected_service"]');
  serviceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const price = radio.getAttribute('data-price');
      if (step1Estimate) step1Estimate.textContent = price;
    });
  });

  const goToStep = (stepNumber) => {
    panels.forEach(p => p.classList.remove('is-active'));
    stepIndicators.forEach((ind, index) => {
      ind.classList.toggle('is-active', index + 1 === stepNumber);
      ind.classList.toggle('is-done', index + 1 < stepNumber);
    });

    const activePanel = document.getElementById(`wizard-step-step-${stepNumber}`) || document.getElementById(`wizard-step-${stepNumber}`);
    if (activePanel) {
      activePanel.classList.add('is-active');
    }

    // Update Summary in Step 4
    if (stepNumber === 4) {
      const checkedService = document.querySelector('input[name="selected_service"]:checked');
      const checkedDoctor = document.querySelector('input[name="selected_doctor"]:checked');
      const checkedTime = document.querySelector('input[name="selected_time"]:checked');

      if (sumService && checkedService) sumService.textContent = checkedService.value;
      if (sumDoctor && checkedDoctor) sumDoctor.textContent = checkedDoctor.value;
      if (sumTime && checkedTime && bookingDateInput) {
        sumTime.textContent = `${bookingDateInput.value} at ${checkedTime.value}`;
      }
    }
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.getAttribute('data-next-to'), 10);
      goToStep(targetStep);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.getAttribute('data-prev-to'), 10);
      goToStep(targetStep);
    });
  });

  // Direct Treatment Select Buttons on cards
  const cardSelectBtns = document.querySelectorAll('[data-select-treatment]');
  cardSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const treatmentCode = btn.getAttribute('data-select-treatment');
      let targetValue = 'Porcelain Veneers';
      if (treatmentCode === 'invisalign') targetValue = 'Invisalign Aligners';
      if (treatmentCode === 'implants') targetValue = '3D Dental Implant';
      if (treatmentCode === 'whitening') targetValue = 'Laser Whitening Spa';

      const matchRadio = document.querySelector(`input[name="selected_service"][value*="${targetValue}"]`);
      if (matchRadio) {
        matchRadio.checked = true;
        matchRadio.dispatchEvent(new Event('change'));
      }

      // Scroll to booking and jump to step 1
      goToStep(1);
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Direct Doctor Select Links
  const doctorLinks = document.querySelectorAll('[data-doctor]');
  doctorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const docName = link.getAttribute('data-doctor');
      const docRadio = document.querySelector(`input[name="selected_doctor"][value*="${docName}"]`);
      if (docRadio) {
        docRadio.checked = true;
      }
      goToStep(2);
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Form Submission Validation & Confetti Trigger
  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('patient-name');
      const phoneInput = document.getElementById('patient-phone');
      const emailInput = document.getElementById('patient-email');

      // Clear previous error states
      [nameInput, phoneInput, emailInput].forEach(inp => {
        if (inp && inp.parentElement) {
          inp.parentElement.classList.remove('has-error');
        }
      });

      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (!phoneInput || phoneInput.value.trim().length < 7) {
        if (phoneInput) phoneInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        if (emailInput) emailInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (!isValid) return;

      // Generate random Reservation Code
      const randomCode = `AURA-${Math.floor(1000 + Math.random() * 9000)}-BH`;
      if (resCodeEl) resCodeEl.textContent = randomCode;

      // Show success screen
      wizardForm.style.display = 'none';
      if (successScreen) {
        successScreen.hidden = false;
      }

      // Launch Celebratory Confetti Burst!
      launchConfetti();
    });
  }

  if (resetBookingBtn) {
    resetBookingBtn.addEventListener('click', () => {
      if (wizardForm) {
        wizardForm.reset();
        wizardForm.style.display = 'block';
      }
      if (successScreen) {
        successScreen.hidden = true;
      }
      goToStep(1);
    });
  }

  /* --------------------------------------------------------------------------
     8. CONFETTI CELEBRATION ENGINE
     -------------------------------------------------------------------------- */
  function launchConfetti() {
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;

    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#2DD4BF', '#06B6D4', '#C5A880', '#FFFFFF', '#14B8A6', '#F59E0B'];
    const count = 120;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height / 2 + 50,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frames = 0;
    function renderConfetti() {
      frames++;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (frames < 140) {
        requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    renderConfetti();
  }

  /* --------------------------------------------------------------------------
     9. ACCORDIONS (TECH & FAQ)
     -------------------------------------------------------------------------- */
  // Tech items
  const techItems = document.querySelectorAll('.tech-item');
  techItems.forEach(item => {
    const btn = item.querySelector('.tech-header');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        techItems.forEach(i => {
          i.classList.remove('is-open');
          const header = i.querySelector('.tech-header');
          if (header) header.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // FAQ items
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        faqItems.forEach(i => {
          i.classList.remove('is-open');
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     10. SCROLL PROGRESS FALLBACK & DYNAMIC HEADER BLUR
     -------------------------------------------------------------------------- */
  const header = document.getElementById('studio-header');
  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header Blur & Height Toggle
    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 40);
    }

    // Scroll Progress bar fallback for browsers without CSS animation-timeline
    if (scrollProgress && !CSS.supports('animation-timeline', 'scroll()')) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? scrollY / scrollable : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
    }
  }, { passive: true });

  /* --------------------------------------------------------------------------
     11. MOBILE MENU DRAWER TOGGLE
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const studioNav = document.getElementById('studio-nav');

  if (mobileMenuBtn && studioNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isCurrentlyExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const willExpand = !isCurrentlyExpanded;
      mobileMenuBtn.setAttribute('aria-expanded', String(willExpand));
      studioNav.classList.toggle('is-open', willExpand);
    });

    // Close on navigation link click
    studioNav.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          studioNav.classList.remove('is-open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (
        window.innerWidth < 992 &&
        studioNav.classList.contains('is-open') &&
        !studioNav.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        studioNav.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------------------------
     12. AUTO-UPDATE COPYRIGHT YEAR
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
