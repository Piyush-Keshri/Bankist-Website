'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo  = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');


//-----------------------MODAL WINDOW------------------------------//
const openModal = function (e) {
  e.preventDefault();      
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click',openModal));

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//---------------------------PAGE NAVIGATION----------------------//

/*
This is not very optimised way to do the smooth scrolling as we are calling a function on each of the elements.
That will create n no. of copies of the function for n elements.
The Solution to this is in event delegation i.e. we will handle the events by the parent element of these elements.

document.querySelectorAll('.nav__link').forEach(function(el){

el.addEventListener('click',function(e){
  e.preventDefault();
  const id = this.getAttribute('href');
  document.querySelector(id).scrollIntoView({behavior : 'smooth'});

});
});
*/

// 1. Add event listener to common parent element.
// 2. Determone what element originated the event.

document.querySelector('.nav__links').addEventListener('click',function(e){
  
e.preventDefault();

//Matching Strategy
if(e.target.classList.contains('nav__link'))
{

const id = e.target.getAttribute('href');
document.querySelector(id).scrollIntoView({behavior : 'smooth'});

}

});

//-------------------------SMOOTH SCROLLING----------------------//


btnScrollTo.addEventListener('click',function(e){
  e.preventDefault();

// Old way of scrolling . 

//   const s1coords = section1.getBoundingClientRect();  //Gets the co-ordinates of section 1.
  
//   window.scrollTo({
//     left : s1coords.left + window.pageXOffset,
//     top : s1coords.top + window.pageYOffset,
//     behavior : 'smooth', 
//   });

// Modern Way of Scrolling
  section1.scrollIntoView({behavior:"smooth"})

});

//------------------------------TABBED COMPONENT----------------------------------//

tabsContainer.addEventListener('click',function(e){

const clicked  = e.target.closest('.operations__tab');

//Gaurd Clause
if(!clicked){ 
return;
}
//Active tab 
tabs.forEach(t => t.classList.remove('operations__tab--active'));

clicked.classList.add('operations__tab--active');

//Activate tab
tabsContent.forEach(c => c.classList.remove('operations__content--active'));

//Activate content area.
document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});

//-----------------------Menu Fade Animation------------------------------//

const handleHover = function(e){

if(e.target.classList.contains('nav__link')){

const link = e.target;
const siblings = link.closest('.nav').querySelectorAll('.nav__link');
const logo = link.closest('.nav').querySelector('img');

siblings.forEach(el => {

  if(el !== link) el.style.opacity = this;

});
logo.style.opacity = this;

}
}

nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout',handleHover.bind(1));

//------------------------STICKY NAVIGATION--------------------------//
/*

//In this method we store the coordinates of section 1 in a variable and then compare it with the coordinates of scroll in window.
//If the scroll in window passes the initial coordinate then we add 'sticky class to our nav-bar and remove it when the value is less then the initial coordinates.
//But this method is not very efficient as we always count the scroll coordinates so we use Intersection Observer APIs.

const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll',function(){
// console.log(window.scrollY)
if(window.scrollY > initialCoords.top)
nav.classList.add('sticky');

else
nav.classList.remove('sticky');

});
*/
//Sticky Navigation through Intersection Observer API 
// The Intersection Observer API enables developers to understand the visibility and position of target DOM elements relative to an intersection root.
// This callback will be invoked when there are changes to target’s intersection with the intersection root, as per the processing model.

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height ;

const stickyNav = function(entries){
  const [entry] = entries;
  
  if(!entry.isIntersecting)
  nav.classList.add('sticky');
  else
  nav.classList.remove('sticky');

}

const headerObserver = new IntersectionObserver(stickyNav,{
  root : null,
  threshold : 0,   //When 0% of header is visible then we want something to happen
  rootMargin : `-${navHeight}px` ,      

});

headerObserver.observe(header);

//------------------------------REVEALING SECTIONS-----------------------------------------//

const allSections = document.querySelectorAll('.section')

const revealSection = function(entries,observer){

const[entry] = entries;
if(!entry.isIntersecting)
  return;

entry.target.classList.remove('section--hidden');
}

const sectionObserver = new IntersectionObserver(revealSection,{

  root:null,
  threshold:0.15,

});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
})

//-------------------------LAZY LOADING IMAGES-----------------------------//

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);
const loadImg = function(entries,observer){

const [entry]  = entries;
// console.log(entry);
if(!entry.isIntersecting)return;

//Replace src with data-src
entry.target.src = entry.target.dataset.src ;
entry.target.addEventListener('load',function(){
  entry.target.classList.remove('lazy-img');
});
observer.unobserve(entry.target); 
};

const imgObserver = new IntersectionObserver(loadImg,{
  root:null,
  threshold : 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

// -------------------------SLIDER--------------------------------------//

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();