(function readyCallback() {
	// Handler when the DOM is fully loaded
	let url = "https://api.nytimes.com/svc/topstories/v2/home.json";
	url += '?' + queryParams({
		'api-key': "863581c034314134a39447d85afe41ab"
	});

	fetch(url)
	.then(response => response.json())
	.then(data => {
		generateHeader(data.num_results);
		createApp(data.results);
		generateFooter(data.copyright);
	})
	.catch(e => {
		console.log("Error", e);
	});
}());

//generate query string
function queryParams(source) {
	let array = [];

	for(let key in source) {
		array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
	}

	return array.join("&");
}

function generateHeader(countResults) {
	let headerContainer = `
		<header>
			<div class="header-logo"></div>
			<h1 class="header-title">Hello! Here present the Top Stories from The New York Times Developer Network. We found ${countResults} results</h1>
		</header>
	`;
	document.body.innerHTML += headerContainer;
}

function generateFooter(copyright) {
	let footerContainer = `
		<footer>
			<div class="footer-copyright">${copyright}</div>
		</footer>
	`;
	document.body.innerHTML += footerContainer;
}

function createApp(results) {
	//add results block
	let listNews = "";
	
	for (let [index, value] of results.entries()) {
		listNews += News(value, index);
	}

	let resultsContainer = `
		<main>
			<div class="root-container">
				<div class="results">
					${listNews}
				</div>
				<button class="show-more">Show more</button>
			</div>
		</main>
	`;

	document.body.innerHTML += resultsContainer;

	document.addEventListener('click', function(event) {
		let curSelector = event.target;
		event.preventDefault();
		if (hasClass(curSelector, 'show-link')) {
			let curNewsDetails = curSelector.closest(".news").querySelector(".details");
			if (hasClass(curNewsDetails, "hide")) {
				removeClass(curNewsDetails, "hide");
				curSelector.innerHTML = "Hide details";
			} else {
				addClass(curNewsDetails, "hide");
				curSelector.innerHTML = "Show details";
			}
		} else if (hasClass(curSelector, 'show-more')) {
			showMore(10)
		}
		return false;
	});

	let showMore = count => {
		for (let i = itemsCount; i < (itemsCount + count); i++) {
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

	let itemsCount = 0,
			itemsMax = document.querySelectorAll(".results .news").length;

	//show first 10 items
	showMore(10);
	
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