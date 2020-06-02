import { toggleFeed, toggleLoader } from "./reset.js";
import { getUserInfo } from "../User/user.js";
import { createFeedPost } from "./feed.js";
import { getPostInfo } from "../Post/post.js";

// Show search feed of a given search query
export function showSearchPosts(apiUrl) {
  if (!localStorage.getItem("token")) {
    return;
  }

  // Grab the search query from the search bar input
  const searchTerm = document.getElementById("searchInput").value;
  document.getElementById("feed").style.display = "none";

  // Create a search feed wrapper
  const searchFeed = document.createElement("div");
  searchFeed.classList = "publicPost";
  searchFeed.id = "searchFeed";
  root.appendChild(searchFeed);

  // Create search button header
  const searchBack = document.createElement("div");
  searchBack.classList = "feed-header";
  searchBack.id = "searchBack";
  searchFeed.appendChild(searchBack);

  // Create back button
  const searchBackButton = document.createElement("button");
  searchBackButton.classList = "button backComment";
  searchBackButton.innerText = "Back";
  // When clicked, go back to previous session
  searchBackButton.addEventListener("click", () => {
    toggleFeed();
  });
  searchBack.appendChild(searchBackButton);

  // Create post wrapper
  const foundPosts = document.createElement("div");
  foundPosts.id = "foundPosts";
  searchFeed.appendChild(foundPosts);

  let subHeading = document.getElementById("subsedditHeading");
  let sum = 0;
  // Gather all posts that contain the search query
  getUserInfo(apiUrl).then((json) => {
    for (let i = 0; i < json.following.length; i++) {
      // Loop through each of the user's available posts
      getUserInfo(apiUrl, json.following[i]).then((myJson) => {
        for (let j = 0; j < myJson.posts.length; j++) {
          // Loop through each post details
          getPostInfo(apiUrl, myJson.posts[j]).then((searchJson) => {
            // If search word is found, increment sum and add post to feed
            if (searchJson.text.includes(searchTerm)) {
              createFeedPost(searchJson, apiUrl, 4);
              sum++;
            }
            // If sum is equal to 1, word result should be singular
            if (sum === 1) {
              subHeading.innerText = "1 result for '" + searchTerm + "'";
            }
            // If the sum is greater than 1, word result is plural
            else {
              subHeading.innerText = sum + " results for '" + searchTerm + "'";
            }
          });
        }
      });
    }
  toggleLoader(false);
  });
}
