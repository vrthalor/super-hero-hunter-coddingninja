
const superHeroApp = (() => {
	//Variable Declarations//
	const videos = document.getElementsByClassName("headerVideo");
	const footerVideo = document.getElementsByClassName("footerVideo")[0];
	const template = document.querySelector(".template ul li");
	const suggestionBox = document.getElementsByClassName("autocomplete-box")[0];
	const input = document.getElementsByTagName("input")[0];
	const UL = document.querySelector(".search-box ul");
	const footerRect = document.querySelector("footer").getBoundingClientRect();
	const height = Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		document.body.clientHeight
	);
	let i = 0;
	let flag = "not found";
	let superheroes = [];

	const heartToggle = (favouriteBtn, name) => {
		let arr = [];
		let item = name.trim().toLowerCase();
		if ("favourites" in localStorage) {
			arr = JSON.parse(localStorage.getItem("favourites"));
			if (arr.includes(item)) {
				favouriteBtn.style.color = "red";
			}
			else {
				favouriteBtn.style.color = "black";
			}
		}
		else {
			favouriteBtn.style.color = "black";
		}
	};

	const videoPlay = () => {
		document.querySelectorAll(".homepage-header")[0].click();
		(async function initialize() {
			try {
				const url = "https://superhero-hunter-app-mini-server.onrender.com";
				const response = await fetch(url);
			} catch (error) {
				console.log(error);
			}
		})();
	};

	const fetchSuperhero = async (value) => {
		if (value.length === 0 || value.trim() === "") {
			UL.style.visibility = "hidden";
			flag = "not found";
			return;
		} else {
			try {
				const url = `https://superhero-hunter-app-mini-server.onrender.com/api/v1/superheroes/${value}`;
				const response = await fetch(url);
				let data = await response.json();
				data = data.data;
				if (data.response === "error") {
					UL.style.visibility = "hidden";
					flag = "not found";
					return;
				}
				const superheroList = data.results;
				suggestionBox.querySelectorAll("li").forEach((li) => {
					li.remove();
				});
				superheroes = superheroList.map((superhero) => {
					const suggestion = template.cloneNode(true);
					const name = suggestion.querySelector("div span");
					const image = suggestion.querySelector("div img");
					const favouriteBtn = suggestion.querySelector(".fav-btn");
					if (superhero.name.toLowerCase().includes(value.toLowerCase())) {
						name.textContent = superhero.name;
						image.src = superhero.image.url;
						suggestion.setAttribute("data-id", superhero.id);
						suggestion.setAttribute(
							"data-image-url",
							superhero.image.url
						);
				
						heartToggle(favouriteBtn, superhero.name);
					}
					if (
						name.textContent === "" ||
						name.textContent === null ||
						name.textContent === undefined
					) {
						return null;
					}
					return suggestion;
				});
				if (superheroes[0] === null) {
					UL.style.visibility = "hidden";
					flag = "not found";
					return;
				}
				suggestionBox.append(...superheroes);
				UL.style.visibility = "visible";
				flag = "found";
			} catch (error) {
				UL.style.visibility = "hidden";
				if (error.message === "Failed to fetch") {
					console.log(error);
				} else if (error.name === "TypeError") {
					console.log(error);
				}
				flag = "not found";
			}
		}
	};

	const handleClick = (event) => {
		event.stopPropagation();
		const target = event.target;
		const li = document.querySelectorAll(".search-box ul li");
		const toast = document.querySelector(".toast");

		if (target.id === "form" || target.id === "wrapper") {
			UL.style.visibility = "hidden";
		}
		if (
			target.id === "search-input" &&
			target.value.length > 0 &&
			flag === "found"
		) {
			UL.style.visibility = "visible";
		}
		li.forEach((li) => {
			if (target === li) {
				localStorage.setItem(
					"superhero",
					target.textContent.trim().toLowerCase()
				);
				window.location.href = "./superhero-page.html";
				return;
			}
			if (target === li.children[0]) {
				localStorage.setItem(
					"superhero",
					target.children[1].textContent.trim().toLowerCase()
				);
				window.location.href = "./superhero-page.html";
				return;
			}
			if (target === li.children[0].children[1]) {
				localStorage.setItem(
					"superhero",
					target.textContent.trim().toLowerCase()
				);
				window.location.href = "./superhero-page.html";
				return;
			}
			if (target === li.children[0].children[0]) {
				localStorage.setItem(
					"superhero",
					target.nextElementSibling.textContent.trim().toLowerCase()
				);
				window.location.href = "./superhero-page.html";
				return;
			}
			if (target === li.children[1]) {
				let arr = [];
				let images = [];
				let item = target.previousElementSibling.children[1].textContent
					.trim()
					.toLowerCase()
					.toLowerCase();
				let url = target.parentElement.getAttribute("data-image-url");
				toast.children[0].children[0].textContent = item;

				if ("favourites" in localStorage) {
					arr = JSON.parse(localStorage.getItem("favourites"));
					images = JSON.parse(localStorage.getItem("images"));

					if (arr.includes(item)) {
						arr = arr.filter((i) => i !== item);
						images = images.filter((obj) => obj.name !== item);
						target.style.color = "black";
						toast.children[1].children[0].textContent =
							"Removed from Favourites !!!";
					}
					else {
						arr.push(item);
						images.push({ name: item, image: url });
						target.style.color = "red";
						toast.children[1].children[0].textContent =
							"Added to Favourites !!!";
					}
				}
				else {
					arr.push(item);
					images.push({ name: item, image: url });
					target.style.color = "red";
					toast.children[1].children[0].textContent =
						"Added to Favourites !!!";
				}

				localStorage.setItem("favourites", JSON.stringify(arr));
				localStorage.setItem("images", JSON.stringify(images));
				toast.classList.add("show", "fadeLeft");
				setTimeout(() => {
					toast.classList.remove("show", "fadeLeft");
				}, 3000);
				return;
			}
		});
		if (target.id === "search-button") {
			event.preventDefault();
			const val = target.previousElementSibling.children[0].value;
			if (val.length > 0) {
				localStorage.setItem("superhero", val.toLowerCase());
				window.location.href = "./superhero-page.html";
				return;
			}
			return;
		}
	};


	const debounce = (callback, delay = 180) => {
		let timeoutID;
		return (...value) => {
			clearTimeout(timeoutID);
			timeoutID = setTimeout(() => {
				callback(...value);
			}, delay);
		};
	};
	//----------------------------------------------------------------
	const search = debounce((value) => {
		fetchSuperhero(value);
	}, 180);
	//----------------------------------------------------------------
	const handleInput = (event) => {
		event.stopPropagation();
		const value = event.target.value;
		search(value);
	};
	//----------------------------------------------------------------
	const handlePress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			event.stopPropagation();
			const submit = document.getElementById("search-button");
			const val = submit.previousElementSibling.children[0].value;
			if (val.length > 0) {
				submit.click();
				localStorage.setItem("superhero", val.toLowerCase());
				//Redirect to the superhero pagex
				window.location.href = "./superhero-page.html";
				return;
			}
			return;
		}
	};
	//----------------------------------------------------------------
	
	const initializeApp = () => {
		document.addEventListener("click", handleClick);
		document.addEventListener("input", handleInput);
		document.addEventListener("keypress", handlePress);
		window.onload = () => {
			videoPlay();
		};
	};
	//----------------------------------------------------------------
	return {
		initialize: initializeApp,
	};
})();
//----------------------------------------------------------------
