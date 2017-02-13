var readyCallback = function() {
	// Handler when the DOM is fully loaded
	let url = "https://api.nytimes.com/svc/topstories/v2/home.json";
	url += '?' + queryParams({
		'api-key': "863581c034314134a39447d85afe41ab"
	});

	fetch(url)
	.then(response => response.json())
	.then(data => {
		generateHeader(data.num_results);
		generateFooter(data.copyright);
		generateMain(data.results);
	})
	.catch(e => {
		console.log("Error", e);
	});
};

//check document ready
if (document.readyState != 'loading') {
	readyCallback();
} else {
	document.addEventListener("DOMContentLoaded", readyCallback);
}

//generate query string
function queryParams(source) {
	let array = [];

	for(let key in source) {
		array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
	}

	return array.join("&");
}

function generateHeader(countResults) {
	let headerTitle = document.createElement("h1");
	addClass(headerTitle, "header-title");
	let titleText = document.createTextNode(`Hello! Here present the Top Stories from The New York Times Developer Network. We found ${countResults} results`);
	headerTitle.appendChild(titleText);
	let headerLogo = document.createElement("div");
	addClass(headerLogo, "header-logo");
	document.querySelector("header").appendChild(headerLogo);
	document.querySelector("header").appendChild(headerTitle);
}

function generateFooter(copyright) {
	let footerContainer = document.createElement("div");
	addClass(footerContainer, "footer-copyright");
	let footerText = document.createTextNode(`${copyright}`);
	footerContainer.appendChild(footerText);
	document.querySelector("footer").appendChild(footerContainer);
}

function generateMain(results) {
	//add results block
	let resultsContainer = document.createElement("div");
	addClass(resultsContainer, "results");
	document.querySelector(".root-container").appendChild(resultsContainer);
	
	for (let [index, value] of results.entries()) {
		addNews(index, value);
	}

	var showLinks = resultsContainer.querySelectorAll(`.show-link`);
	Array.from(showLinks).forEach(link => {
		link.addEventListener('click', function(event) {
			event.preventDefault();
			let curNewsDetails = event.target.closest(".news").querySelector(".details");
			if (hasClass(curNewsDetails, "hide")) {
				removeClass(curNewsDetails, "hide");
				event.target.innerHTML = "Hide details";
			} else {
				addClass(curNewsDetails, "hide");
				event.target.innerHTML = "Show details";
			}
			return false;
		});
	});

	//add show-more button
	let showMoreButton = document.createElement("button");
	addClass(showMoreButton, "show-more");
	let buttonText = document.createTextNode("Show more");
	showMoreButton.appendChild(buttonText);
	document.querySelector(".root-container").appendChild(showMoreButton);

	var showMore = count => {
		for (var i = itemsCount; i < (itemsCount + count); i++) {
			let nextNews = document.querySelectorAll('.results .news')[i];
			if (nextNews) {
				removeClass(nextNews, "hide");
			}
		}

		itemsCount += count;
		
		if (itemsCount > itemsMax) {
			addClass(document.querySelector(".show-more"), "hide");
		}
	}

	showMoreButton.addEventListener('click', function(event) {
		event.preventDefault();
		showMore(10)
	});

	var itemsCount = 0,
			itemsMax = document.querySelectorAll(".results .news").length;

	//show first 10 items
	showMore(10);
}

function addNews(index, obj) {
	let resultsContainer = document.querySelector(".results");
	resultsContainer.innerHTML += News(obj, index);
}

let News = (news, id) => `
	<div class="news hide" data-id="${id}">
		<div class="main-information">
			<div class="tumbnail"><img src="${ news.multimedia.length ? news.multimedia[news.multimedia.length - 2].url : 'icons/undefined.png'}" alt="main-image"/></div>
			<div class="title"><a href="${ news.url }" class="news-link" target="_blank">${ news.title }</a></div>
			<div class="sub-title">${ news.abstract }</div>
			<div class="section">${ news.section }</div>
			<a href="#" class="show-link">Show details</a>
			<div class="clear"></div>
		</div>
		<div class="details hide">
			<div class="author"><span>Author:</span> ${ news.byline }</div>
			<div class="published_date"><span>Published:</span> ${ new Date(news.published_date).toLocaleString() }</div>
			<div class="large-image"><img src="${ news.multimedia.length ? news.multimedia[news.multimedia.length - 1].url : ''}" alt="big-image"/></div>
		</div>
	</div>
`;

function addClass(el, className) {
	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
}

function removeClass(el, className) {
	if (el.classList) {
		el.classList.remove(className);
	}	else {
		el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
}

function hasClass(el, className) {
	if (el.classList) {
		return el.classList.contains(className);
	} else {
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	}
}