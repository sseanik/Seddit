import { createLogin } from "../Auth/login.js";
import { addFeedPosts, changePage, createFeedPost } from "./feed.js";
import { grabSubseddit } from "./subseddit.js";
import { showSearchPosts } from "./search.js";
import { resetFeed, toggleFeed, toggleLoader } from "./reset.js";
import { createPost } from "../Post/post.js";

// Create Banner at the top
export function createBanner(apiUrl) {
  // Create a header to hold banner items
  const navHeader = document.createElement("header");
  navHeader.id = "navHeader";
  navHeader.classList = "navHeader";
  root.appendChild(navHeader);

  // Create site name as a logo
  const siteHeading = document.createElement("div");
  siteHeading.id = "siteHeading";
  siteHeading.classList = "siteHeading";
  siteHeading.innerText = "Seddit";
  // Add home refresh click event into logo
  siteHeading.addEventListener("click", () => {
    resetFeed();
    createBasePage(apiUrl, 0);
  });
  navHeader.appendChild(siteHeading);

  const loader = document.createElement("div");
  loader.id = "loader";
  loader.classList = "loader";
  navHeader.appendChild(loader);

  // Create subseddit (hidden) heading next to logo
  const subsedditHeading = document.createElement("p");
  subsedditHeading.id = "subsedditHeading";
  subsedditHeading.classList = "subsedditHeading";
  subsedditHeading.addEventListener("click", () => {
    grabSubseddit(apiUrl);
  });
  navHeader.appendChild(subsedditHeading);

  // Create wrapper for nav elements
  const nav = document.createElement("ul");
  nav.classList = "nav";
  navHeader.appendChild(nav);

  // Create a search box
  const searchBox = document.createElement("li");
  searchBox.id = "searchBox";
  searchBox.classList = "nav-item";
  nav.appendChild(searchBox);
  // If user is not logged in, hide search box
  if (!localStorage.getItem("token")) {
    searchBox.style.display = "none";
  }

  // Create input field for search box
  const searchInput = document.createElement("input");
  searchInput.id = "searchInput";
  searchInput.classList = "inputBox";
  searchInput.placeholder = "Search Seddit";
  searchInput.type = "search";
  searchBox.appendChild(searchInput);

  // Create search button
  const searchButton = document.createElement("button");
  searchButton.id = "searchButton";
  searchButton.innerText = "\u2315";
  searchButton.classList = "searchButton";
  searchButton.addEventListener("click", () => {
    // If search query is not empty
    if (document.getElementById("searchInput").textLength === 0) {
      return;
    }
    toggleFeed(5);
    toggleLoader(true);
    showSearchPosts(apiUrl);
  });
  searchBox.appendChild(searchButton);

  // If the user is not logged in
  if (localStorage.getItem("token") === null) {
    // Create login wrapper
    const loginBox = document.createElement("li");
    loginBox.classList = "nav-item";
    nav.appendChild(loginBox);

    // Create login button
    const loginButton = document.createElement("button");
    loginButton.id = "loginButton";
    loginButton.classList = "button button-primary";
    loginButton.innerText = "LOG IN";
    loginButton.setAttribute("data-id-login", "");
    // When clicked, initialise login modal
    loginButton.addEventListener("click", () => {
      document.getElementById("loginModal").style.display = "inline";
    });
    loginBox.appendChild(loginButton);

    // Create signup wrapper
    const signupBox = document.createElement("li");
    signupBox.classList = "nav-item";
    nav.appendChild(signupBox);

    // Create signup button
    const signupButton = document.createElement("button");
    signupButton.id = "signupButton";
    signupButton.classList = "button button-secondary";
    signupButton.setAttribute("data-id-signup", "");
    signupButton.innerText = "SIGN UP";

    // When clicked, initialise signup modal
    signupButton.addEventListener("click", () => {
      document.getElementById("signUpModal").style.display = "inline";
    });
    signupBox.appendChild(signupButton);
  }
  // If the user is already logged in
  else {
    // Create a profile wrapper
    const profileBox = document.createElement("li");
    profileBox.classList = "nav-item";
    nav.appendChild(profileBox);

    // Create a profile button
    const profileLink = document.createElement("button");
    profileLink.classList = "button button-primary";
    profileLink.addEventListener("click", () => {
      // When clicked, hide feed and show profile
      toggleFeed(1);
      document.getElementById("profileWrapper").style.display = "";
    });
    profileBox.appendChild(profileLink);

    // Fetch the user's name
    let options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      method: "GET",
    };
    fetch(`${apiUrl}/user/`, options)
      .then((res) => res.json())
      .then((json) => {
        // Set the profile button's text to the user's name
        profileLink.innerText = json.username;
        profileLink.id = "profileName";
        profileLink.setAttribute("check", json.id);
      });

    // Create a logout wrapper
    const logoutBox = document.createElement("li");
    logoutBox.classList = "nav-item";
    nav.appendChild(logoutBox);

    // Create a logout button
    const logoutButton = document.createElement("button");
    logoutButton.id = "logoutButton";
    logoutButton.classList = "buttonThree";
    logoutButton.innerText = "LOG OUT";
    logoutButton.addEventListener("click", () => {
      // When button is quit, change to logged out interface
      document.getElementById("profileWrapper").remove();
      resetFeed("logout");
      createLogin(apiUrl);
      createBanner(apiUrl);
      createBasePage(apiUrl, 0);
    });
    logoutBox.appendChild(logoutButton);
  }
}

