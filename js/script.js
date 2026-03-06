/* ================= EMAILJS INIT ================= */

(function () {
    emailjs.init("lFDGTojGi4gndClgW");
})();

document.addEventListener("DOMContentLoaded", function () {

"use strict";

/* ================= LOADING SCREEN ================= */

const loadingScreen = document.getElementById("loading-screen");

window.addEventListener("load", function () {
    if (loadingScreen) {
        setTimeout(function () {
            loadingScreen.classList.add("hidden");
            document.body.classList.add("loaded");
        }, 2000);
    }
});


/* ================= SCROLL PROGRESS ================= */

const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {

    if (!scrollProgress) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    scrollProgress.style.width = progress + "%";
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });


/* ================= NAVBAR SCROLL ================= */

const navbar = document.getElementById("navbar");

function handleNavbarScroll() {

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });


/* ================= BACK TO TOP ================= */

const backToTop = document.getElementById("backToTop");

function toggleBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 500) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
}

window.addEventListener("scroll", toggleBackToTop, { passive: true });

if (backToTop) {
    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* ================= TOAST MESSAGE ================= */

const toast = document.getElementById("toast");

function showToast(message, type = "success") {

    if (!toast) return;

    const toastMessage = toast.querySelector(".toast-message");
    const toastIcon = toast.querySelector(".toast-icon");

    toastMessage.textContent = message;

    if (type === "success") {
        toastIcon.className = "toast-icon fas fa-check-circle";
        toastIcon.style.color = "#00ff88";
    } else {
        toastIcon.className = "toast-icon fas fa-exclamation-circle";
        toastIcon.style.color = "#ff4757";
    }

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}


/* ================= CONTACT FORM EMAILJS ================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

contactForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {

        showToast("Please fill all fields", "error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        showToast("Enter a valid email", "error");
        return;
    }

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Sending...";

    emailjs.send("service_6tdhyec", "template_sff1c6i", {

        name: name,
        email: email,
        subject: subject,
        message: message

    })

    .then(function (response) {

        console.log("EMAIL SENT:", response);

        showToast("Message sent successfully!");

        contactForm.reset();

    })

    .catch(function (error) {

        console.error("EMAILJS ERROR:", error);

        showToast("Failed to send message", "error");

    })

    .finally(function () {

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

    });

});

}


/* ================= SAFE SMOOTH SCROLL ================= */

document.querySelectorAll("a[href^='#']").forEach(function(anchor){

anchor.addEventListener("click",function(e){

const targetId = this.getAttribute("href");

if(targetId === "#") return;

const target = document.querySelector(targetId);

if(target){

e.preventDefault();

window.scrollTo({
top: target.offsetTop - 80,
behavior: "smooth"
});

}

});

});


/* ================= NETWORK STATUS ================= */

function updateNetworkStatus(){

if(!navigator.onLine){
showToast("You are offline","error");
}

}

window.addEventListener("online", function(){
showToast("Back online!");
});

window.addEventListener("offline", function(){
showToast("You are offline","error");
});

updateNetworkStatus();


/* ================= CONSOLE MESSAGE ================= */

console.log("%c👋 Hey there, curious developer!","font-size:20px;font-weight:bold;color:#00d9ff;");
console.log("%cWelcome to my portfolio!","color:#b0b0c0;");
console.log("%cFeel free to explore the code.","color:#00ff88;");
console.log("%c📧 Contact: rohanxett6@gmail.com","color:#6b6b7b;");
console.log("%c⭐ GitHub: https://github.com/RoyalRohan","color:#6b6b7b;");

console.log("✅ All scripts initialized successfully!");

});
