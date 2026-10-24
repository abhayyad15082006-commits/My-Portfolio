// Custom cursor: follows the pointer on desktop.
const cursor = document.querySelector(".cursor");

window.addEventListener("pointermove", (event) => {
  if (cursor) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }
});

document.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("pointerenter", () => cursor?.classList.add("big"));
  item.addEventListener("pointerleave", () => cursor?.classList.remove("big"));
});

// Reveal content as it enters the viewport.
const revealItems = document.querySelectorAll(
    ".reveal:not(.hero > .eyebrow):not(.hero-bottom)"
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

// Master Opening Sequence & ScrollTrigger setup
const preloader = document.querySelector(".preloader");
let sequenceStarted = false;

function runHeroAnimation(isScrollTrigger = false) {
    const hero = document.querySelector(".hero");
    if (!hero || !window.gsap) return;

    const subtitle = hero.querySelector(".eyebrow");
    const lines = hero.querySelectorAll(".title-line > span");
    const greenText = hero.querySelector(".hero-title em");
    const glow = hero.querySelector(".hero-orb");
    const bottom = hero.querySelector(".hero-bottom");

    // Make elements visible for GSAP
    gsap.set([subtitle, ...lines, greenText, glow, bottom], { visibility: "visible" });

    const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
            document.documentElement.classList.remove("gsap-ready");
        }
    });

    if (isScrollTrigger) {
        tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 })
          .fromTo(lines, { opacity: 0, y: "110%" }, { opacity: 1, y: "0%", duration: 0.7, stagger: 0.12 }, "-=0.2")
          .fromTo(glow, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.9 }, "-=0.5")
          .fromTo(greenText, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.6")
          .fromTo(bottom, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    } else {
        tl.to(subtitle, { opacity: 1, y: 0, duration: 0.4 }, 0)
          .to(lines, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.15 }, 0.1)
          .to(glow, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, 0.3)
          .to(greenText, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.7)
          .to(bottom, { opacity: 1, y: 0, duration: 0.5 }, 0.9);
    }
}

function startOpeningSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    if (preloader) {
        preloader.classList.add("hide");
        document.body.style.overflow = "";
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap) {
        document.documentElement.classList.remove("gsap-ready");
        return;
    }

    runHeroAnimation(false);

    gsap.registerPlugin(ScrollTrigger);
    const hero = document.querySelector(".hero");
    if (hero) {
        ScrollTrigger.create({
            trigger: hero,
            start: "top 70%",
            onEnterBack: () => {
                runHeroAnimation(true);
            }
        });
    }
}

// About Section ScrollTrigger Animation
function initAboutScrollAnimation() {
    const aboutSection = document.querySelector("#about");
    
    if (aboutSection && window.gsap && window.ScrollTrigger) {
        const aboutEyebrow = aboutSection.querySelector(".about-label .eyebrow");
        const aboutMark = aboutSection.querySelector(".about-mark");
        const aboutLines = aboutSection.querySelectorAll(".about-line > span");
        const aboutDesc = aboutSection.querySelector(".about-description");
        const aboutBtn = aboutSection.querySelector(".pill-link");

        gsap.set([aboutEyebrow, aboutMark, aboutDesc, aboutBtn], { opacity: 0, y: 30 });
        gsap.set(aboutLines, { opacity: 0, y: "110%" });

        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSection,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            defaults: { ease: "power3.out" }
        });

        aboutTl.to(aboutEyebrow, { opacity: 1, y: 0, duration: 0.5 })
                 .to(aboutMark, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
                 .to(aboutLines, { opacity: 1, y: "0%", duration: 0.8, stagger: 0.15 }, "-=0.4")
                 .to(aboutDesc, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
                 .to(aboutBtn, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    }
}

// Contact Section ScrollTrigger Animation
function initContactScrollAnimation() {
    const contactSection = document.querySelector("#contact");
    
    if (contactSection && window.gsap && window.ScrollTrigger) {
        const contactLines = contactSection.querySelectorAll(".contact-line > span");
        const contactEyebrow = contactSection.querySelector(".eyebrow");
        const contactEmail = contactSection.querySelector(".contact-email");

        gsap.set(contactEyebrow, { opacity: 0, y: 25 });
        gsap.set(contactLines, { opacity: 0, y: "110%" });
        gsap.set(contactEmail, { opacity: 0, y: 25 });

        const contactTl = gsap.timeline({
            scrollTrigger: {
                trigger: contactSection,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            defaults: { ease: "power3.out" }
        });

        contactTl.to(contactEyebrow, { opacity: 1, y: 0, duration: 0.5 })
                 .to(contactLines, { opacity: 1, y: "0%", duration: 0.85, stagger: 0.15 }, "-=0.25")
                 .to(contactEmail, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");
    }
}

// Initialization Handler
if (preloader) {
    document.body.style.overflow = "hidden";
    let fallbackTimer = setTimeout(startOpeningSequence, 2800);

    window.addEventListener("load", () => {
        clearTimeout(fallbackTimer);
        setTimeout(startOpeningSequence, 800);
    });
} else {
    document.addEventListener("DOMContentLoaded", () => {
        startOpeningSequence();
        initAboutScrollAnimation();
        initContactScrollAnimation();
    });
}

window.addEventListener("load", () => {
    initAboutScrollAnimation();
    initContactScrollAnimation();
});