// Create base feed page
export function createBasePage(apiUrl, num) {
  toggleLoader(true);

  // Create feed skeleton
  const mainFeed = document.createElement("main");
  mainFeed.id = "mainFeed";
  mainFeed.setAttribute("role", "main");
  root.appendChild(mainFeed);

  // Create feed list
  const feed = document.createElement("ul");
  feed.id = "feed";
  mainFeed.appendChild(feed);

  // Create feed header
  const feedHeader = document.createElement("div");
  feedHeader.classList = "feed-header";
  feed.appendChild(feedHeader);

  // Create feedHeading
  const feedHeading = document.createElement("h3");
  feedHeading.classList = "feed-title";
  // If user is not logged in
  if (localStorage.getItem("token") === null) {
    feedHeading.innerText = "Public Feed";
  } else {
    // Generate user's name and add to feed header
    let options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      method: "GET",
    };
    fetch(`${apiUrl}/user/`, options)
      .then((res) => res.json())
      .then((json) => {
        feedHeading.innerText = json.name + "'s Feed";
      });
  }
  feedHeader.appendChild(feedHeading);

  // Create post button
  const postButton = document.createElement("button");
  postButton.classList = "button button-secondary";
  postButton.innerText = "Post";
  postButton.addEventListener("click", () => createPost(apiUrl));
  feedHeader.appendChild(postButton);

  // If user is not logged in, generate public posts
  if (localStorage.getItem("token") === null) {
    fetch(`${apiUrl}/post/public`)
      .then((res) => res.json())
      .then((myJson) => {
        // Sort the posts based on their date
        myJson.posts.sort((a, b) => a.meta.published - b.meta.published);
        // Add each post to the feed
        for (let i = 0; i < myJson.posts.length; i++) {
          createFeedPost(myJson.posts[i], apiUrl, 0);
        }
        toggleLoader(false);
      });
  }
  // If the user is logged in, add their own feed
  else {
    addFeedPosts(num, apiUrl);
  }

  // If user is logged in
  if (localStorage.getItem("token")) {
    // Calculate page number
    let number = num / 6 + 1;

    // Create pagination wrapper
    const pageBox = document.createElement("div");
    pageBox.classList = "pagination";
    pageBox.id = "pagination";
    mainFeed.appendChild(pageBox);

    // Create previous page button
    const leftPage = document.createElement("button");
    leftPage.classList = "leftButton";
    leftPage.innerText = "<";
    leftPage.addEventListener("click", () => {
      changePage(apiUrl, number - 1);
    });
    pageBox.appendChild(leftPage);

    // Output the current page number (starting from 1)
    const pageNumber = document.createElement("p");
    pageNumber.classList = "postText";
    pageNumber.innerText = number;
    pageNumber.id = "overallPage";
    pageBox.appendChild(pageNumber);

    // Create next page button
    const rightPage = document.createElement("button");
    rightPage.classList = "rightButton";
    rightPage.innerText = ">";
    rightPage.addEventListener("click", () => {
      changePage(apiUrl, number + 1);
    });
    pageBox.appendChild(rightPage);
  }
}
