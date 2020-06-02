import { toggleFeed, toggleLoader } from "./reset.js";
import { createPost, getPostInfo } from "../Post/post.js";
import { getUserInfo } from "../User/user.js";
import { createFeedPost } from "./feed.js";

// Create subseddit feed skeleton
export function buildSubsedditPosts(apiUrl, subHeading) {
  // Hide current feed
  toggleFeed(5);
  document.getElementById("feed").style.display = "none";

  // Update the banner subseddit heading
  document.getElementById("subsedditHeading").innerText = subHeading;

  // Create subseddit feed list
  const subsedditFeed = document.createElement("ul");
  subsedditFeed.id = "subsedditFeed";
  subsedditFeed.classList = "subsedditFeed";
  root.appendChild(subsedditFeed);

  // Create subseddit feed header
  const subFeedHeader = document.createElement("div");
  subFeedHeader.classList = "feed-header";
  subsedditFeed.appendChild(subFeedHeader);

  // Create back button
  const subBackButton = document.createElement("button");
  subBackButton.classList = "button button-primary";
  subBackButton.innerText = "Back";
  subBackButton.addEventListener("click", () => toggleFeed(7));
  subsedditFeed.appendChild(subBackButton);

  // Create post to subseddit button
  const postButton = document.createElement("button");
  postButton.classList = "button button-secondary";
  postButton.innerText = "Post";
  postButton.addEventListener("click", () => {
    createPost(apiUrl, false, subHeading.innerText);
  });
  subsedditFeed.appendChild(postButton);
}

// Determine and create subseddit feed
export function grabSubseddit(apiUrl, subseddit) {
  // If user is not logged in return
  if (!localStorage.getItem("token")) {
    return;
  }

  let found = 0;
  let subHeading = document.getElementById("subsedditHeading");
  let valueText = subHeading.innerText;
  // If subseddit header is empty, readd subseddit name
  if (subHeading.innerText === "") {
    valueText = subseddit;
  }

  // Grab the user info of the user logged in
  getUserInfo(apiUrl).then((json) => {
    // Loop through each following id;
    for (let i = 0; i < json.following.length; i++) {
      // Grab the user info of each followed person
      getUserInfo(apiUrl, json.following[i]).then((myJson) => {
        for (let j = 0; j < myJson.posts.length; j++) {
          // Grab the post info
          getPostInfo(apiUrl, myJson.posts[j]).then((searchJson) => {
            // If subseddit name matches subseddit post
            if (valueText === searchJson.meta.subseddit && found === 0) {
              found = 1;
              // Initialise subseddit feed
              buildSubsedditPosts(apiUrl, valueText);
              createFeedPost(searchJson, apiUrl, 5);
            }
            // If feed already initialised add subseddit post
            else if (valueText === searchJson.meta.subseddit) {
              createFeedPost(searchJson, apiUrl, 5);
            }
        
          });
        }
      });
    }
    toggleLoader(false);
  });
}
