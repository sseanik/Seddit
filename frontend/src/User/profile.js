import { updateStatus, getUserInfo } from "./user.js";
import { createFollowers, unfollowUser } from "./follow.js";
import { createFeedPost } from "../Feed/feed.js";
import { getPostInfo } from "../Post/post.js";
import { toggleFeed } from "../Feed/reset.js";

// Display upvote profile modal
export function updateProfile(apiUrl, json) {
  // Create update profile modal
  const updateModal = document.createElement("div");
  updateModal.id = "updateModal";
  updateModal.classList = "modal";
  root.appendChild(updateModal);

  // Create form
  const updateForm = document.createElement("div");
  updateForm.classList = "modal-content";
  updateModal.appendChild(updateForm);

  const updateBox = document.createElement("div");
  updateBox.id = "updateBox";
  updateBox.classList = "container";
  updateForm.appendChild(updateBox);

  // Input field to update email
  const updateEmail = document.createElement("label");
  updateEmail.innerText = "Update Email:";
  updateBox.appendChild(updateEmail);

  // Top right hand corner x to close modal
  const closeUpdate = document.createElement("span");
  closeUpdate.classList = "updateClose";
  closeUpdate.innerText = "x";
  closeUpdate.id = "closeUpdate";
  updateBox.appendChild(closeUpdate);

  const emailInput = document.createElement("input");
  emailInput.id = "emailInput";
  emailInput.placeholder = "Enter Email";
  emailInput.setAttribute("type", "text");
  updateBox.appendChild(emailInput);

  // Input field to update name
  const updateName = document.createElement("label");
  updateName.innerText = "Update Name:";
  updateBox.appendChild(updateName);

  const nameInput = document.createElement("input");
  nameInput.id = "nameInput";
  nameInput.placeholder = "Enter Name";
  nameInput.setAttribute("type", "text");
  updateBox.appendChild(nameInput);

  // Input field to update password
  const updatePass = document.createElement("label");
  updatePass.innerText = "Update Password";
  updateBox.appendChild(updatePass);

  const updatePassOne = document.createElement("input");
  updatePassOne.id = "updatePassOne";
  updatePassOne.placeholder = "Enter Password";
  updatePassOne.setAttribute("type", "password");
  updateBox.appendChild(updatePassOne);

  // Secondary password field
  const updatePassTwo = document.createElement("input");
  updatePassTwo.id = "updatePassTwo";
  updatePassTwo.placeholder = "Confirm Password";
  updatePassTwo.setAttribute("type", "password");
  updateBox.appendChild(updatePassTwo);

  // Update submit button
  const updateButton = document.createElement("button");
  updateButton.innerText = "Update";
  updateButton.classList = "loginButton";
  updateButton.addEventListener("click", () => {
    updateStatus(apiUrl);
  });
  updateBox.appendChild(updateButton);

  // If user generates an error, display in modal
  const updateError = document.createElement("div");
  updateError.id = "updateError";
  updateError.classList = "loginError";
  updateBox.appendChild(updateError);

  // If clicked x or outside modal, close modal
  window.addEventListener("click", function (event) {
    if (event.target == updateModal || event.target == closeUpdate) {
      updateModal.style.display = "none";
      updateError.innerText = "";
    }
  });
  updateModal.style.display = "inline";
}

