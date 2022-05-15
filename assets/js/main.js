/**
 * Utils
 */

// Throttle
//
const throttle = (callback, limit) => {
  let timeoutHandler = null;
  return () => {
    if (timeoutHandler == null) {
      timeoutHandler = setTimeout(() => {
        callback();
        timeoutHandler = null;
      }, limit);
    }
  };
};

// addEventListener Helper
//
const listen = (ele, e, callback) => {
  if (document.querySelector(ele) !== null) {
    document.querySelector(ele).addEventListener(e, callback);
  }
}

/**
 * Functions
 */

// Game of Life
//
const canvas = document.getElementById('canvas');

const height = 200;
const width = 400;

const cellWidth = 10;
const cellHeight = 10;

const grid = Array.from({ length: height/cellHeight }, () => Array.from({ length: width/cellWidth }, () => false));

const initCellIndexes = [203, 243, 283, 323, 403, 363, 443, 483, 523, 563, 167, 165, 166, 164, 163, 170, 210, 250, 290, 330, 370, 410, 450, 490, 530, 570, 567, 565, 566, 564, 371, 372, 373, 374, 415, 375, 335, 295, 175, 215, 255, 455, 495, 535, 575, 178, 218, 258, 338, 298, 378, 418, 498, 458, 538, 578, 179, 181, 180, 182, 183, 223, 263, 303, 343, 583, 542, 501, 460, 419, 379, 380, 381, 382, 383, 188, 228, 186, 187, 268, 308, 348, 388, 428, 508, 468, 548, 588, 587, 586, 589, 590, 189, 190, 196, 195, 194, 193, 197, 233, 273, 313, 353, 393, 394, 395, 396, 397, 437, 477, 517, 557, 597, 595, 596, 594, 593, 582, 541, 500, 459];

const initGrid = () => {
	for (const index of initCellIndexes) {
  	const x = index % (width/cellWidth);
    const y = (index - x) / (width/cellWidth);
    grid[y][x] = true;
  }
}

const drawGrid = (ctx) => {
  ctx.clearRect(0, 0, width, height);
  for (let x = 0; x < canvas.width/cellWidth; x += 1) {
    for (let y = 0; y < canvas.height/cellHeight; y += 1) {
    	ctx.strokeStyle = 'grey';
      ctx.strokeRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
      if (grid[y][x]) {
        ctx.fillStyle = 'purple';
        ctx.fillRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

const update = () => {
	// whether this cell should now be live, based on the given grid state
	const survives = (x, y, copied_grid) => {
  	let live_neighbours = 0;
    for (let j = x-1; j < x+2; j++) {
    	for (let i = y-1; i < y+2; i++) {
      	if (j >= 0 && j < copied_grid[0].length
        		&& i >= 0 && i < copied_grid.length
            && !(i == y && j == x)
            && grid[i][j]) {
        	live_neighbours += 1;
        }
      }
    }

    return (copied_grid[y][x] && live_neighbours >= 2 && live_neighbours <= 3) || (!copied_grid[y][x] && live_neighbours == 3);
  }

	const copied_grid = grid.map(elem => elem.map(e => e));
  for (let x = 0; x < width/cellWidth; x += 1) {
  	for (let y = 0; y < height/cellHeight; y += 1) {
    	grid[y][x] = survives(x, y, copied_grid);
    }
  }
}

const drawAndUpdate = (ctx) => {
	drawGrid(ctx);
  update();
}

// Auto Hide Header
//
let header = document.getElementById('site-header');
let lastScrollPosition = window.pageYOffset;

const autoHideHeader = () => {
  let currentScrollPosition = Math.max(window.pageYOffset, 0);
  if (currentScrollPosition > lastScrollPosition) {
    header.classList.remove('slideInUp');
    header.classList.add('slideOutDown');
  } else {
    header.classList.remove('slideOutDown');
    header.classList.add('slideInUp');
  }
  lastScrollPosition = currentScrollPosition;
}

// Mobile Menu Toggle
//
let mobileMenuVisible = false;

const toggleMobileMenu = () => {
  let mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuVisible == false) {
    mobileMenu.style.animationName = 'bounceInRight';
    mobileMenu.style.webkitAnimationName = 'bounceInRight';
    mobileMenu.style.display = 'block';
    mobileMenuVisible = true;
  } else {
    mobileMenu.style.animationName = 'bounceOutRight';
    mobileMenu.style.webkitAnimationName = 'bounceOutRight'
    mobileMenuVisible = false;
  }
}

// Featured Image Toggle
//
const showImg = () => {
  document.querySelector('.bg-img').classList.add('show-bg-img');
}

const hideImg = () => {
  document.querySelector('.bg-img').classList.remove('show-bg-img');
}

// ToC Toggle
//
const toggleToc = () => {
  document.getElementById('toc').classList.toggle('show-toc');
}


if (header !== null) {
  listen('#menu-btn', "click", toggleMobileMenu);
  listen('#toc-btn', "click", toggleToc);
  listen('#img-btn', "click", showImg);
  listen('.bg-img', "click", hideImg);

  document.querySelectorAll('.post-year').forEach((ele)=> {
    ele.addEventListener('click', () => {
      window.location.hash = '#' + ele.id;
    });
  });

  window.addEventListener('scroll', throttle(() => {
    autoHideHeader();

    if (mobileMenuVisible == true) {
      toggleMobileMenu();
    }
  }, 250));
}

if (canvas !== null && canvas.getContext) {
  canvas.height = height;
  canvas.width = width;

  const ctx = canvas.getContext('2d');

  canvas.addEventListener('click', function(event) {
    const canvasRect = canvas.getBoundingClientRect();
    const x = Math.max(Math.floor((event.layerX - canvasRect.x)/cellWidth), 0);
    const y = Math.max(Math.floor((event.layerY - canvasRect.y)/cellHeight), 0);
    const cellIndex = x + y*(width/cellWidth);
    grid[y][x] = !grid[y][x];

    console.log([x, y]);
  });

  initGrid();
  drawGrid(ctx);
  setInterval(drawAndUpdate, 300, ctx);
}
