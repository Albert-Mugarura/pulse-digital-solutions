(function () {
  'use strict';

  var TITLES = [
    'Web Development',
    'Mobile App Development',
    'AI & Machine Learning',
    'UI/UX Design',
    'IT Support for Businesses'
  ];

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, 400);
  });

  /* Fallback: hide preloader after 3s no matter what */
  setTimeout(function () {
    if (preloader) preloader.classList.add('hidden');
  }, 3000);

  /* ---------- Typewriter ---------- */
  var typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    var titleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function type() {
      var current = TITLES[titleIndex];
      typewriterEl.textContent = current.substring(0, charIndex);

      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
        setTimeout(type, 70);
      } else {
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          titleIndex = (titleIndex + 1) % TITLES.length;
        }
        setTimeout(type, 35);
      }
    }

    setTimeout(type, 700);
  }

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById('navbar');
  function onScrollNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScrollNavbar, { passive: true });
  onScrollNavbar();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  function closeMobileNav() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Skill bars animation ---------- */
  var barFills = document.querySelectorAll('.bar-fill');
  var barObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var level = entry.target.getAttribute('data-level');
          entry.target.style.width = level + '%';
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  barFills.forEach(function (bar) {
    barObserver.observe(bar);
  });

  /* ---------- Stats counter ---------- */
  var stats = document.querySelectorAll('.stat-num');
  var statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10) || 0;
          var duration = 1200;
          var start = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(step);
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  stats.forEach(function (stat) {
    statObserver.observe(stat);
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (form) {
    var fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      subject: document.getElementById('subject'),
      message: document.getElementById('message')
    };

    function setStatus(message, type) {
      formStatus.textContent = message;
      formStatus.className = 'form-status' + (type ? ' ' + type : '');
    }

    function validate() {
      var valid = true;
      Object.keys(fields).forEach(function (key) {
        var field = fields[key];
        field.classList.remove('error');
        var value = field.value.trim();

        if (!value) {
          field.classList.add('error');
          valid = false;
        } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          field.classList.add('error');
          valid = false;
        }
      });
      return valid;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!validate()) {
        setStatus('Please fill in all fields with valid information.', 'error');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setStatus('', '');

      var payload = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        subject: fields.subject.value.trim(),
        message: fields.message.value.trim()
      };

      fetch('https://formsubmit.co/ajax/mugaruralbert@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          return response.json();
        })
        .then(function (data) {
          if (data && (data.success === 'true' || data.success === true)) {
            setStatus('Message sent successfully! We will get back to you soon.', 'success');
            form.reset();
          } else if (data && data.message) {
            setStatus(data.message, 'error');
          } else {
            throw new Error('Unexpected response');
          }
        })
        .catch(function () {
          var mailto = 'mailto:mugaruralbert@gmail.com?subject=' +
            encodeURIComponent(payload.subject) +
            '&body=' + encodeURIComponent(payload.message + '\n\nFrom: ' + payload.name + ' (' + payload.email + ')');
          window.location.href = mailto;
          setStatus('Opened your email app to finish sending.', 'success');
        })
        .finally(function () {
          btn.textContent = originalText;
          btn.disabled = false;
        });
    });

    fields.name.addEventListener('input', function () { fields.name.classList.remove('error'); });
    fields.email.addEventListener('input', function () { fields.email.classList.remove('error'); });
    fields.subject.addEventListener('input', function () { fields.subject.classList.remove('error'); });
    fields.message.addEventListener('input', function () { fields.message.classList.remove('error'); });
  }

  /* ---------- Tilt effect on project cards ---------- */
  var cards = document.querySelectorAll('.project-card');

  if (window.matchMedia('(hover: hover)').matches) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + x * 6 + 'deg) rotateX(' + y * -6 + 'deg) translateY(-6px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
})();