// Generate a user's page
export function showUserPage(apiUrl, username) {
  if (!localStorage.getItem("token")) {
    return;
  }

  // Grab user's information
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      username: username,
    },
    method: "GET",
  };
  fetch(`${apiUrl}/user/?username=${username}`, options)
    .then((res) => res.json())
    .then((json) => {
      getUserInfo(apiUrl, json.id).then((json) => {
        // Hide feed
        document.getElementById("feed").style.display = "none";
        const profileWrapper = document.createElement("div");
        profileWrapper.classList = "publicPost";
        profileWrapper.id = "otherProfile";
        root.appendChild(profileWrapper);

        // Create profile button wrapper
        const profileButtons = document.createElement("div");
        profileButtons.classList = "feed-header";
        profileButtons.id = "profileButtons";
        profileWrapper.appendChild(profileButtons);

        // Create back button
        const profileBack = document.createElement("button");
        profileBack.classList = "button";
        profileBack.innerText = "Back";
        profileBack.addEventListener("click", () => {
          // When clicked, go back to previous session
          profileWrapper.remove();
          document.getElementById("feed").style.display = "";
          document.getElementById("pagination").style.display = "";
          window.scrollTo(0, 0);
        });
        profileButtons.appendChild(profileBack);

        // Create follow user button
        const followUser = document.createElement("button");
        followUser.classList = "button";

        // Check if following user or not
        let checkFol = document.getElementsByClassName("followListItem");
        if (checkFol[0].innerText === json.name + ", ") {
          followUser.innerText = "Unfollow";
          followUser.addEventListener("click", () => {
            createFollowers(apiUrl, username);
          });
        } else {
          followUser.innerText = "Follow";
          followUser.addEventListener("click", () => {
            unfollowUser(apiUrl, username);
          });
        }
        followUser.id = "followButton";
        profileButtons.appendChild(followUser);

        // Create profile wrapper
        const profileBox = document.createElement("div");
        profileBox.classList = "submitPost";
        profileWrapper.appendChild(profileBox);

        // Display user's username
        const profileUsername = document.createElement("p");
        profileUsername.innerText = "Username:  ";
        profileUsername.classList = "profileTitle";
        profileBox.appendChild(profileUsername);

        const profileUser = document.createElement("p");
        profileUser.innerText = json.username;
        profileUser.classList = "profileInfo";
        profileUsername.appendChild(profileUser);

        // Display user's email
        const profileEmail = document.createElement("p");
        profileEmail.innerText = "Email:";
        profileEmail.classList = "profileTitle";
        profileBox.appendChild(profileEmail);

        const emailAddress = document.createElement("p");
        emailAddress.innerText = json.email;
        emailAddress.id = "emailAddress";
        emailAddress.classList = "profileInfo";
        profileEmail.appendChild(emailAddress);

        // Display user's name
        const profileRealName = document.createElement("p");
        profileRealName.innerText = "Name:  ";
        profileRealName.classList = "profileTitle";
        profileRealName.id = "profileRealName";
        profileBox.appendChild(profileRealName);

        const realName = document.createElement("p");
        realName.innerText = json.name;
        realName.classList = "profileInfo";
        realName.id = "realNameOut";
        profileRealName.appendChild(realName);

        // Display user's user id
        const profileId = document.createElement("p");
        profileId.innerText = "User ID: ";
        profileId.classList = "profileTitle";
        profileBox.appendChild(profileId);

        const profileIdNum = document.createElement("p");
        profileIdNum.innerText = json.id;
        profileIdNum.classList = "profileInfo";
        profileId.appendChild(profileIdNum);

        // Display user's number of followers
        const profileFollowers = document.createElement("p");
        profileFollowers.innerText = "Number of Followers:  ";
        profileFollowers.classList = "profileTitle";
        profileFollowers.id = "followerChange";
        profileBox.appendChild(profileFollowers);

        const followedNum = document.createElement("p");
        followedNum.innerText = json.followed_num;
        followedNum.classList = "profileInfo";
        profileFollowers.appendChild(followedNum);

        // Display user's number of following
        const followingNum = document.createElement("p");
        followingNum.innerText = "Following:  ";
        followingNum.classList = "profileTitle";
        profileBox.appendChild(followingNum);

        const numFollowing = document.createElement("p");
        numFollowing.innerText = json.following.length;
        numFollowing.classList = "profileInfo";
        followingNum.appendChild(numFollowing);

        // Display the user of each followed user
        for (let i = 0; i < json.posts.length; i++) {
          getPostInfo(apiUrl, json.posts[i]).then((myJson) => {
            createFeedPost(myJson, apiUrl, 2);
          });
        }
      });
    });
}

