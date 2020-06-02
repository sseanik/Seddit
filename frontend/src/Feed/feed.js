import { createBasePage } from "./base.js";
import { grabSubseddit } from "./subseddit.js";
import { toggleFeed, toggleLoader } from "./reset.js";
import { upvotePost, downVotePost, showUserVotes } from "../Post/vote.js";
import { removePost, createPost, showPost } from "../Post/post.js";
import { showUserPage } from "../User/profile.js";

// Add posts to a feed
export function addFeedPosts(num, apiUrl) {
  // Grab 6 posts from a user's feed
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      p: num,
      n: 6,
    },
    method: "GET",
  };
  toggleLoader(true);
  fetch(`${apiUrl}/user/feed?p=${num}&n=6`, options)
    .then((res) => res.json())
    .then((myJson) => {
      // If there are no posts to fetch, return
      if (!myJson.posts.length) {
        return;
      }
      // Loop through each post
      for (let i = 0; i < 6; i++) {
        // If the post is out of bounds of array, break
        if (!myJson.posts[i]) {
          break;
        }
        // Create and display the new post
        createFeedPost(myJson.posts[i], apiUrl, 1);
      }
      toggleLoader(false);
    });
}

// Create and display feed post
export function createFeedPost(myJson, apiUrl, check) {
  // Create a feed post
  let feedPost = document.createElement("li");
  feedPost.classList = "post";
  feedPost.setAttribute("data-id-post", myJson.id);

  // If the feed is the users or the public feed
  if (check === 0 || check === 1) {
    feed.appendChild(feedPost);
  }
  // If the feed is another user's profile
  else if (check === 2 && document.getElementById("otherProfile")) {
    document.getElementById("otherProfile").appendChild(feedPost);
  }
  // If the feed is the current user's profile
  else if (check === 3) {
    document.getElementById("profileWrapper").appendChild(feedPost);
  }
  // If the feed is the search feed
  else if (check === 4) {
    document.getElementById("foundPosts").appendChild(feedPost);
  }
  // If the feed is the subseddit feed
  else if (check === 5) {
    if (document.getElementById("subsedditFeed")) {
      document.getElementById("subsedditFeed").appendChild(feedPost);
    }
  }

  // Create upvote/downvote section
  let vote = document.createElement("div");
  vote.classList = "vote";
  feedPost.appendChild(vote);

  // If the user is logged and an upvote/downvote has already been made
  if (localStorage.getItem("token") && check === 1) {
    // Check if the user has voted on a post
    let checkUser = document.getElementById("profileName");
    let checkUserId = parseInt(checkUser.attributes.check.value);
    let included = myJson.meta.upvotes.includes(checkUserId);

    // Create upvote triangle
    const upvote = document.createElement("div");
    upvote.id = "upVote" + myJson.id;
    // If the user has not already voted, set to active
    if (!included) {
      upvote.classList = "frontUpArrow";
      const upFunction = function (event) {
        upvotePost(myJson, apiUrl, upFunction);
      };
      upvote.setAttribute("checked", 0);
      upvote.addEventListener("click", upFunction);
    } else {
      upvote.classList = "frontDisUp";
      upvote.setAttribute("checked", 1);
    }
    vote.appendChild(upvote);

    // Number of upvotes a post has
    let sum = myJson.meta.upvotes.length;
    // Display upvote number
    const voteNumber = document.createElement("p");
    voteNumber.innerText = sum;
    voteNumber.id = "voteNum" + myJson.id;
    voteNumber.addEventListener("click", () => {
      // If number is clicked, display vote information modal
      showUserVotes(myJson, apiUrl);
    });
    vote.appendChild(voteNumber);

    // Create downvote triangle
    const downvote = document.createElement("div");
    downvote.classList = "frontDownArrow";
    downvote.id = "downVote" + myJson.id;
    // If the user has not already voted, set to active
    if (included) {
      const downFunction = () => {
        downVotePost(myJson, apiUrl, downFunction);
      };
      downvote.setAttribute("checked", 0);
      downvote.addEventListener("click", downFunction);
    } else {
      downvote.setAttribute("checked", 1);
    }
    vote.appendChild(downvote);
  }
  // If user is not logged in
  else {
    // Display total number of post upvotes
    let sum = myJson.meta.upvotes.length;
    const voteNumber = document.createElement("p");
    voteNumber.innerText = sum;
    voteNumber.id = "voteNum" + myJson.id;
    vote.appendChild(voteNumber);
  }

  // Create thumbnail wrapper
  let imageBox = document.createElement("div");
  imageBox.classList = "thumbnail";
  imageBox.addEventListener("click", () => {
    // Click through to access post
    if (document.getElementById("postTree" + myJson.id)) {
      toggleFeed(1);
      document.getElementById("postTree" + myJson.id).style.display = "";
      document.getElementById("subsedditHeading").innerText =
        myJson.meta.subseddit;
    } else {
      toggleFeed();
      showPost(myJson, apiUrl);
    }
  });
  feedPost.appendChild(imageBox);

  // Generate thumbnail image
  let image = document.createElement("img");
  // If feed post has a thumbnail
  if (myJson.thumbnail) {
    let imagePrepend = "data:image/jpeg;base64,";
    image.src = imagePrepend + myJson.thumbnail;
    imageBox.appendChild(image);
  }
  // If not, create a thumbnail
  else {
    imageBox.classList = "createThumb";
    imageBox.innerText = "Seddit";
  }

  // Create post Title wrapper
  let postBox = document.createElement("div");
  postBox.id = "title";
  feedPost.appendChild(postBox);

  // Display post title
  let postTitle = document.createElement("h4");
  postTitle.innerText = myJson.title;
  postTitle.classList = "post-title alt-text";
  postTitle.addEventListener("click", () => {
    // Click through to access post
    if (document.getElementById("postTree" + myJson.id)) {
      toggleFeed(1);
      document.getElementById("postTree" + myJson.id).style.display = "";
      document.getElementById("subsedditHeading").innerText =
        myJson.meta.subseddit;
    } else {
      showPost(myJson, apiUrl);
    }
  });
  postBox.appendChild(postTitle);

  // Create feed post detail wrapper
  let detailBox = document.createElement("div");
  detailBox.id = "detail";
  detailBox.classList = "detailBox";
  postBox.appendChild(detailBox);

  // "Posted by"
  let postedBy = document.createElement("p");
  postedBy.innerText = "Posted by ";
  postedBy.classList = "detailNormal";
  detailBox.appendChild(postedBy);

  // Display author of post
  let author = document.createElement("p");
  author.innerText = " @" + myJson.meta.author;
  author.classList = "author";
  author.addEventListener("click", () => {
    // Click through to author profile
    if (!localStorage.getItem("token")) {
      return;
    }
    toggleLoader(true);
    toggleFeed(5);
    showUserPage(apiUrl, myJson.meta.author);
  });
  detailBox.appendChild(author);

  // "in"
  let inSubseddit = document.createElement("p");
  inSubseddit.innerText = "in ";
  inSubseddit.classList = "detailNormal";
  detailBox.appendChild(inSubseddit);

  // Display subseddit
  let subseddit = document.createElement("p");
  subseddit.innerText = myJson.meta.subseddit;
  subseddit.classList = "detailOther";
  subseddit.addEventListener("click", () => {
    // Click through to subseddit feed
    if (!localStorage.getItem("token")) {
      return;
    }
    toggleLoader(true);
    grabSubseddit(apiUrl, myJson.meta.subseddit);
  });
  detailBox.appendChild(subseddit);

  // Calculate and display date of post
  let time = new Date(myJson.meta.published * 1000);
  let postedTime = document.createElement("p");
  postedTime.innerText = time;
  postedTime.classList = "feedDate";
  postBox.appendChild(postedTime);

  // If not current user's feed
  if (check != 3) {
    let blankBox = document.createElement("div");
    blankBox.id = "space";
    blankBox.classList = "extraSpace";
    blankBox.addEventListener("click", () => {
      // Set blank box to post
      if (document.getElementById("postTree" + myJson.id)) {
        toggleFeed(1);
        document.getElementById("postTree" + myJson.id).style.display = "";
        document.getElementById("subsedditHeading").innerText =
          myJson.meta.subseddit;
      } else {
        showPost(myJson, apiUrl);
      }
    });
    feedPost.appendChild(blankBox);
  } else {
    // If current user's feed add edit/delete options for posts
    let editDelete = document.createElement("div");
    editDelete.classList = "editDelete";
    feedPost.appendChild(editDelete);

    // Create edit button
    let editPost = document.createElement("button");
    editPost.id = "editPost";
    editPost.innerText = "Edit";
    editPost.classList = "sideBar";
    editPost.addEventListener("click", () => {
      createPost(apiUrl, myJson);
    });
    editDelete.appendChild(editPost);

    // Create delete button
    let deletePost = document.createElement("button");
    deletePost.id = "deletePost";
    deletePost.innerText = "Delete";
    deletePost.classList = "sideBar";
    deletePost.addEventListener("click", () => {
      removePost(apiUrl, myJson, feedPost);
    });
    editDelete.appendChild(deletePost);
  }
}

// Change current feed page
export function changePage(apiUrl, num) {
  let pageNum = document.getElementById("overallPage");

  // Do not let page go before 1
  if (parseInt(pageNum.innerText) === 1 && num <= 0) {
    return;
  }

  let page = (num - 1) * 6;

  // Grab the previous/next 6 feed items
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      p: page,
      n: 6,
    },
    method: "GET",
  };
  toggleLoader(true);
  fetch(`${apiUrl}/user/feed?p=${page}&n=6`, options)
    .then((res) => res.json())
    .then((myJson) => {
      // If there are no more posts, return
      if (myJson.posts.length === 0) {
        return;
      }
      // Add to feed and update page number
      else {
        document.getElementById("mainFeed").remove();
        createBasePage(apiUrl, page);
        pageNum.innerText = parseInt(pageNum.innerText) - 1;
      }
      toggleLoader(false);
    });
}
