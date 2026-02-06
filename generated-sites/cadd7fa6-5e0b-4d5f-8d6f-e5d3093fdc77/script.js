document.addEventListener('DOMContentLoaded',()=>{
gsap.registerPlugin(ScrollTrigger);
const isMobile=window.innerWidth<768||!window.matchMedia('(hover: hover)').matches;

/* Cursor Effects (Desktop Only) */
const spotlight=document.getElementById('cursorSpotlight'),cursorDot=document.getElementById('cursorDot'),magneticElements=document.querySelectorAll('.magnetic');
if(spotlight&&cursorDot&&!isMobile){
let mouseX=0,mouseY=0,spotX=0,spotY=0,dotX=0,dotY=0;
document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY});
function animateCursor(){spotX+=(mouseX-spotX)*0.08;spotY+=(mouseY-spotY)*0.08;spotlight.style.left=spotX+'px';spotlight.style.top=spotY+'px';dotX+=(mouseX-dotX)*0.2;dotY+=(mouseY-dotY)*0.2;cursorDot.style.left=dotX+'px';cursorDot.style.top=dotY+'px';requestAnimationFrame(animateCursor)}
animateCursor();
magneticElements.forEach(el=>{el.addEventListener('mousemove',e=>{const rect=el.getBoundingClientRect(),x=e.clientX-rect.left-rect.width/2,y=e.clientY-rect.top-rect.height/2;gsap.to(el,{x:x*0.3,y:y*0.3,duration:0.3,ease:'power2.out'});cursorDot.classList.add('hover')});el.addEventListener('mouseleave',()=>{gsap.to(el,{x:0,y:0,duration:0.5,ease:'elastic.out(1, 0.3)'});cursorDot.classList.remove('hover')})});
}

/* Particles */
const particlesContainer=document.getElementById('particles');
if(particlesContainer&&!isMobile){for(let i=0;i<30;i++){const particle=document.createElement('div');particle.className='particle';particle.style.left=Math.random()*100+'%';particle.style.top=Math.random()*100+'%';particle.style.animationDelay=Math.random()*15+'s';particle.style.animationDuration=(15+Math.random()*10)+'s';particlesContainer.appendChild(particle)}}

/* Header */
const header=document.getElementById('header'),menuToggle=document.getElementById('menuToggle'),navMobile=document.getElementById('navMobile');
window.addEventListener('scroll',()=>{if(window.pageYOffset>50){header.classList.add('scrolled')}else{header.classList.remove('scrolled')}});
if(menuToggle&&navMobile){menuToggle.addEventListener('click',()=>{menuToggle.classList.toggle('active');navMobile.classList.toggle('active');document.body.style.overflow=navMobile.classList.contains('active')?'hidden':''});navMobile.querySelectorAll('a').forEach(link=>{link.addEventListener('click',()=>{menuToggle.classList.remove('active');navMobile.classList.remove('active');document.body.style.overflow=''})})}

/* Mobile Intersection Observer */
if(isMobile){
const mobileObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');entry.target.style.opacity='1';entry.target.style.transform='translateY(0)'}})},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.service-card,.gallery-item,.testimonial-card-3d,.about-card,[data-animate]').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(30px)';el.style.transition='opacity 0.6s ease, transform 0.6s ease';mobileObserver.observe(el)});
}

/* Hero Title Animation */
const heroTitle=document.querySelector('.hero-title');
if(heroTitle){const text=heroTitle.textContent,words=text.split(' ');heroTitle.innerHTML=words.map((word,i)=>{const isGradient=i===1||word.toLowerCase().includes('vision')||word.toLowerCase().includes('transform');return`<span class="word ${isGradient?'gradient-text':''}">${word}</span>`}).join(' ');gsap.fromTo('.hero-title .word',{opacity:0,y:50,rotateX:-30},{opacity:1,y:0,rotateX:0,duration:0.8,stagger:0.1,ease:'power3.out',delay:0.3})}

/* Scroll Animations (Desktop) */
if(!isMobile){
const animateElements=document.querySelectorAll('[data-animate]');
animateElements.forEach(el=>{const delay=parseFloat(el.dataset.delay)||0,type=el.dataset.animate;let fromVars={opacity:0};switch(type){case'fade-up':fromVars.y=60;break;case'fade-down':fromVars.y=-60;break;case'fade-left':fromVars.x=60;break;case'fade-right':fromVars.x=-60;break;case'scale':fromVars.scale=0.8;break;case'word':fromVars.y=40;fromVars.rotateX=-20;break}gsap.fromTo(el,fromVars,{opacity:1,x:0,y:0,scale:1,rotateX:0,duration:0.9,delay:delay,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true,onEnter:()=>el.classList.add('animated')}})});
}

