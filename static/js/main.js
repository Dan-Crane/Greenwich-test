window.addEventListener("DOMContentLoaded", () => {
  mobileSlider();
  mobileSliderAdvantages();
  fixedHeader();
  sandwichToggle();
});

// Fixed Header
let header = document.querySelector("header");
let headerHeight = parseInt(getComputedStyle(header).height, 10); // высота Хедера
let isHeaderFixed = false; // флаг

window.addEventListener("scroll", fixedHeader); // запуск функции при скролле

function fixedHeader(event) {
  if (!isHeaderFixed && headerHeight <= window.pageYOffset) {
    header.classList.add("fixed");
    setTimeout(function () {
      header.classList.add("active");
    }, 50);
  } else {
    header.classList.remove("fixed");
    header.classList.remove("active");
  }
}

// функция ловящая вьюпорт
window.addEventListener("resize", () => {
  mobileSlider();
  mobileSliderAdvantages();
});

// slider create
const sliderCreate = document.querySelector(".create__slider");
var mySwiperCreate;

function mobileSlider() {
  if (window.innerWidth <= 991 && sliderCreate.dataset.mobile == "false") {
    mySwiperCreate = new Swiper(sliderCreate, {
      // Optional parameters
      slidesPerView: 1,
      loop: true,
      wrapperClass: "create__wrapper",
      slideClass: "create__slide",

      // If we need pagination
      pagination: {
        el: ".create__pagination",
        clickable: true,
      },
    });

    sliderCreate.dataset.mobile = "true";
  }

  if (window.innerWidth > 991) {
    sliderCreate.dataset.mobile = "false";

    if (sliderCreate.classList.contains("swiper-container-initialized")) {
      mySwiperCreate.destroy();
    }
  }
}

//  slider create
const sliderAdvantages = document.querySelector(".advantages__slider");
var mySwiperAdvantages;

function mobileSliderAdvantages() {
  if (window.innerWidth <= 768 && sliderAdvantages.dataset.mobile == "false") {
    mySwiperAdvantages = new Swiper(sliderAdvantages, {
      // Optional parameters
      slidesPerView: 1,
      loop: true,
      wrapperClass: "advantages__wrapper",
      slideClass: "advantages__slide",

      // If we need pagination
      pagination: {
        el: ".advantages__pagination",
        clickable: true,
      },
    });

    sliderAdvantages.dataset.mobile = "true";
  }

  if (window.innerWidth > 768) {
    sliderAdvantages.dataset.mobile = "false";

    if (sliderAdvantages.classList.contains("swiper-container-initialized")) {
      mySwiperAdvantages.destroy();
    }
  }
}

//slider portfolio
var swiperPrtfolio = new Swiper(".portfolio__slider", {
  slidesPerView: 4,
  slidesPerColumn: 2,
  slidesPerColumnFill: "row",
  wrapperClass: "portfolio__wrapper",
  slideClass: "portfolio__slide",
  spaceBetween: 0,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    425: {
      slidesPerView: 2,
    },
    // when window width is >= 480px
    992: {
      slidesPerView: 3,
    },
    // when window width is >= 640px
    1024: {
      slidesPerView: 4,
    },
  },
});

//slider clients
var swiperClients = new Swiper(".clients__slider", {
  slidesPerView: 2,
  wrapperClass: "clients__wrapper",
  slideClass: "clients__slide",
  spaceBetween: 50,
  loop: true,
  navigation: {
    nextEl: ".clients__btn-next",
    prevEl: ".clients__btn-prev",
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    992: {
      spaceBetween: 20,
    },
    // when window width is >= 640px
    1047: {
      spaceBetween: 50,
    },
  },
});

const sandwichToggle = function () {
  // Выбираем элементы, которые нам нужны. В примере мы ищем элементы с классом "sandwich"
  let sandwichElements = document.querySelectorAll(".sandwich");
  // Проходим циклом по всем эдементам и на каждый элемент вешаем слушателя, который по клику будет переключать класс
  sandwichElements.forEach((item) => {
    item.addEventListener("click", showSandwichTarget);
  });

  function showSandwichTarget() {
    let targetId = this.getAttribute("data-target-id"),
      targetClassToggle = this.getAttribute("data-target-class-toggle");
    this.classList.toggle("is-active");
    document.body.classList.toggle("lockSandwich");
    if (targetId && targetClassToggle) {
      document.getElementById(targetId).classList.toggle(targetClassToggle);
    }
  }
};

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

