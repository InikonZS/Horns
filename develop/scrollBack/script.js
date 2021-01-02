let left = document.querySelector('.scroller_left');
let sc = document.querySelector('.backscroll');

let right = document.querySelector('.scroller_right');

let sp = 0;
let leftsc = false;
left.addEventListener('mouseover', ()=>{
  leftsc = true;  
});

left.addEventListener('mouseleave', ()=>{
  leftsc = false;  
  sp=0;
});
let bpx =0;

let rightsc = false;
right.addEventListener('mouseover', ()=>{
  rightsc = true;  
});

right.addEventListener('mouseleave', ()=>{
  rightsc = false;  
  sp=0;
});

setInterval(()=>{
  if (leftsc){
    sp+=0.1;
    sp=Math.min(10, sp);
    bpx+=5*sp;
    sc.style['background-position-x'] = bpx+'px';
  }
  if (rightsc){
    sp+=0.1;
    sp=Math.min(10, sp);
    bpx-=5*sp;
    sc.style['background-position-x'] = bpx+'px';
  }
},30);