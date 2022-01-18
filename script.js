'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo  = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click',function(e){

const clicked  = e.target.closest('.operations__tab');
console.log('clicked');

//Gaurd Clause
if(!clicked){ 
return;
}

tabs.forEach(t => t.classList.remove('operations__tab--active'));

clicked.classList.add('operations__tab--active');

})