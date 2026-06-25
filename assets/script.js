document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('gallerySlider');
  const slides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlideIndex = 0;

  function updateSliderPosition() {
    // Shifts the track left by 100% multiplied by the current slide index
    slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Optional: Maintain active classes for accessibility or styling hooks
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  // Next Button click logic
  nextBtn.addEventListener('click', () => {
    if (currentSlideIndex >= slides.length - 1) {
      currentSlideIndex = 0; // Infinite loop back to the first slide
    } else {
      currentSlideIndex++;
    }
    updateSliderPosition();
  });

  // Previous Button click logic
  prevBtn.addEventListener('click', () => {
    if (currentSlideIndex <= 0) {
      currentSlideIndex = slides.length - 1; // Infinite loop back to the last slide
    } else {
      currentSlideIndex--;
    }
    updateSliderPosition();
  });
});
 (function(){
    const fab = document.getElementById('waFab');
    const toggle = document.getElementById('waToggle');
    const backdrop = document.getElementById('waFabBackdrop');
    const setOpen = o => { fab.classList.toggle('open', o); toggle.setAttribute('aria-expanded', o); };
    toggle.addEventListener('click', () => setOpen(!fab.classList.contains('open')));
    backdrop.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => { if(e.key === 'Escape') setOpen(false); });
  })();

   function initSlider(config) {
    const slider = document.getElementById(config.sliderId);
    if (!slider) return;

    const dotsContainer = document.getElementById(config.dotsId);
    const prevBtn = document.getElementById(config.prevId);
    const nextBtn = document.getElementById(config.nextId);
    const counter = document.getElementById(config.counterId);
    const container = slider.closest('.gallery-slider-container');
    const perSlideDesktop = config.perSlide || 4;
    const itemSelector = config.itemSelector || '.gallery-item';
    const gridClass = config.gridClass || 'gallery-grid';

    const allItems = Array.from(slider.querySelectorAll(itemSelector));
    let index = 0, autoTimer = null, slides, dots;
    const AUTO_DELAY = 5000;
    const mobileQuery = window.matchMedia('(max-width: 600px)');

    function buildSlides() {
      const perSlide = mobileQuery.matches ? 1 : perSlideDesktop;
      slider.innerHTML = '';
      for (let i = 0; i < allItems.length; i += perSlide) {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        const grid = document.createElement('div');
        grid.className = gridClass;
        allItems.slice(i, i + perSlide).forEach(item => grid.appendChild(item.cloneNode(true)));
        slide.appendChild(grid);
        slider.appendChild(slide);
      }
      index = 0;
      buildDots();
      goTo(0);

      const single = slider.querySelectorAll('.gallery-slide').length <= 1;
      prevBtn.style.display = single ? 'none' : 'flex';
      nextBtn.style.display = single ? 'none' : 'flex';
      dotsContainer.style.display = single ? 'none' : '';
      if (counter) counter.style.display = single ? 'none' : '';
      stopAuto();
      if (!single && config.autoplay !== false) startAuto();
    }

    function buildDots() {
      slides = slider.querySelectorAll('.gallery-slide');
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
      });
      dots = dotsContainer.querySelectorAll('.gallery-dot');
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slider.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, n) => s.classList.toggle('active', n === index));
      dots.forEach((d, n) => d.classList.toggle('active', n === index));
      if (counter) counter.textContent = (index + 1) + ' / ' + slides.length;
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function startAuto() { if (config.autoplay !== false) autoTimer = setInterval(next, AUTO_DELAY); }
    function stopAuto() { clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', () => { if (slides.length > 1) startAuto(); });

    let startX = 0, isDragging = false;
    function onStart(x) { startX = x; isDragging = true; stopAuto(); }
    function onEnd(x) {
      if (!isDragging) return;
      isDragging = false;
      const diff = x - startX;
      if (diff < -50) next();
      else if (diff > 50) prev();
      if (slides.length > 1) startAuto();
    }
    slider.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
    slider.addEventListener('touchend', e => onEnd(e.changedTouches[0].clientX), { passive: true });
    slider.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX); });
    window.addEventListener('mouseup', e => onEnd(e.clientX));

    mobileQuery.addEventListener('change', buildSlides);
    buildSlides();
  }

  // Gallery — Smile Design
  initSlider({ sliderId: 'gallerySlider', dotsId: 'galleryDots', counterId: 'galleryCounter', prevId: 'prevBtn', nextId: 'nextBtn' });

  // Gallery — Dental Implants
  initSlider({ sliderId: 'implantSlider', dotsId: 'implantDots', counterId: 'implantCounter', prevId: 'implantPrevBtn', nextId: 'implantNextBtn' });

  // Team — Dentists
  initSlider({ sliderId: 'dentistSlider', dotsId: 'dentistDots', counterId: 'dentistCounter', prevId: 'dentistPrevBtn', nextId: 'dentistNextBtn', itemSelector: '.team-card', gridClass: 'team-grid', autoplay: false });

  // Team — Specialists
  initSlider({ sliderId: 'specialistSlider', dotsId: 'specialistDots', counterId: 'specialistCounter', prevId: 'specialistPrevBtn', nextId: 'specialistNextBtn', itemSelector: '.team-card', gridClass: 'team-grid', autoplay: false });

  initSlider({ sliderId: 'testimonialSlider', dotsId: 'testimonialDots', counterId: 'testimonialCounter', prevId: 'testimonialPrevBtn', nextId: 'testimonialNextBtn', itemSelector: '.testimonial-card', gridClass: 'testimonials-grid', perSlide: 2 });
  // Goals
  initSlider({ sliderId: 'goalsSlider', dotsId: 'goalsDots', counterId: 'goalsCounter', prevId: 'goalsPrevBtn', nextId: 'goalsNextBtn', itemSelector: '.goal-card', gridClass: 'goals-grid', perSlide: 1 });


