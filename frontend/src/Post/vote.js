import { getUserInfo } from "../User/user.js";

// Upvote a post live function
export function upvotePost(myJson, apiUrl, upFunction) {
  // Grab all current vote details
  let voteNum = document.getElementById("voteNum" + myJson.id);
  let liveNum = voteNum.innerText;
  let upvote = document.getElementById("upVote" + myJson.id);
  let downvote = document.getElementById("downVote" + myJson.id);
  // Store downvote function to remove later
  let downFunction = () => {
    downVotePost(myJson, apiUrl, downFunction);
  };
  let showVoteNum = document.getElementById("showVoteNum" + myJson.id);
  let showDownVote = document.getElementById("showDownvote" + myJson.id);
  let showUpvote = document.getElementById("showUpvote" + myJson.id);

  // Send request to upvote a post
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      id: myJson.id,
    },
    method: "PUT",
  };
  fetch(`${apiUrl}/post/vote?id=${myJson.id}`, options).then((response) => {
    response.json().then((json) => {
      // Live update the vote count and remove and readd event listeners
      // to prevent double voting
      voteNum.innerText = parseInt(liveNum) + 1;
      upvote.classList = "frontDisUp";
      downvote.classList = "frontDownArrow";
      upvote.removeEventListener("click", upFunction);
      downvote.addEventListener("click", downFunction);
      // Store vote information
      upvote.setAttribute("checked", 1);
      downvote.setAttribute("checked", 0);
      // If user has voted on the inner post
      if (showVoteNum) {
        // Change vote number
        showVoteNum.innerText = parseInt(liveNum) + 1;
        showUpvote.classList = "showDisUp";
        showDownVote.classList = "downArrow";
        // Shift vote event listeners
        showUpvote.removeEventListener("click", upFunction);
        showDownVote.removeEventListener("click", downFunction);
        showDownVote.addEventListener("click", downFunction);
      }
    });
  });
}

// Upvote a post live function
export function downVotePost(myJson, apiUrl, downFunction) {
  // Grab all current vote details
  let voteNum = document.getElementById("voteNum" + myJson.id);
  let liveNum = voteNum.innerText;
  let downvote = document.getElementById("downVote" + myJson.id);
  let upvote = document.getElementById("upVote" + myJson.id);
  // Store upvote function to remove later
  let upFunction = () => {
    upvotePost(myJson, apiUrl, upFunction);
  };
  let showVoteNum = document.getElementById("showVoteNum" + myJson.id);
  let showDownVote = document.getElementById("showDownvote" + myJson.id);
  let showUpvote = document.getElementById("showUpvote" + myJson.id);

  // Send request to downvote a post
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      id: myJson.id,
    },
    method: "DELETE",
  };
  fetch(`${apiUrl}/post/vote?id=${myJson.id}`, options).then((response) => {
    response.json().then((json) => {
      // Live update the vote count and remove and readd event listeners
      // to prevent double voting
      voteNum.innerText = parseInt(liveNum) - 1;
      downvote.classList = "frontDisDown";
      upvote.classList = "frontUpArrow";
      // Remove event listener on downvote
      downvote.removeEventListener("click", downFunction);
      upvote.addEventListener("click", upFunction);
      upvote.setAttribute("checked", 0);
      downvote.setAttribute("checked", 1);
      // If user has voted on the inner post
      if (showVoteNum) {
        // Change vote number
        showVoteNum.innerText = parseInt(liveNum) - 1;
        showDownVote.classList = "showDisDown";
        showUpvote.classList = "upArrow";
        // Shift vote event listeners
        showDownVote.removeEventListener("click", downFunction);
        showUpvote.removeEventListener("click", upFunction);
        showUpvote.addEventListener("click", upFunction);
      }
    });
  });
}

// Show upvotes modal
export function showUserVotes(myJson, apiUrl) {
  // Create modal to show user's that have upvoted a post
  const userVoteModal = document.createElement("div");
  userVoteModal.id = "userVoteModal";
  userVoteModal.classList = "voteModal";
  root.appendChild(userVoteModal);

  // Create modal wrapper
  const userVoteWrapper = document.createElement("div");
  userVoteWrapper.classList = "voteModalContent";
  userVoteModal.appendChild(userVoteWrapper);

  const userVoteBox = document.createElement("div");
  userVoteBox.id = "userVoteBox";
  userVoteWrapper.appendChild(userVoteBox);

  // Modal heading
  const userVoteLabel = document.createElement("label");
  userVoteLabel.innerText = "Users who upvoted this post:";
  userVoteBox.appendChild(userVoteLabel);

  // Modal x button
  const closeVoteModal = document.createElement("span");
  closeVoteModal.classList = "VoteClose";
  closeVoteModal.innerText = "x";
  userVoteBox.appendChild(closeVoteModal);

  // Create a list of users
  const userVoteList = document.createElement("ul");
  userVoteList.classList = "voteModalList";
  userVoteBox.appendChild(userVoteList);

  // Check if the user has downvoted this post
  let checkDown = document.getElementById("downVote" + myJson.id);
  checkDown = parseInt(checkDown.attributes.checked.value);
  let profile = document.getElementById("profileName");
  let num = parseInt(profile.attributes.check.value);
  let found = 0;
  for (let i = 0; i < myJson.meta.upvotes.length; i++) {
    // If the upvote user id matches the user's id
    if (myJson.meta.upvotes[i] === parseInt(num)) {
      found = 1;
    }
    let checkUser = getUserInfo(apiUrl, myJson.meta.upvotes[i]);
    checkUser.then((json) => {
      // If the upvote has already downvoted this post (live)
      if (checkDown === 1 && json.id === parseInt(num)) {
        return;
      } else {
        let userVoteName = document.createElement("li");
        userVoteName.innerText = json.username;
        userVoteList.appendChild(userVoteName);
      }
    });
  }

  // Check if the user has upvoted this post
  let checkUp = document.getElementById("upVote" + myJson.id);
  checkUp = parseInt(checkUp.attributes.checked.value);
  if (found === 0 && checkUp === 1) {
    let userVoteName = document.createElement("li");
    userVoteName.innerText = profile.innerText;
    userVoteList.appendChild(userVoteName);
  }

  // Allow the modal to exit when x is clicked or outside modal window
  window.addEventListener("click", function (event) {
    if (event.target == userVoteModal || event.target == closeVoteModal) {
      userVoteModal.remove();
    }
  });
}
