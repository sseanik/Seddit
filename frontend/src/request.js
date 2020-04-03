import { clearBody, showHideFeed } from './remove.js'

// Send comment request
export function sendComment(apiUrl, id, comment) {

    // Send request to post a comment
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token"),
            "id": id     
        },
        body: JSON.stringify({ comment }),
        method: "PUT"
    }
    return fetch(`${apiUrl}/post/comment?id=${id}`, options)
        .then(res => res.json())
        .then(json => {
            return json;
        });
}

// Append new comment to a post
export function appendNewComment(apiUrl, id, value) {
   
    // If comment is empty, send alert and return        
    if (value.length === 0) {
        alert('Comment cannot be empty');
        return;
    }    
    sendComment(apiUrl, id, value)
    .then(json => {
        // Remove post content fields
        commentWrap.remove();
        
        // Determine comment details
        let commentTree = document.getElementById('postTree' + id);    
        let userName = document.getElementById('profileName');
        
        // Create comment wrapper        
        let commentBox = document.createElement('div');
        commentBox.classList = "comment";
        commentBox.id = 'comment' + id;
        commentTree.appendChild(commentBox);
        
        // Create comment details wrapper
        let commentDetails = document.createElement('div');
        commentDetails.classList = 'publicLayout';
        commentBox.appendChild(commentDetails);
        
        // Display comment author
        let commentAuthor = document.createElement('p');
        commentAuthor.innerText = "@" + userName.innerText;
        commentDetails.appendChild(commentAuthor);              
        
        // Determine the current date and display in comment
        let commentDate = document.createElement('p');
        commentDate.innerText = new Date();
        commentDetails.appendChild(commentDate);
        
        let commentDiv = document.createElement('div');
        commentBox.appendChild(commentDiv);
        
        // Display text contents of comment submitted
        let commentPost = document.createElement('p');
        commentPost.innerText = value;
        commentPost.classList = 'description';
        commentDiv.appendChild(commentPost);  
        
        // When posted, scroll posted comment into view
        commentPost.scrollIntoView();                                          
    });
}

// Grab post information from post id
export function getPostInfo(apiUrl, id) {

    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token"),
            "id": id     
        },
        method: "GET"
    }
    return fetch(`${apiUrl}/post/?id=${id}`, options)
        .then(res => res.json())
        .then(json => {
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
                "Authorization": "Token " + localStorage.getItem("token"),
                "id": myJson.id  
            },
            method: "DELETE"
        } 
        fetch(`${apiUrl}/post/?id=${myJson.id}`, options)
            .then(res => res.json())
            .then(json => {
                // Delete post
                feedPost.remove();
            });
    } 
    // If cancel is selected    
    else {
        return;
    }
}