// Create profile page for logged in user
export function profilePage(apiUrl, username) {
  if (!localStorage.getItem("token")) {
    return;
  }

  // Grab user details
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
      getUserInfo(apiUrl, json.id).then((json) => {
        // Create profile wrapper
        const profileWrapper = document.createElement("div");
        profileWrapper.classList = "publicPostExtra";
        profileWrapper.style.display = "none";
        profileWrapper.id = "profileWrapper";
        root.appendChild(profileWrapper);

        // Create button wrapper
        const profileButtons = document.createElement("div");
        profileButtons.classList = "feed-header";
        profileWrapper.appendChild(profileButtons);

        // Create back button
        const profileBack = document.createElement("button");
        profileBack.classList = "button backComment";
        profileBack.innerText = "Back";
        // When clicked, go back to previous session
        profileBack.addEventListener("click", () => {
          toggleFeed();
          document.getElementById("mainFeed").style.display = "";
          document.getElementById("pagination").style.display = "";
          window.scrollTo(0, 0);
        });
        profileButtons.appendChild(profileBack);

        // Create edit profile button
        const editProfile = document.createElement("button");
        editProfile.classList = "button backComment";
        editProfile.innerText = "Update Profile";
        editProfile.addEventListener("click", () => {
          updateProfile(apiUrl, json);
        });
        profileButtons.appendChild(editProfile);

        // Create post wrapper
        const profileBox = document.createElement("div");
        profileBox.classList = "submitPost";
        profileWrapper.appendChild(profileBox);

        // Display user's details
        const profileUsername = document.createElement("p");
        profileUsername.innerText = "Username:  ";
        profileUsername.classList = "profileTitle";
        profileBox.appendChild(profileUsername);

        // Display username
        const profileUser = document.createElement("p");
        profileUser.innerText = json.username;
        profileUser.classList = "profileInfo";
        profileUsername.appendChild(profileUser);

        // Display email
        const profileEmail = document.createElement("p");
        profileEmail.innerText = "Email:";
        profileEmail.classList = "profileTitle";
        profileBox.appendChild(profileEmail);

        const emailAddress = document.createElement("p");
        emailAddress.innerText = json.email;
        emailAddress.id = "emailAddress";
        emailAddress.classList = "profileInfo";
        profileEmail.appendChild(emailAddress);

        // Display name
        const profileRealName = document.createElement("p");
        profileRealName.innerText = "Name:  ";
        profileRealName.classList = "profileTitle";
        profileRealName.id = "profileRealName";
        profileBox.appendChild(profileRealName);

        const realName = document.createElement("p");
        realName.innerText = json.name;
        realName.classList = "profileInfo";
        realName.id = "realNameOut";
        profileRealName.appendChild(realName);

        // Display user id
        const profileId = document.createElement("p");
        profileId.innerText = "User ID: ";
        profileId.classList = "profileTitle";
        profileBox.appendChild(profileId);

        const profileIdNum = document.createElement("p");
        profileIdNum.innerText = json.id;
        profileIdNum.classList = "profileInfo";
        profileId.appendChild(profileIdNum);

        // Display number of followers
        const profileFollowers = document.createElement("p");
        profileFollowers.innerText = "Number of Followers:  ";
        profileFollowers.classList = "profileTitle";
        profileBox.appendChild(profileFollowers);

        const followedNum = document.createElement("p");
        followedNum.innerText = json.followed_num;
        followedNum.classList = "profileInfo";
        profileFollowers.appendChild(followedNum);

        // Display number of following
        const followingNum = document.createElement("p");
        followingNum.innerText = "Following:  ";
        followingNum.classList = "profileTitle";
        profileBox.appendChild(followingNum);

        const numFollowing = document.createElement("p");
        numFollowing.innerText = json.following.length;
        numFollowing.classList = "profileInfo";
        followingNum.appendChild(numFollowing);

        let followBox = document.createElement("div");
        followBox.classList = "followingList";
        profileBox.appendChild(followBox);

        // Create list of followed users
        for (let j = 0; j < json.following.length; j++) {
          let followUser = document.createElement("p");
          getUserInfo(apiUrl, json.following[j]).then((json) => {
            followUser.innerText = json.username + ", ";
          });
          followUser.classList = "followListItem";
          followBox.appendChild(followUser);
        }

        // Generate posts the user has made overall
        for (let i = 0; i < json.posts.length; i++) {
          getPostInfo(apiUrl, json.posts[i]).then((myJson) => {
            createFeedPost(myJson, apiUrl, 3);
          });
        }
      });
    });
}
