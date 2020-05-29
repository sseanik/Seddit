// Check and create follow feature
export function createFollowers(apiUrl, username) {
  // Check if following or not following a user
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      username: username,
    },
    method: "PUT",
  };
  fetch(`${apiUrl}/user/follow?username=${username}`, options)
    .then((res) => res.json())
    .then((json) => {
      // Remove button and replace with follow
      document.getElementById("followButton").remove();
      const followUser = document.createElement("button");
      followUser.classList = "button";
      followUser.innerText = "Follow";
      followUser.addEventListener("click", () => {
        unfollowUser(apiUrl, username);
      });
      followUser.id = "followButton";
      document.getElementById("profileButtons").appendChild(followUser);
    });
}

// Check and create unfollow feature
export function unfollowUser(apiUrl, username) {
  // Check if following or not following a user
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      username: username,
    },
    method: "PUT",
  };
  fetch(`${apiUrl}/user/follow?username=${username}`, options)
    .then((res) => res.json())
    .then((json) => {
      document.getElementById("followButton").remove();
      // Remove button and replace with unfollow
      const followUser = document.createElement("button");
      followUser.classList = "button";
      followUser.innerText = "Unfollow";
      followUser.addEventListener("click", () => {
        createFollowers(apiUrl, username);
      });
      followUser.id = "followButton";
      document.getElementById("profileButtons").appendChild(followUser);
    });
}
