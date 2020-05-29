export function submitPost(apiUrl) {
    
    const title = document.getElementById('postTitle').value;
    const subseddit = document.getElementById('postSubseddit').value;    
    const image = document.getElementById('postImage').files[0];
    const text = document.getElementById('postDescription').value;
    
    if (!title || !subseddit || !text) {
        alert("Must not have an empty text field");
        return;
    }

    if (image) {
        const reader = new FileReader();
        reader.onloadend = function() {
            let extract = reader.result.replace("data:image/jpeg;base64,", "");
            
            let options = {
                method: "POST",
                body: JSON.stringify({
                    "title": title,
                    "text": text,
                    "subseddit": subseddit,
                    "image": extract                        
                }),
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("token")     
                },
            }
            fetch(`${apiUrl}/post`, options)
            .then(response => {
                response.json().then(json => {
                    if (response.status === 400) {
                        alert('Image could not be processed. Try again');
                    } else {   
                        showHideFeed(0);
                        window.scrollTo(0, 0);  
                        alert("Sucessfully posted to " + subseddit); 
                    }        
                })
            })         
        }
        reader.readAsDataURL(image);
    } else {
        let options = {
            method: "POST",
            body: JSON.stringify({
            "title": title,
            "text": text,
            "subseddit": subseddit                       
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("token")     
            },
        }
        fetch(`${apiUrl}/post`, options)
        .then(response => {
            response.json().then(json => {
                if (response.status === 400) {
                    alert('Image could not be processed. Try again');
                } else {   
                    showHideFeed(0);
                    document.getElemenm
                    window.scrollTo(0, 0);  
                    alert("Sucessfully posted to " + subseddit); 
                }        
            })
        })             
    }        
}

export function createPost(apiUrl) {

    if (localStorage.getItem("token") === null) {
        alert("You must be logged in to post");    
        return;
    }

    // Temporarily hide feed
    showHideFeed(1);
    // Scroll to top
    window.scrollTo(0, 0);  
    
    // Create post wrapper
    const createPostDiv = document.createElement('div');
    createPostDiv.classList = 'publicPost';
    createPostDiv.id = 'createPost' 
    document.getElementById('mainFeed').appendChild(createPostDiv);
        
    // Create button header    
    const createPostButtons = document.createElement('div');
    createPostButtons.classList = 'feed-header';
    createPostDiv.appendChild(createPostButtons);
    
    // Create back button
    const backButton = document.createElement('button');
    backButton.classList = 'button';
    backButton.innerText = "Back";
    // When click, go back to previous session
    backButton.addEventListener('click', function () {
        createPostDiv.remove();
        showHideFeed(0);        
        window.scrollTo(0, 0);  
    });
    createPostButtons.appendChild(backButton);
    
    // Create comment button
    const submitButton = document.createElement('button');
    submitButton.classList = 'button';
    submitButton.innerText = "Submit";  
    submitButton.addEventListener('click', function() {
        submitPost(apiUrl);
    });       
    createPostButtons.appendChild(submitButton);          




    // Create post wrapper
    const createPostWrapper = document.createElement('div');
    createPostWrapper.classList = 'submitPost';
    createPostDiv.appendChild(createPostWrapper);
          
    
    const postTitle = document.createElement('label');
    postTitle.innerText = "Post Title";
    createPostWrapper.appendChild(postTitle);

    const postTitleInput = document.createElement('input');
    postTitleInput.id = 'postTitle';
    postTitleInput.placeholder = "Enter name of your Post Title";
    postTitleInput.setAttribute('type', 'text');
    createPostWrapper.appendChild(postTitleInput);
     
    const subsedditTitle = document.createElement('label');
    subsedditTitle.innerText = "Subseddit";
    createPostWrapper.appendChild(subsedditTitle);
    
    const subsedditPostInput = document.createElement('input');
    subsedditPostInput.id = 'postSubseddit';    
    subsedditPostInput.placeholder = "Enter name of subseddit you want to post to";
    subsedditPostInput.setAttribute('type', 'text');    
    createPostWrapper.appendChild(subsedditPostInput);   

    const imageTitle = document.createElement('label');
    imageTitle.innerText = "Image (optional)";
    createPostWrapper.appendChild(imageTitle);
    
    const imagePostInput = document.createElement('input');
    imagePostInput.id = 'postImage';    
    imagePostInput.classList = 'uploadImage';
    imagePostInput.setAttribute('type', 'file');    
    createPostWrapper.appendChild(imagePostInput);     

    const descriptionTitle = document.createElement('label');
    descriptionTitle.innerText = "Text";
    createPostWrapper.appendChild(descriptionTitle);
        
    const postDescription = document.createElement('textarea');
    postDescription.id = 'postDescription';
    postDescription.classList = 'postDescription';
    postDescription.placeholder = "Enter text contents of your post";
    createPostWrapper.appendChild(postDescription);   
    
    // Create comment button
    const bottomSubmit = document.createElement('button');
    bottomSubmit.classList = 'submitButton';
    bottomSubmit.innerText = "Submit";  
    bottomSubmit.addEventListener('click', function() {
        submitPost(apiUrl)
    });  
    createPostWrapper.appendChild(bottomSubmit);         
}

