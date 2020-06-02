import { toggleFeed } from "../Feed/reset.js";
import { upvotePost, downVotePost, showUserVotes } from "./vote.js";
import { postComment } from "./comment.js";

// Grab post information from post id
export function getPostInfo(apiUrl, id) {
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      id: id,
    },
    method: "GET",
  };
  return fetch(`${apiUrl}/post/?id=${id}`, options)
    .then((res) => res.json())
    .then((json) => {
      return json;
    });
}

// Delete a user's post
export function removePost(apiUrl, myJson, feedPost) {
  // Output confirm prompt before proceeding
  let confirmAlert = confirm("This post will be permanently deleted");
  // If okay is selected
  if (confirmAlert === true) {
    let options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
        id: myJson.id,
      },
      method: "DELETE",
    };
    fetch(`${apiUrl}/post/?id=${myJson.id}`, options)
      .then((res) => res.json())
      .then((json) => {
        // Delete post
        feedPost.remove();
      });
  }
  // If cancel is selected
  else {
    return;
  }
}

export function showPost(myJson, apiUrl) {
  // Save previous scroll position
  const scrollPosition = window.pageYOffset;
  // Calculate the number of upvotes in this post
  let sum = document.getElementById("voteNum" + myJson.id);
  // Temporarily hide feed
  toggleFeed(1);
  // Scroll to top
  window.scrollTo(0, 0);

  // Create post wrapper
  const postDiv = document.createElement("div");
  postDiv.classList = "publicPost";
  document.getElementById("mainFeed").appendChild(postDiv);

  // Add subseddit name to banner
  const subheader = document.getElementById("subsedditHeading");
  subheader.innerText = myJson.meta.subseddit;

  // Create button header
  const buttonHeader = document.createElement("div");
  buttonHeader.classList = "feed-header";
  postDiv.appendChild(buttonHeader);

  // Create back button
  const backButton = document.createElement("button");
  backButton.classList = "button";
  backButton.innerText = "Back";
  // When click, go back to previous session
  backButton.addEventListener("click", () => {
    let num = document.getElementById("showVoteNum" + myJson.id).innerText;
    sum.innerText = num;
    postDiv.remove();
    subheader.innerText = "";
    toggleFeed(7);
    window.scrollTo(0, scrollPosition);
  });
  buttonHeader.appendChild(backButton);

  // Create comment button
  const commentButton = document.createElement("button");
  commentButton.classList = "button backComment";
  commentButton.innerText = "Comment";
  commentButton.addEventListener("click", function () {
    if (document.getElementById("commentWrap")) {
      document.getElementById("commentWrap").remove();
    }
    postComment(apiUrl, myJson);
  });
  buttonHeader.appendChild(commentButton);

  // If post contains picture, display
  if (myJson.image) {
    // Create image wrapper
    const postImage = document.createElement("div");
    postImage.classList = "postImage";
    postDiv.appendChild(postImage);
    // Display image
    const image = document.createElement("img");
    image.classList = "postImage";
    image.src = "data:image/jpeg;base64," + myJson.image;
    postImage.appendChild(image);
  }

  // Create post wrapper
  const commentPost = document.createElement("li");
  commentPost.classList = "postComment";
  postDiv.appendChild(commentPost);

  // Create upvote/downvote box
  const commentVote = document.createElement("div");
  commentVote.classList = "vote";
  commentPost.appendChild(commentVote);

  if (localStorage.getItem("token")) {
    // Create upvote triangle
    const upvote = document.createElement("div");
    let checkUpvote = document.getElementById("upVote" + myJson.id);

    if (checkUpvote && parseInt(checkUpvote.attributes.checked.value) === 1) {
      upvote.classList = "showDisUp";
    } else {
      upvote.classList = "upArrow";
      const upFunction = function (event) {
        upvotePost(myJson, apiUrl, upFunction);
      };

      upvote.addEventListener("click", upFunction);
    }
    upvote.id = "showUpvote" + myJson.id;

    commentVote.appendChild(upvote);

    // Display the vote number
    const voteNumber = document.createElement("p");
    if (sum) {
      voteNumber.innerText = sum.innerText;
    }
    voteNumber.id = "showVoteNum" + myJson.id;
    voteNumber.addEventListener("click", () => {
      showUserVotes(myJson, apiUrl);
    });
    commentVote.appendChild(voteNumber);

    // Create downvote triangle
    const downvote = document.createElement("div");
    let checkDownvote = document.getElementById("downVote" + myJson.id);

    if (
      checkDownvote &&
      parseInt(checkDownvote.attributes.checked.value) === 1
    ) {
      downvote.classList = "showDisDown";
    } else {
      downvote.classList = "downArrow";
      const downFunction = () => {
        downVotePost(myJson, apiUrl, downFunction);
      };

      downvote.addEventListener("click", downFunction);
    }
    downvote.id = "showDownvote" + myJson.id;
    commentVote.appendChild(downvote);
  } else {
    const voteNumber = document.createElement("p");
    voteNumber.innerText = sum.innerText;
    voteNumber.id = "showVoteNum" + myJson.id;
    commentVote.appendChild(voteNumber);
  }
  // Create post wrapper
  const postBox = document.createElement("div");
  commentPost.appendChild(postBox);

  // Create title wrapper
  const titleBox = document.createElement("div");
  postBox.appendChild(titleBox);

  // Display title of post
  let postTitle = document.createElement("h2");
  postTitle.innerText = myJson.title;
  postTitle.classList = "post-title alt-text";
  titleBox.appendChild(postTitle);

  // Create post detail wrapper
  let detailBox = document.createElement("div");
  detailBox.id = "detail";
  detailBox.classList = "postCommentBox";
  postBox.appendChild(detailBox);

  let postedBy = document.createElement("p");
  postedBy.innerText = "Posted by";
  postedBy.classList = "detailNormal";
  detailBox.appendChild(postedBy);

  let author = document.createElement("p");
  author.innerText = "@" + myJson.meta.author;
  author.classList = "author";
  author.setAttribute("data-id-author", "");
  detailBox.appendChild(author);

  let time = new Date(myJson.meta.published * 1000);
  const postDate = document.createElement("p");
  postDate.innerText = "on " + time;
  postDate.classList = "detailNormal";
  detailBox.appendChild(postDate);

  const description = document.createElement("p");
  description.innerText = myJson.text;
  description.classList = "postText";
  postBox.appendChild(description);

  for (let i = 0; i < myJson.comments.length; i++) {
    let commentBox = document.createElement("div");
    commentBox.classList = "comment";
    postDiv.appendChild(commentBox);

    let commentDetails = document.createElement("div");
    commentDetails.classList = "publicLayout";
    commentBox.appendChild(commentDetails);

    let commentAuthor = document.createElement("p");
    commentAuthor.innerText = "@" + myJson.comments[i].author;
    commentDetails.appendChild(commentAuthor);

    let commentTime = new Date(myJson.comments[i].published * 1000);

    let commentDate = document.createElement("p");
    commentDate.innerText = commentTime;
    commentDetails.appendChild(commentDate);

    let commentDiv = document.createElement("div");
    commentBox.appendChild(commentDiv);

    let commentPost = document.createElement("p");
    commentPost.innerText = myJson.comments[i].comment;
    commentPost.classList = "description";
    commentDiv.appendChild(commentPost);
  }
}

