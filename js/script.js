(function () {
    emailjs.init("lFDGTojGi4gndClgW");
})();

document.addEventListener("DOMContentLoaded", () => {
"use strict";

const loadingScreen = document.getElementById("loading-screen");

window.addEventListener("load", () => {
if (loadingScreen) {
setTimeout(() => {
loadingScreen.classList.add("hidden");
document.body.classList.add("loaded");
}, 2500);
}
});

const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
if (!scrollProgress) return;
const scrollTop = window.scrollY;
const docHeight = document.documentElement.scrollHeight - window.innerHeight;
const progress = (scrollTop / docHeight) * 100;
scrollProgress.style.width = progress + "%";
}

window.addEventListener("scroll", updateScrollProgress,{passive:true});

const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

function handleNavbarScroll(){
if(!navbar) return;
if(window.scrollY>50){navbar.classList.add("scrolled")}
else{navbar.classList.remove("scrolled")}
}

window.addEventListener("scroll",handleNavbarScroll,{passive:true});

if(navToggle){
navToggle.addEventListener("click",()=>{
navToggle.classList.toggle("active");
navMenu.classList.toggle("active");
document.body.classList.toggle("menu-open");
});
}

navLinks.forEach(link=>{
link.addEventListener("click",()=>{
navToggle?.classList.remove("active");
navMenu?.classList.remove("active");
document.body.classList.remove("menu-open");
});
});

const sections=document.querySelectorAll("section[id]");

function highlightActiveSection(){
const scrollPos=window.scrollY+200;

sections.forEach(section=>{
const sectionTop=section.offsetTop;
const sectionHeight=section.offsetHeight;
const sectionId=section.getAttribute("id");

if(scrollPos>=sectionTop && scrollPos<sectionTop+sectionHeight){
navLinks.forEach(link=>{
link.classList.remove("active");
if(link.getAttribute("data-section")===sectionId){
link.classList.add("active");
}
});
}
});
}

window.addEventListener("scroll",highlightActiveSection,{passive:true});

const typingElement=document.getElementById("typing-text");

if(typingElement){

const phrases=[
"Software Developer",
"Cybersecurity Enthusiast",
"Android Developer",
"Flutter Developer",
"Problem Solver",
"Tech Explorer"
];

let phraseIndex=0;
let charIndex=0;
let isDeleting=false;
let typingSpeed=100;

function typeText(){

const currentPhrase=phrases[phraseIndex];

if(isDeleting){
typingElement.textContent=currentPhrase.substring(0,charIndex-1);
charIndex--;
typingSpeed=50;
}else{
typingElement.textContent=currentPhrase.substring(0,charIndex+1);
charIndex++;
typingSpeed=100;
}

if(!isDeleting && charIndex===currentPhrase.length){
isDeleting=true;
typingSpeed=2000;
}else if(isDeleting && charIndex===0){
isDeleting=false;
phraseIndex=(phraseIndex+1)%phrases.length;
typingSpeed=500;
}

setTimeout(typeText,typingSpeed);
}

setTimeout(typeText,3000);
}

const revealElements=document.querySelectorAll(".about-card,.tech-card,.project-card,.stat-box,.contact-method,.passion-item");

const revealObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.style.opacity="1";
entry.target.style.transform="translateY(0)";
revealObserver.unobserve(entry.target);
}
});
},{threshold:0.1});

revealElements.forEach(el=>{
el.style.opacity="0";
el.style.transform="translateY(30px)";
el.style.transition="opacity .6s ease, transform .6s ease";
revealObserver.observe(el);
});

const counters=document.querySelectorAll(".stat-number[data-count]");

const counterObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
const counter=entry.target;
const target=parseInt(counter.getAttribute("data-count"));
let current=0;
const step=target/100;

function update(){
current+=step;
if(current<target){
counter.textContent=Math.floor(current);
requestAnimationFrame(update);
}else{
counter.textContent=target;
}
}

update();
counterObserver.unobserve(counter);
}
});
},{threshold:.5});

counters.forEach(c=>counterObserver.observe(c));

const backToTop=document.getElementById("backToTop");

function toggleBackToTop(){
if(!backToTop) return;
if(window.scrollY>500){backToTop.classList.add("visible")}
else{backToTop.classList.remove("visible")}
}

window.addEventListener("scroll",toggleBackToTop,{passive:true});

backToTop?.addEventListener("click",()=>{
window.scrollTo({top:0,behavior:"smooth"});
});

const contactForm=document.querySelector("#contactForm");
const toast=document.getElementById("toast");

function showToast(message,type="success"){

if(!toast) return;

const toastMessage=toast.querySelector(".toast-message");
const toastIcon=toast.querySelector(".toast-icon");

toastMessage.textContent=message;

if(type==="success"){
toastIcon.className="toast-icon fas fa-check-circle";
toastIcon.style.color="#00ff88";
}else{
toastIcon.className="toast-icon fas fa-exclamation-circle";
toastIcon.style.color="#ff4757";
}

toast.classList.add("show");

setTimeout(()=>{
toast.classList.remove("show");
},3000);
}

if(contactForm){

contactForm.addEventListener("submit",function(e){

e.preventDefault();

const formData=new FormData(contactForm);

const name=formData.get("name");
const email=formData.get("email");
const subject=formData.get("subject");
const message=formData.get("message");

if(!name || !email || !subject || !message){
showToast("Please fill in all fields","error");
return;
}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){
showToast("Please enter a valid email address","error");
return;
}

const submitBtn=contactForm.querySelector("button[type='submit']");
const originalText=submitBtn.innerHTML;

submitBtn.disabled=true;
submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';

emailjs.sendForm("service_6tdhyec","template_sff1c6i",contactForm)

.then(()=>{
showToast("Message sent successfully!");
contactForm.reset();
})

.catch(error=>{
console.error("EMAILJS ERROR:",error);
showToast("Failed to send message","error");
})

.finally(()=>{
submitBtn.disabled=false;
submitBtn.innerHTML=originalText;
});

});

}

const nameHighlight=document.querySelector(".name-highlight");

if(nameHighlight){

const originalText=nameHighlight.textContent;
const glitchChars="!@#$%^&*()_+-=[]{}|;:,.<>?";

function glitchText(){

let iterations=0;

const interval=setInterval(()=>{

nameHighlight.textContent=originalText.split("").map((char,index)=>{
if(index<iterations){return originalText[index]}
return glitchChars[Math.floor(Math.random()*glitchChars.length)];
}).join("");

iterations+=1/3;

if(iterations>=originalText.length){
clearInterval(interval);
nameHighlight.textContent=originalText;
}

},30);

}

setInterval(glitchText,8000);

}

const currentYear=document.getElementById("currentYear");

if(currentYear){
currentYear.textContent=new Date().getFullYear();
}

window.addEventListener("online",()=>showToast("Back online!"));
window.addEventListener("offline",()=>showToast("You are offline","error"));

console.log("%c👋 Hey there, curious developer!","font-size:20px;font-weight:bold;color:#00d9ff");
console.log("%cWelcome to my portfolio!","font-size:14px;color:#b0b0c0");
console.log("%cFeel free to explore the code.","font-size:14px;color:#00ff88");

console.log("✅ All scripts initialized successfully!");

});