export function showPost(myJson, apiUrl) {


    // Save previous scroll position
    const scrollPosition = window.pageYOffset;
    // Temporarily hide feed
    showHideFeed(1);
    // Scroll to top
    window.scrollTo(0, 0);

    // Calculate the number of upvotes in this post
    let sum = document.getElementById('voteNum' + myJson.id);
            
    // Create post wrapper
    const postDiv = document.createElement('div');
    postDiv.classList = 'publicPost';
    document.getElementById('mainFeed').appendChild(postDiv);
    
    // Add subseddit name to banner    
    const subheader = document.getElementById('subsedditHeading')
    subheader.innerText = myJson.meta.subseddit;
    
    // Create button header    
    const buttonHeader = document.createElement('div');
    buttonHeader.classList = 'feed-header';
    postDiv.appendChild(buttonHeader);
    
    // Create back button
    const backButton = document.createElement('button');
    backButton.classList = 'button';
    backButton.innerText = "Back";
    // When click, go back to previous session
    backButton.addEventListener('click', function () {
        let num = document.getElementById("showVoteNum" + myJson.id).innerText;
        sum.innerText = num;
        postDiv.remove();
        subheader.innerText = "";
        showHideFeed(0);      
        window.scrollTo(0, scrollPosition);
    });
    buttonHeader.appendChild(backButton);
    
    // Create comment button
    const commentButton = document.createElement('button');
    commentButton.classList = 'button';
    commentButton.innerText = "Comment";    
    buttonHeader.appendChild(commentButton);    
    
    // If post contains picture, display
    if (myJson.image) {
        // Create image wrapper
        const postImage = document.createElement('div');
        postImage.classList = 'postImage';
        postDiv.appendChild(postImage);                
        // Display image  
        const image = document.createElement('img');
        image.src = "data:image/jpeg;base64," + myJson.image;
        postImage.appendChild(image);            
    }

    // Create post wrapper
    const commentPost = document.createElement('li');
    commentPost.classList = 'postComment';
    postDiv.appendChild(commentPost);
                    
    // Create upvote/downvote box
    const commentVote = document.createElement('div');
    commentVote.classList = 'vote';
    commentPost.appendChild(commentVote);   
        
        
    if (localStorage.getItem("token")) {        
        // Create upvote triangle
        const upvote = document.createElement('div');
        let checkUpvote = document.getElementById("upVote" + myJson.id);
        
        if (parseInt(checkUpvote.attributes.checked.value) === 1) {
            upvote.classList = 'showDisUp';
        } else {
            upvote.classList = 'upArrow';
            const upFunction = function(event) {
                upvotePost(myJson, apiUrl, upFunction)
            };       
            
            upvote.addEventListener('click', upFunction);              
        }
        upvote.id = "showUpvote" + myJson.id;
        
       
        commentVote.appendChild(upvote); 
     
        
        // Display the vote number
        const voteNumber = document.createElement('p');
        voteNumber.innerText = sum.innerText;
        voteNumber.id = "showVoteNum" + myJson.id;
        voteNumber.addEventListener('click', function() {
            showUserVotes(myJson, apiUrl)
        });        
        commentVote.appendChild(voteNumber);  
        
        // Create downvote triangle       
        const downvote = document.createElement('div');
        let checkDownvote = document.getElementById("downVote" + myJson.id);
            
        if (parseInt(checkDownvote.attributes.checked.value) === 1) {
            downvote.classList = 'showDisDown';
        } else {
            downvote.classList = 'downArrow'; 
            const downFunction = function() {
                downVotePost(myJson, apiUrl, downFunction)
            };
            
            downvote.addEventListener('click', downFunction);        
        }            
        downvote.id = "showDownvote" + myJson.id;        
        commentVote.appendChild(downvote);  
    } else {
        const voteNumber = document.createElement('p');
        voteNumber.innerText = sum.innerText;
        voteNumber.id = "showVoteNum" + myJson.id;
        commentVote.appendChild(voteNumber);      
    } 
    // Create post wrapper                
    const postBox = document.createElement('div');
    commentPost.appendChild(postBox);           
    
    // Create title wrapper
    const titleBox = document.createElement('div');
    postBox.appendChild(titleBox);                
                
    // Display title of post
    let postTitle = document.createElement('h2');
    postTitle.innerText = myJson.title;   
    postTitle.classList = 'post-title alt-text';   
    titleBox.appendChild(postTitle);
  
    // Create post detail wrapper                
    let detailBox = document.createElement('div');
    detailBox.id = 'detail';
    detailBox.classList = 'postCommentBox';
    postBox.appendChild(detailBox);  
                
    let postedBy = document.createElement('p');
    postedBy.innerText = "Posted by";
    postedBy.classList = 'detailNormal';
    detailBox.appendChild(postedBy);   

    let author = document.createElement('p');
    author.innerText = "@" + myJson.meta.author;
    author.classList = 'author';
    author.setAttribute('data-id-author', "");
    detailBox.appendChild(author);      
                     
    let time = new Date(myJson.meta.published * 1000);    
    const postDate = document.createElement('p');
    postDate.innerText = "on " + time;
    postDate.classList = 'detailNormal';
    detailBox.appendChild(postDate); 
                      
    const description = document.createElement('p');
    description.innerText = myJson.text;
    description.classList = 'postText';
    postBox.appendChild(description);               
                   
    for (let i = 0; i < myJson.comments.length; i++) {       
        
        let commentBox = document.createElement('div');
        commentBox.classList = "comment";
        postDiv.appendChild(commentBox);
        
        let commentDetails = document.createElement('div');
        commentDetails.classList = 'publicLayout';
        commentBox.appendChild(commentDetails);
        
        let commentAuthor = document.createElement('p');
        commentAuthor.innerText = "@" + myJson.comments[i].author;
        commentDetails.appendChild(commentAuthor);  
        
        let commentTime = new Date(myJson.comments[i].published * 1000);
        
        let commentDate = document.createElement('p');
        commentDate.innerText = commentTime;
        commentDetails.appendChild(commentDate);
        
        let commentDiv = document.createElement('div');
        commentBox.appendChild(commentDiv);
        
        let commentPost = document.createElement('p');
        commentPost.innerText = myJson.comments[i].comment;
        commentPost.classList = 'description';
        commentDiv.appendChild(commentPost);            
    }
}

export function showHideFeed(num) {
    if (num === 1) {
        document.getElementById('feed').style.display = "none";
        document.getElementById('footer').style.display = "none"; 
        document.getElementById('pagination').style.display = "none";     
    } else {
        document.getElementById('feed').style.display = "";
        document.getElementById('footer').style.display = ""; 
        document.getElementById('pagination').style.display = "";      
    }
}