// Create a post
export function createPost(apiUrl, myJson, subseddit) {
  // If user is not logged in, display an alert and return
  if (localStorage.getItem("token") === null) {
    alert("You must be logged in to post");
    return;
  }

  // Temporarily hide feed
  toggleFeed(1);
  // Scroll to top
  window.scrollTo(0, 0);

  // Create post wrapper
  const createPostDiv = document.createElement("div");
  createPostDiv.classList = "publicPost";
  createPostDiv.id = "createPost";
  document.getElementById("mainFeed").appendChild(createPostDiv);

  // Create button header
  const createPostButtons = document.createElement("div");
  createPostButtons.classList = "feed-header";
  createPostDiv.appendChild(createPostButtons);

  // Create back button
  const backButton = document.createElement("button");
  backButton.classList = "button";
  backButton.innerText = "Back";
  // When clicked, go back to previous session
  backButton.addEventListener("click", () => {
    createPostDiv.remove();
    toggleFeed(0);
    window.scrollTo(0, 0);
  });
  createPostButtons.appendChild(backButton);

  // Create comment button
  const submitButton = document.createElement("button");
  submitButton.classList = "button";
  submitButton.innerText = "Submit";
  submitButton.addEventListener("click", () => {
    // When clicked, display submit post inputs
    submitPost(apiUrl);
  });
  createPostButtons.appendChild(submitButton);

  // Create post wrapper
  const createPostWrapper = document.createElement("div");
  createPostWrapper.classList = "submitPost";
  createPostWrapper.Id = "postBoxRemove";
  createPostDiv.appendChild(createPostWrapper);

  // Display post title lable
  const postTitle = document.createElement("label");
  postTitle.innerText = "Post Title";
  createPostWrapper.appendChild(postTitle);

  // Display post title input
  const postTitleInput = document.createElement("input");
  postTitleInput.id = "postTitle";
  // If post is being edited, put previous title into input
  if (myJson) {
    postTitleInput.value = myJson.title;
  } else {
    postTitleInput.placeholder = "Enter name of your Post Title";
  }
  postTitleInput.setAttribute("type", "text");
  createPostWrapper.appendChild(postTitleInput);

  // Display subseddit label
  const subsedditTitle = document.createElement("label");
  subsedditTitle.innerText = "Subseddit";
  createPostWrapper.appendChild(subsedditTitle);

  // Display subseddit name input
  const subsedditPostInput = document.createElement("input");
  subsedditPostInput.id = "postSubseddit";
  // If post is being edited, put previous subseddit into input
  if (myJson) {
    subsedditPostInput.value = myJson.meta.subseddit;
  }
  // If posting to an existing subseddit feed, put into input
  else if (subseddit) {
    subsedditPostInput.value = subseddit;
  } else {
    subsedditPostInput.placeholder =
      "Enter name of subseddit you want to post to";
  }
  subsedditPostInput.setAttribute("type", "text");
  createPostWrapper.appendChild(subsedditPostInput);

  // Display image label
  const imageTitle = document.createElement("label");
  imageTitle.innerText = "Image (optional)";
  createPostWrapper.appendChild(imageTitle);

  // Display upload image submit file input
  const imagePostInput = document.createElement("input");
  imagePostInput.id = "postImage";
  imagePostInput.classList = "uploadImage";
  imagePostInput.setAttribute("type", "file");
  createPostWrapper.appendChild(imagePostInput);

  // Display description label
  const descriptionTitle = document.createElement("label");
  descriptionTitle.innerText = "Text";
  createPostWrapper.appendChild(descriptionTitle);

  // Display description resizeable text box for input
  const postDescription = document.createElement("textarea");
  postDescription.id = "postDescription";
  postDescription.classList = "postDescription";
  // If post is being edited, put previous description into input
  if (myJson) {
    postDescription.innerText = myJson.text;
  } else {
    postDescription.placeholder = "Enter text contents of your post";
  }
  createPostWrapper.appendChild(postDescription);

  // Create submit post button
  const bottomSubmit = document.createElement("button");
  bottomSubmit.classList = "submitButton";
  bottomSubmit.innerText = "Submit";
  bottomSubmit.addEventListener("click", () => {
    // Send request to submit post when clicked
    submitPost(apiUrl, myJson);
  });
  createPostWrapper.appendChild(bottomSubmit);
}