/* Counters */
const counters=document.querySelectorAll('[data-count]');
counters.forEach(counter=>{
const target=parseInt(counter.dataset.count);
function animateCounter(){const duration=2000,start=performance.now();function update(){const elapsed=performance.now()-start,progress=Math.min(elapsed/duration,1),eased=1-Math.pow(1-progress,3);counter.textContent=Math.round(target*eased);if(progress<1)requestAnimationFrame(update)}requestAnimationFrame(update)}
if(isMobile){const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){animateCounter();obs.unobserve(counter)}})},{threshold:0.5});obs.observe(counter)}else{ScrollTrigger.create({trigger:counter,start:'top 85%',once:true,onEnter:animateCounter})}
});

/* 3D Tilt (Desktop) */
const tiltCards=document.querySelectorAll('[data-tilt]');
if(!isMobile){tiltCards.forEach(card=>{card.addEventListener('mousemove',e=>{const rect=card.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,centerX=rect.width/2,centerY=rect.height/2,rotateX=(y-centerY)/15,rotateY=(centerX-x)/15;gsap.to(card,{rotateX:-rotateX,rotateY:rotateY,duration:0.5,ease:'power2.out',transformPerspective:1000})});card.addEventListener('mouseleave',()=>{gsap.to(card,{rotateX:0,rotateY:0,duration:0.7,ease:'elastic.out(1, 0.5)'})})})}

/* Parallax Shapes (Desktop) */
const shapes=document.querySelectorAll('.shape[data-parallax-speed]');
if(shapes.length&&!isMobile){window.addEventListener('scroll',()=>{const scrollY=window.pageYOffset;shapes.forEach(shape=>{const speed=parseFloat(shape.dataset.parallaxSpeed)||0.05;gsap.to(shape,{y:scrollY*speed*100,duration:0.5,ease:'power1.out'})})})}

/* Back to Top */
const backToTop=document.getElementById('backToTop');
if(backToTop){window.addEventListener('scroll',()=>{backToTop.classList.toggle('visible',window.pageYOffset>500)});backToTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'})})}

/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{anchor.addEventListener('click',function(e){e.preventDefault();const target=document.querySelector(this.getAttribute('href'));if(target){target.scrollIntoView({behavior:'smooth'})}})});

/* Contact Form */
const contactForm=document.getElementById('contactForm');
if(contactForm){contactForm.addEventListener('submit',e=>{e.preventDefault();alert('Thank you for your message! We will get back to you soon.');contactForm.reset()})}

/* Magnetic Buttons */
if(!isMobile){
const magneticButtons=document.querySelectorAll('.btn,.nav-cta,.gallery-zoom,.magnetic');
magneticButtons.forEach(btn=>{
btn.addEventListener('mousemove',e=>{
const rect=btn.getBoundingClientRect(),x=e.clientX-rect.left-rect.width/2,y=e.clientY-rect.top-rect.height/2;
gsap.to(btn,{x:x*0.3,y:y*0.3,duration:0.3,ease:'power2.out'})});
btn.addEventListener('mouseleave',()=>{gsap.to(btn,{x:0,y:0,duration:0.5,ease:'elastic.out(1, 0.3)'})})
})}

/* Ripple Effect */
const rippleButtons=document.querySelectorAll('.btn');
rippleButtons.forEach(btn=>{
btn.addEventListener('click',function(e){
const rect=this.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
const ripple=document.createElement('span');
ripple.className='btn-ripple';
ripple.style.left=x+'px';
ripple.style.top=y+'px';
this.appendChild(ripple);
setTimeout(()=>ripple.remove(),600)})});

console.log('✨ Aurora Light Premium v2.1 Loaded');
});
function openLightbox(src){const lightbox=document.getElementById('lightbox'),img=document.getElementById('lightboxImage');if(lightbox&&img){img.src=src;lightbox.classList.add('active');document.body.style.overflow='hidden'}}
function closeLightbox(){const lightbox=document.getElementById('lightbox');if(lightbox){lightbox.classList.remove('active');document.body.style.overflow=''}}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});