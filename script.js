/* =========================================================
   ملف الوظائف الرئيسي للموقع
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. القائمة المتنقلة (Mobile Nav) ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // إغلاق القائمة عند الضغط على أي رابط
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- 2. تمييز الرابط النشط في التنقل عند التمرير ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 110;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', highlightActiveLink);

  /* ---------- 3. زر العودة للأعلى ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 4. حركات الظهور عند التمرير (Scroll Reveal) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 5. العدادات المتحركة (Animated Counters) ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statNums.forEach(num => counterObserver.observe(num));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  /* ---------- 6. سلايدر آراء المستفيدين ---------- */
  const testiTrack = document.getElementById('testiTrack');
  const testiDotsWrap = document.getElementById('testiDots');
  const testiCards = testiTrack ? testiTrack.querySelectorAll('.testi-card') : [];
  let currentTesti = 0;
  let testiInterval;

  if (testiTrack && testiCards.length) {
    // إنشاء النقاط
    testiCards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTesti(i));
      testiDotsWrap.appendChild(dot);
    });

    function goToTesti(index) {
      currentTesti = index;
      // بما أن الاتجاه RTL، نستخدم نسبة موجبة للانتقال
      testiTrack.style.transform = `translateX(${index * 100}%)`;
      testiDotsWrap.querySelectorAll('span').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    function nextTesti() {
      currentTesti = (currentTesti + 1) % testiCards.length;
      goToTesti(currentTesti);
    }

    testiInterval = setInterval(nextTesti, 5000);

    // إيقاف التحريك التلقائي عند تفاعل المستخدم مع النقاط
    testiDotsWrap.addEventListener('click', () => {
      clearInterval(testiInterval);
      testiInterval = setInterval(nextTesti, 5000);
    });
  }

  /* ---------- 7. التحقق من صحة النماذج (Form Validation) ---------- */

  function showError(input, message) {
    const group = input.closest('.form-group');
    group.classList.add('error');
    const errorEl = group.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    group.classList.remove('error');
    const errorEl = group.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = '';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9+\s-]{8,15}$/.test(value);
  }

  function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

    fields.forEach(field => {
      clearError(field);
      const value = field.value.trim();

      if (!value) {
        showError(field, 'هذا الحقل مطلوب');
        isValid = false;
        return;
      }
      if (field.type === 'email' && !isValidEmail(value)) {
        showError(field, 'يرجى إدخال بريد إلكتروني صحيح');
        isValid = false;
        return;
      }
      if (field.type === 'tel' && !isValidPhone(value)) {
        showError(field, 'يرجى إدخال رقم هاتف صحيح');
        isValid = false;
        return;
      }
    });

    return isValid;
  }

  /* ---------- 8. نموذج حجز الجلسات ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(bookingForm)) {
        // هنا يمكن استبدال هذا الجزء بطلب fetch فعلي إلى Web3Forms أو EmailJS
        bookingSuccess.classList.add('show');
        bookingForm.reset();
        setTimeout(() => bookingSuccess.classList.remove('show'), 5000);
      }
    });

    // إزالة رسالة الخطأ أثناء الكتابة
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });
  }

  /* ---------- 9. نموذج تواصل معنا ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(contactForm)) {
        /* =========================================================
           لربط النموذج بخدمة Web3Forms، استبدلي هذا الجزء بـ:

           fetch('https://api.web3forms.com/submit', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               access_key: 'YOUR_ACCESS_KEY_HERE',
               name: contactForm.name.value,
               email: contactForm.email.value,
               subject: contactForm.subject.value,
               message: contactForm.message.value
             })
           });

           أو لربطه بـ EmailJS، استخدمي:
           emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm, 'YOUR_USER_ID');
        ========================================================= */
        contactSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => contactSuccess.classList.remove('show'), 5000);
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => clearError(field));
    });
  }

  /* ---------- 10. التمرير السلس لجميع الروابط الداخلية ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 78;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- 11. خلفية شريط التنقل عند التمرير ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 6px 20px rgba(21,34,56,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

});
console.log(`⚠ Security Warning ⚠

    Don't copy any code you don't understand.
    
    Malicious code might:
    • Steal accounts and data
    • Hijack sessions
    • Send requests without your knowledge
    • Plant harmful files or scripts
    
    Read the code before running it.
    Think before you paste.
    
    © 19/06/2026 KIN_PROJECTS. All rights reserved.`)
    /* ============================================================
   Web3Forms Integration — Booking & Contact Forms
   Access Key: 4d7e9e81-99d4-4665-98b6-68c2617d5ea2
   ============================================================ */

const WEB3FORMS_KEY = "4d7e9e81-99d4-4665-98b6-68c2617d5ea2";

/* ── Helpers ── */
function showError(input, msg) {
  const span = input.closest(".form-group").querySelector(".error-msg");
  if (span) span.textContent = msg;
  input.classList.add("input-error");
}

function clearErrors(form) {
  form.querySelectorAll(".error-msg").forEach(s => (s.textContent = ""));
  form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach(field => {
    if (!field.value.trim()) {
      showError(field, "هذا الحقل مطلوب");
      valid = false;
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      showError(field, "البريد الإلكتروني غير صحيح");
      valid = false;
    } else if (field.type === "tel" && !/^[0-9+\s\-]{7,15}$/.test(field.value)) {
      showError(field, "رقم الهاتف غير صحيح");
      valid = false;
    }
  });
  return valid;
}

async function submitToWeb3Forms(form, successId, subjectPrefix) {
  clearErrors(form);
  if (!validateForm(form)) return;

  const btn = form.querySelector("button[type='submit']");
  const successMsg = document.getElementById(successId);

  // Disable button & show loading state
  btn.disabled = true;
  btn.textContent = "جارٍ الإرسال...";

  // Collect form data
  const data = new FormData(form);
  data.append("access_key", WEB3FORMS_KEY);
  data.append("subject", `${subjectPrefix} — ${data.get("name") || ""}`);
  data.append("from_name", "موقع هنو كوتش");

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: data,
    });
    const json = await res.json();

    if (json.success) {
      form.reset();
      if (successMsg) {
        successMsg.style.display = "block";
        setTimeout(() => (successMsg.style.display = "none"), 6000);
      }
    } else {
      alert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
      console.error("Web3Forms error:", json);
    }
  } catch (err) {
    alert("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.");
    console.error("Network error:", err);
  } finally {
    btn.disabled = false;
    btn.textContent = btn.dataset.label || "إرسال";
  }
}

/* ── Booking Form ── */
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  // Save original button label
  const btn = bookingForm.querySelector("button[type='submit']");
  if (btn) btn.dataset.label = btn.textContent;

  bookingForm.addEventListener("submit", e => {
    e.preventDefault();
    submitToWeb3Forms(bookingForm, "bookingSuccess", "طلب حجز جلسة");
  });
}

/* ── Contact Form ── */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const btn = contactForm.querySelector("button[type='submit']");
  if (btn) btn.dataset.label = btn.textContent;

  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    submitToWeb3Forms(contactForm, "contactSuccess", "استفسار من الموقع");
  });
}