// Submit a post
export function submitPost(apiUrl, myJson) {
  // Grab submit post data from input field
  const title = document.getElementById("postTitle").value;
  const subseddit = document.getElementById("postSubseddit").value;
  const image = document.getElementById("postImage").files[0];
  const text = document.getElementById("postDescription").value;

  // If any of the fields were empty, sned alert and return
  if (!title || !subseddit || !text) {
    alert("Must not have an empty text field");
    return;
  }

  // If image is defined and post is being edited
  if (image && myJson) {
    // Use filereader to read image
    const reader = new FileReader();
    reader.onloadend = () => {
      // Convert image to base 64 and strip of preprend details
      let extract = reader.result.replace("data:image/jpeg;base64,", "");
      // Send request to server to upload image and submit post
      let options = {
        method: "PUT",
        body: JSON.stringify({
          title: title,
          text: text,
          subseddit: subseddit,
          image: extract,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
          id: myJson.id,
        },
      };
      fetch(`${apiUrl}/post/?id=${myJson.id}`, options).then((response) => {
        response.json().then((json) => {
          // If image uploading errors occur
          if (response.status === 400) {
            alert("Image could not be processed. Try again");
          } else {
            toggleFeed(0);
            window.scrollTo(0, 0);
            alert("Sucessfully edited post");
          }
        });
      });
    };
    reader.readAsDataURL(image);
  }
  // If no image is inputted and user want's to edit a post
  else if (myJson) {
    // Send request to server to edit post
    let options = {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        text: text,
        subseddit: subseddit,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
        id: myJson.id,
      },
    };
    fetch(`${apiUrl}/post/?id=${myJson.id}`, options).then((response) => {
      response.json().then((json) => {
        toggleFeed(0);
        window.scrollTo(0, 0);
        alert("Sucessfully edited post");
      });
    });
  }
  // If user is submitting new post and image is inputed
  else if (image) {
    // Read image and convert to base 64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      let extract = reader.result.replace("data:image/jpeg;base64,", "");

      let options = {
        method: "POST",
        body: JSON.stringify({
          title: title,
          text: text,
          subseddit: subseddit,
          image: extract,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      };
      fetch(`${apiUrl}/post`, options).then((response) => {
        response.json().then((json) => {
          // If image upload errors occur, send alert
          if (response.status === 400) {
            alert("Image could not be processed. Try again");
          } else {
            toggleFeed(0);
            window.scrollTo(0, 0);
            alert("Sucessfully posted to " + subseddit);
          }
        });
      });
    };
    reader.readAsDataURL(image);
  }
  // If user is submitting a new post and no image is inputted
  else {
    let options = {
      method: "POST",
      body: JSON.stringify({
        title: title,
        text: text,
        subseddit: subseddit,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
    };
    fetch(`${apiUrl}/post`, options).then((response) => {
      response.json().then((json) => {
        // If error occurs, send alert
        if (response.status === 400) {
          alert("Error with submission. Try again");
        } else {
          toggleFeed(0);
          window.scrollTo(0, 0);
          alert("Sucessfully posted to " + subseddit);
        }
      });
    });
  }
}
