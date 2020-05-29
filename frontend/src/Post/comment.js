// Send comment request
export function sendComment(apiUrl, id, comment) {
  // Send request to post a comment
  let options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
      id: id,
    },
    body: JSON.stringify({ comment }),
    method: "PUT",
  };
  return fetch(`${apiUrl}/post/comment?id=${id}`, options)
    .then((res) => res.json())
    .then((json) => {
      return json;
    });
}

// Append new comment to a post
export function appendNewComment(apiUrl, id, value) {
  // If comment is empty, send alert and return
  if (value.length === 0) {
    alert("Comment cannot be empty");
    return;
  }
  sendComment(apiUrl, id, value).then((json) => {
    // Remove post content fields
    commentWrap.remove();

    // Determine comment details
    let commentTree = document.getElementById("postTree" + id);
    let userName = document.getElementById("profileName");

    // Create comment wrapper
    let commentBox = document.createElement("div");
    commentBox.classList = "comment";
    commentBox.id = "comment" + id;
    commentTree.appendChild(commentBox);

    // Create comment details wrapper
    let commentDetails = document.createElement("div");
    commentDetails.classList = "publicLayout";
    commentBox.appendChild(commentDetails);

    // Display comment author
    let commentAuthor = document.createElement("p");
    commentAuthor.innerText = "@" + userName.innerText;
    commentDetails.appendChild(commentAuthor);

    // Determine the current date and display in comment
    let commentDate = document.createElement("p");
    commentDate.innerText = new Date();
    commentDetails.appendChild(commentDate);

    let commentDiv = document.createElement("div");
    commentBox.appendChild(commentDiv);

    // Display text contents of comment submitted
    let commentPost = document.createElement("p");
    commentPost.innerText = value;
    commentPost.classList = "description";
    commentDiv.appendChild(commentPost);

    // When posted, scroll posted comment into view
    commentPost.scrollIntoView();
  });
}

// Post a comment
export function postComment(apiUrl, myJson) {
  if (localStorage.getItem("token") === null) {
    alert("You must be logged in to comment");
    return;
  }

  // Create post wrapper
  const commentWrap = document.createElement("div");
  commentWrap.classList = "publicPost";
  commentWrap.id = "commentWrap";
  document.getElementById("mainFeed").appendChild(commentWrap);

  // Create button header
  const postCommentButtons = document.createElement("div");
  postCommentButtons.classList = "feed-header";
  postCommentButtons.addEventListener("click", () => {
    commentWrap.remove();
  });
  commentWrap.appendChild(postCommentButtons);

  // Create back button
  const hideComment = document.createElement("button");
  hideComment.classList = "button";
  hideComment.innerText = "Hide";
  // When clicked, go back to previous session
  hideComment.addEventListener("click", () => {
    commentWrap.remove();
  });
  postCommentButtons.appendChild(hideComment);

  // Create submit comment button
  const submitComment = document.createElement("button");
  submitComment.classList = "button";
  submitComment.innerText = "Submit";
  submitComment.addEventListener("click", () => {
    // Live append the comment to the post
    appendNewComment(apiUrl, myJson.id, commentText.value);
  });
  postCommentButtons.appendChild(submitComment);

  // Create comment wrapper
  const commentBox = document.createElement("div");
  commentBox.classList = "submitPost";
  commentWrap.appendChild(commentBox);

  // Display comment label
  const commentTitle = document.createElement("label");
  commentTitle.innerText = "Comment:";
  commentBox.appendChild(commentTitle);

  // Create comment text box
  const commentText = document.createElement("textarea");
  commentText.id = "commentText";
  commentText.classList = "postDescription";
  commentText.placeholder = "Enter comment";
  commentBox.appendChild(commentText);

  // Create submit comment button
  const commentSubmit = document.createElement("button");
  commentSubmit.classList = "submitButton";
  commentSubmit.innerText = "Submit";
  commentSubmit.addEventListener("click", () => {
    // When clicked, send request to post comment
    appendNewComment(apiUrl, myJson.id, commentText.value);
  });
  commentBox.appendChild(commentSubmit);

  // When submit comment button is clicked, scroll comment input into view
  commentSubmit.scrollIntoView();
}