(function () {
  let originalPositions = [];
  let daElements = document.querySelectorAll("[data-da]");
  let daElementsArray = [];
  let daMatchMedia = [];
  //Заполняем массивы
  if (daElements.length > 0) {
    let number = 0;
    for (let index = 0; index < daElements.length; index++) {
      const daElement = daElements[index];
      const daMove = daElement.getAttribute("data-da");
      if (daMove != "") {
        const daArray = daMove.split(",");
        const daPlace = daArray[1] ? daArray[1].trim() : "last";
        const daBreakpoint = daArray[2] ? daArray[2].trim() : "767";
        const daType = daArray[3] === "min" ? daArray[3].trim() : "max";
        const daDestination = document.querySelector("." + daArray[0].trim());
        if (daArray.length > 0 && daDestination) {
          daElement.setAttribute("data-da-index", number);
          //Заполняем массив первоначальных позиций
          originalPositions[number] = {
            parent: daElement.parentNode,
            index: indexInParent(daElement),
          };
          //Заполняем массив элементов
          daElementsArray[number] = {
            element: daElement,
            destination: document.querySelector("." + daArray[0].trim()),
            place: daPlace,
            breakpoint: daBreakpoint,
            type: daType,
          };
          number++;
        }
      }
    }
    dynamicAdaptSort(daElementsArray);

    //Создаем события в точке брейкпоинта
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daBreakpoint = el.breakpoint;
      const daType = el.type;

      daMatchMedia.push(
        window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)")
      );
      daMatchMedia[index].addListener(dynamicAdapt);
    }
  }
  //Основная функция
  function dynamicAdapt(e) {
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daElement = el.element;
      const daDestination = el.destination;
      const daPlace = el.place;
      const daBreakpoint = el.breakpoint;
      const daClassname = "_dynamic_adapt_" + daBreakpoint;

      if (daMatchMedia[index].matches) {
        //Перебрасываем элементы
        if (!daElement.classList.contains(daClassname)) {
          let actualIndex = indexOfElements(daDestination)[daPlace];
          if (daPlace === "first") {
            actualIndex = indexOfElements(daDestination)[0];
          } else if (daPlace === "last") {
            actualIndex = indexOfElements(daDestination)[
              indexOfElements(daDestination).length
            ];
          }
          daDestination.insertBefore(
            daElement,
            daDestination.children[actualIndex]
          );
          daElement.classList.add(daClassname);
        }
      } else {
        //Возвращаем на место
        if (daElement.classList.contains(daClassname)) {
          dynamicAdaptBack(daElement);
          daElement.classList.remove(daClassname);
        }
      }
    }
    customAdapt();
  }

  //Вызов основной функции
  dynamicAdapt();

  //Функция возврата на место
  function dynamicAdaptBack(el) {
    const daIndex = el.getAttribute("data-da-index");
    const originalPlace = originalPositions[daIndex];
    const parentPlace = originalPlace["parent"];
    const indexPlace = originalPlace["index"];
    const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
    parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
  }
  //Функция получения индекса внутри родителя
  function indexInParent(el) {
    var children = Array.prototype.slice.call(el.parentNode.children);
    return children.indexOf(el);
  }
  //Функция получения массива индексов элементов внутри родителя
  function indexOfElements(parent, back) {
    const children = parent.children;
    const childrenArray = [];
    for (let i = 0; i < children.length; i++) {
      const childrenElement = children[i];
      if (back) {
        childrenArray.push(i);
      } else {
        //Исключая перенесенный элемент
        if (childrenElement.getAttribute("data-da") == null) {
          childrenArray.push(i);
        }
      }
    }
    return childrenArray;
  }
  //Сортировка объекта
  function dynamicAdaptSort(arr) {
    arr.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) {
        return -1;
      } else {
        return 1;
      }
    });
    arr.sort(function (a, b) {
      if (a.place > b.place) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  //Дополнительные сценарии адаптации
  function customAdapt() {
    //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }
})();

// let block = document.querySelector(".click");
// block.addEventListener("click", function (e) {
//   alert("Все ок ;)");
// });

/*
//Объявляем переменные
const parent_original = document.querySelector('.content__blocks_city');
const parent = document.querySelector('.content__column_river');
const item = document.querySelector('.content__block_item');
//Слушаем изменение размера экрана
window.addEventListener('resize', move);
//Функция
function move(){
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width <= 992) {
		if (!item.classList.contains('done')) {
			parent.insertBefore(item, parent.children[2]);
			item.classList.add('done');
		}
	} else {
		if (item.classList.contains('done')) {
			parent_original.insertBefore(item, parent_original.children[2]);
			item.classList.remove('done');
		}
	}
}
//Вызываем функцию
move();
*/

//animate counts
const counts = () => {
  let countSpan = document.querySelectorAll(".s-count__num");

  const speed = 40;

  countSpan.forEach((el) => {
    const countNum = +el.getAttribute("data-num-count");
    const updataCount = setInterval(() => {
      const spanCont = +el.innerText;
      const increaseBy = countNum / speed;

      spanCont < countNum
        ? (el.textContent = Math.ceil(spanCont + increaseBy))
        : clearInterval(updataCount);
    }, 50);
  });
};

var wow = new WOW({
  boxClass: "wow", // animated element css class (default is wow)
  animateClass: "animated", // animation css class (default is animated)
  offset: 0, // distance to the element when triggering the animation (default is 0)
  mobile: true, // trigger animations on mobile devices (default is true)
  live: true, // act on asynchronously loaded content (default is true)
  callback: function (box) {
    counts();
  },
  scrollContainer: null, // optional scroll container selector, otherwise use window,
  resetAnimation: true, // reset animation on end (default is true)
});
wow.init();