(function () {
  const form = document.getElementById('contactForm');
  const messageLabel = document.getElementById('messageLabel');
  const treatmentSelect = form.querySelector('[name="treatment"]');
  const messageField = form.querySelector('[name="message"]');

  // Toggle the message label when "Other Inquiry" is chosen
  treatmentSelect.addEventListener('change', function () {
    if (this.value === 'Other Inquiry') {
      messageLabel.textContent = 'Tell us more (required)';
    } else {
      messageLabel.textContent = 'Tell us more (optional)';
    }
  });

  function looksLikeRealText(str, minWords) {
    const t = str.trim();
    if (t.length < 3) return false;
    // reject single repeated char like "aaaa" or random "asdf" with no vowel
    if (!/[aeiouAEIOU]/.test(t)) return false;
    const words = t.split(/\s+/).filter(Boolean);
    return words.length >= (minWords || 1);
  }

  function validate() {
    const name      = form.name.value.trim();
    const phone     = form.phone.value.trim();
    const treatment = form.treatment.value;
    const clinic    = form.clinic.value;
    const message   = form.message.value.trim();

    if (!name)                         return 'Please enter your full name.';
    if (!looksLikeRealText(name, 1))   return 'Please enter a valid name.';
    if (name.length < 2)               return 'Your name seems too short.';

    if (!phone)                        return 'Please enter your phone number.';
    // digits, spaces, dashes, +, () allowed — but must contain enough digits
    const digits = phone.replace(/\D/g, '');
    if (!/^[0-9+()\-\s]+$/.test(phone)) return 'Phone number can only contain numbers.';
    if (digits.length < 9 || digits.length > 12) return 'Please enter a valid phone number.';

    if (!treatment)                    return 'Please select a treatment.';
    if (!clinic)                       return 'Please select a preferred clinic.';

    // Message required only for "Other Inquiry"
    if (treatment === 'Other Inquiry') {
      if (!message)                    return 'Please describe your inquiry in the message field.';
      if (!looksLikeRealText(message, 2)) return 'Please describe your inquiry in a bit more detail.';
    }

    return null; // all good
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const error = validate();
    if (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Please check the form',
        text: error,
        confirmButtonColor: '#009688'
      });
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';

    try {
      const res = await fetch('send-mail.php', { method: 'POST', body: new FormData(form) });
      const data = await res.json();

      if (data.success) {
        // Small toast top-right on success
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Enquiry sent successfully',
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true
        });
        form.reset();
        messageLabel.textContent = 'Tell us more (optional)';
      } else {
        // Big modal on failure
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: data.error || 'Your enquiry could not be sent. Please call us instead.',
          confirmButtonColor: '#009688'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Network error',
        text: 'Please check your connection and try again, or call us directly.',
        confirmButtonColor: '#009688'
      });
    } 
    finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
})();

document.getElementById('year').textContent = new Date().getFullYear();
