/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */
 // By Sean Smith (z3415419)
 // Based on the popular website Reddit, this program operates a web app named
 // Seddit that operates as a single page application.

// import your own scripts here.
import { clearBody, showHideFeed } from './remove.js'
import { buildLoggedIn, signUpStatus, loginStatus, sendComment, appendNewComment, getPostInfo, grabSubseddit, unfollowUser, followFunct, removePost } from './request.js'

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // your app initialisation goes here
    
    // Generate base page
    const root = document.getElementById('root');  
    createBanner(apiUrl);  
    createBasePage(apiUrl, 0);
    createLogin(apiUrl);
    createSignUp (apiUrl);
    profilePage(apiUrl);         
    

}

// Create Banner at the top
function createBanner(apiUrl) {

    // Create a header to hold banner items
    const navHeader = document.createElement('header');
    navHeader.id = 'navHeader'; 
    navHeader.classList = 'navHeader';
    root.appendChild(navHeader);

    // Create site name as a logo
    const siteHeading = document.createElement('div');
    siteHeading.id = 'siteHeading';
    siteHeading.classList = 'siteHeading';
    siteHeading.innerText = "Seddit";
    // Add home refresh click event into logo
    siteHeading.addEventListener('click', function() { 
        clearBody();       
        createBasePage(apiUrl, 0); 
    });
    navHeader.appendChild(siteHeading);
    
    // Create subseddit (hidden) heading next to logo
    const subsedditHeading = document.createElement('p');
    subsedditHeading.id = 'subsedditHeading';
    subsedditHeading.classList = 'subsedditHeading';
    subsedditHeading.addEventListener('click', function() {
        grabSubseddit(apiUrl);
    });
    navHeader.appendChild(subsedditHeading);    
     
    // Create wrapper for nav elements           
    const nav = document.createElement('ul');
    nav.classList = 'nav';
    navHeader.appendChild(nav);    
        
    // Create a search box 
    const searchBox = document.createElement('li');
    searchBox.id = 'searchBox';
    searchBox.classList = 'nav-item';
    nav.appendChild(searchBox);    
    // If user is not logged in, hide search box
    if (!localStorage.getItem("token")) {
        searchBox.style.display = "none";
    }  
        
    // Create input field for search box
    const searchInput = document.createElement('input');
    searchInput.id = 'searchInput';
    searchInput.classList = 'inputBox';
    searchInput.placeholder = "Search Seddit";
    searchInput.type = 'search';    
    searchBox.appendChild(searchInput);
    
    // Create search button
    const searchButton = document.createElement('button');
    searchButton.id = 'searchButton';
    searchButton.innerText = '\u2315'
    searchButton.classList = 'searchButton';
    searchButton.addEventListener('click', function() {
        // If search query is not empty
        if (document.getElementById('searchInput').textLength === 0) {
            return;
        }
        showHideFeed()
        showSearchPosts(apiUrl);
    })
    searchBox.appendChild(searchButton);    
    
    // If the user is not logged in
    if (localStorage.getItem("token") === null) {
        // Create login wrapper
        const loginBox = document.createElement('li');
        loginBox.classList = 'nav-item';
        nav.appendChild(loginBox);  
        
        // Create login button
        const loginButton = document.createElement('button');
        loginButton.id = 'loginButton';
        loginButton.classList = 'button button-primary';
        loginButton.innerText = "LOG IN";
        loginButton.setAttribute('data-id-login', '');
        // When clicked, initialise login modal
        loginButton.addEventListener('click', function() { 
            document.getElementById('loginModal').style.display = "inline";
        });
        loginBox.appendChild(loginButton);
        
        // Create signup wrapper
        const signupBox = document.createElement('li');
        signupBox.classList = 'nav-item';
        nav.appendChild(signupBox);  
        
        // Create signup button
        const signupButton = document.createElement('button');
        signupButton.id = 'signupButton';    
        signupButton.classList = 'button button-secondary';
        signupButton.setAttribute('data-id-signup', '');
        signupButton.innerText = "SIGN UP";

        // When clicked, initialise signup modal    
        signupButton.addEventListener('click', function() { 
            document.getElementById('signUpModal').style.display = "inline";
        });    
        signupBox.appendChild(signupButton); 
    } 
    // If the user is already logged in
    else {
        // Create a profile wrapper
        const profileBox = document.createElement('li');
        profileBox.classList = 'nav-item';
        nav.appendChild(profileBox);  
        
        // Create a profile button
        const profileLink = document.createElement('button'); 
        profileLink.classList = 'button button-primary'; 
        profileLink.addEventListener('click', function() {
            // When clicked, hide feed and show profile
            showHideFeed(1)       
            document.getElementById('profileWrapper').style.display = "";     
        });
        profileBox.appendChild(profileLink);  
        
        // Fetch the user's name
        let options = {
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token")     
            },
            method: "GET"
        }        
        fetch(`${apiUrl}/user/`, options)
            .then(res => res.json())
            .then(json => { 
                // Set the profile button's text to the user's name
                profileLink.innerText = json.username;
                profileLink.id = "profileName";
                profileLink.setAttribute('check', json.id);
        }); 
        
        // Create a logout wrapper    
        const logoutBox = document.createElement('li');
        logoutBox.classList = 'nav-item';
        nav.appendChild(logoutBox);  
        
        // Create a logout button
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutButton';    
        logoutButton.classList = 'buttonThree';
        logoutButton.innerText = "LOG OUT";
        logoutButton.addEventListener('click', function() { 
            // When button is quit, change to logged out interface
            document.getElementById('profileWrapper').remove();    
            clearBody('logout');  
            createLogin(apiUrl);
            createBanner(apiUrl);  
            createBasePage(apiUrl, 0);                                
        });    
        logoutBox.appendChild(logoutButton);    
    } 
}

// Create subseddit feed skeleton
function buildSubsedditPosts(apiUrl, subHeading) {

    // Hide current feed
    showHideFeed(4) 
    document.getElementById('feed').style.display = "none"; 
    
    // Update the banner subseddit heading
    document.getElementById('subsedditHeading').innerText = subHeading;
    
    // Create subseddit feed list
    const subsedditFeed = document.createElement('ul');
    subsedditFeed.id = 'subsedditFeed';
    subsedditFeed.classList = 'subsedditFeed';
    root.appendChild(subsedditFeed);
    
    // Create subseddit feed header
    const subFeedHeader = document.createElement('div');
    subFeedHeader.classList = 'feed-header';
    subsedditFeed.appendChild(subFeedHeader);
    
    // Create back button
    const subBackButton = document.createElement('button');
    subBackButton.classList = 'button button-primary';
    subBackButton.innerText = "Back";
    subBackButton.addEventListener('click', showHideFeed);
    subsedditFeed.appendChild(subBackButton);    
    
    // Create post to subseddit button
    const postButton = document.createElement('button');
    postButton.classList = 'button button-secondary';
    postButton.innerText = "Post";
    postButton.addEventListener('click', function() {
        createPost(apiUrl, false, subHeading.innerText)
    });
    subsedditFeed.appendChild(postButton);
}

// Create base feed page
function createBasePage(apiUrl, num) {   
          
    // Create feed skeleton
    const mainFeed = document.createElement('main');
    mainFeed.id = 'mainFeed';
    mainFeed.setAttribute('role', "main");
    root.appendChild(mainFeed);
    
    // Create feed list
    const feed = document.createElement('ul');
    feed.id = 'feed';     
    mainFeed.appendChild(feed);
    
    // Create feed header
    const feedHeader = document.createElement('div');
    feedHeader.classList = 'feed-header';
    feed.appendChild(feedHeader);
    
    // Create feedHeading
    const feedHeading = document.createElement('h3');
    feedHeading.classList = 'feed-title';
    // If user is not logged in
    if (localStorage.getItem("token") === null) {
        feedHeading.innerText = "Public Feed";
    } else {
        // Generate user's name and add to feed header
        let options = {
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token")     
            },
            method: "GET"
        }        
        fetch(`${apiUrl}/user/`, options)
            .then(res => res.json())
            .then(json => { 
                feedHeading.innerText = json.name + "'s Feed";
        });            
    }
    feedHeader.appendChild(feedHeading);
    
    // Create post button
    const postButton = document.createElement('button');
    postButton.classList = 'button button-secondary';
    postButton.innerText = "Post";
    postButton.addEventListener('click', function() {    
        createPost(apiUrl);
    });
    feedHeader.appendChild(postButton);
    
    // If user is not logged in, generate public posts
    if (localStorage.getItem("token") === null) {
    fetch(`${apiUrl}/post/public`)
        .then(res => res.json())
        .then(myJson => {        
            // Sort the posts based on their date
            myJson.posts.sort( (a, b) => a.meta.published - b.meta.published);
            // Add each post to the feed
            for (let i = 0; i < myJson.posts.length; i++) {
                createFeedPost(myJson.posts[i], apiUrl, 0)    
            }
         }) 
    } 
    // If the user is logged in, add their own feed
    else {
        addFeedPosts(num, apiUrl);
    }
    
    // If user is logged in
    if (localStorage.getItem("token")) {
        // Calculate page number
        let number = (num / 6) + 1;
        
        // Create pagination wrapper
        const pageBox = document.createElement('div');
        pageBox.classList = 'pagination';
        pageBox.id = 'pagination';
        mainFeed.appendChild(pageBox);
        
        // Create previous page button
        const leftPage = document.createElement('button');
        leftPage.classList = 'leftButton';
        leftPage.innerText = "<";
        leftPage.addEventListener('click', function() {
            changePage(apiUrl, number - 1);
        });
        pageBox.appendChild(leftPage);
        
        // Output the current page number (starting from 1)      
        const pageNumber = document.createElement('p');
        pageNumber.classList = 'postText';
        pageNumber.innerText = number;
        pageNumber.id = 'overallPage';
        pageBox.appendChild(pageNumber);
        
        // Create next page button
        const rightPage = document.createElement('button');
        rightPage.classList = 'rightButton';
        rightPage.innerText = ">";
        rightPage.addEventListener('click', function() {
            changePage(apiUrl, number + 1);
        });
        pageBox.appendChild(rightPage);
    }             
}

// Change current feed page
function changePage(apiUrl, num) {

    let pageNum = document.getElementById('overallPage');
    
    // Do not let page go before 1
    if (parseInt(pageNum.innerText) === 1 && num <= 0) {
        return;
    }
    
    let page =  (num - 1) * 6; 
    
    // Grab the previous/next 6 feed items    
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token"),
            "p": page,
            "n": 6          
        },
        method: "GET"
    }
    fetch(`${apiUrl}/user/feed?p=${page}&n=6`, options)
        .then(res => res.json())
        .then(myJson => {
        // If there are no more posts, return
        if (myJson.posts.length === 0) {
            return;
        } 
        // Add to feed and update page number
        else {
            document.getElementById('mainFeed').remove();         
            createBasePage(apiUrl, page);    
            pageNum.innerText = parseInt(pageNum.innerText) - 1         
        }
        });         
}

// Add posts to a feed
function addFeedPosts(num, apiUrl) {

    // Grab 6 posts from a user's feed
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token"),
            "p": num,
            "n": 6          
        },
        method: "GET"
    }
    fetch(`${apiUrl}/user/feed?p=${num}&n=6`, options)
        .then(res => res.json())
        .then(myJson => {
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
        })              
}

// Create and display feed post
function createFeedPost(myJson, apiUrl, check) {

    // Create a feed post
    let feedPost = document.createElement('li');
    feedPost.classList = 'post';
    feedPost.setAttribute('data-id-post', myJson.id);
    
    // If the feed is the users or the public feed
    if (check === 0 || check === 1) {
        feed.appendChild(feedPost);  
    } 
    // If the feed is another user's profile
    else if (check === 2) {
        document.getElementById('otherProfile').appendChild(feedPost);    
    } 
    // If the feed is the current user's profile
    else if (check === 3) {
        document.getElementById('profileWrapper').appendChild(feedPost);    
    } 
    // If the feed is the search feed
    else if (check === 4) {
        document.getElementById('foundPosts').appendChild(feedPost);     
    } 
    // If the feed is the subseddit feed
    else if (check === 5) {
        document.getElementById('subsedditFeed').appendChild(feedPost);
    }
                        
    // Create upvote/downvote section
    let vote = document.createElement('div');
    vote.classList = 'vote';       
    feedPost.appendChild(vote);
    
    // If the user is logged and an upvote/downvote has already been made
    if (localStorage.getItem("token") && check === 1) {
    
        // Check if the user has voted on a post
        let checkUser = document.getElementById("profileName");
        let checkUserId = parseInt(checkUser.attributes.check.value);  
        let included = myJson.meta.upvotes.includes(checkUserId);
               
        // Create upvote triangle                
        const upvote = document.createElement('div');
        upvote.id = "upVote" + myJson.id
        // If the user has not already voted, set to active
        if (!included) {
            upvote.classList = 'frontUpArrow';
            const upFunction = function(event) {
                upvotePost(myJson, apiUrl, upFunction)
            };     
            upvote.setAttribute('checked', 0);
            upvote.addEventListener('click', upFunction);
        } else {
            upvote.classList = 'frontDisUp';
            upvote.setAttribute('checked', 1);
        }
        vote.appendChild(upvote); 
        
        // Number of upvotes a post has      
        let sum = myJson.meta.upvotes.length;                    
        // Display upvote number
        const voteNumber = document.createElement('p');
        voteNumber.innerText = sum;
        voteNumber.id = "voteNum" + myJson.id;        
        voteNumber.addEventListener('click', function() {
            // If number is clicked, display vote information modal
            showUserVotes(myJson, apiUrl)
        });        
        vote.appendChild(voteNumber);  
           
        // Create downvote triangle            
        const downvote = document.createElement('div');
        downvote.classList = 'frontDownArrow';
        downvote.id = "downVote" + myJson.id   
        // If the user has not already voted, set to active        
        if (included) {
            const downFunction = function() {
                downVotePost(myJson, apiUrl, downFunction)
            }; 
            downvote.setAttribute('checked', 0);
            downvote.addEventListener('click', downFunction);
        } else {
            downvote.setAttribute('checked', 1);        
        }
        vote.appendChild(downvote); 
    } 
    // If user is not logged in
    else {        
        // Display total number of post upvotes 
        let sum = myJson.meta.upvotes.length;                    
        const voteNumber = document.createElement('p');
        voteNumber.innerText = sum;
        voteNumber.id = "voteNum" + myJson.id;        
        vote.appendChild(voteNumber); 
    }           
    
    // Create thumbnail wrapper               
    let imageBox = document.createElement('div');
    imageBox.classList = 'thumbnail';
    imageBox.addEventListener('click', function() { 
        // Click through to access post
        if (document.getElementById('postTree' + myJson.id)) {
            showHideFeed(1);
            document.getElementById('postTree' + myJson.id).style.display = "";
            document.getElementById('subsedditHeading').innerText = myJson.meta.subseddit;
        } else {
            showHideFeed()
            showPost(myJson, apiUrl)
        }
    }) 
    feedPost.appendChild(imageBox);                
    
    // Generate thumbnail image
    let image = document.createElement('img');
    // If feed post has a thumbnail
    if (myJson.thumbnail) {
        let imagePrepend = "data:image/jpeg;base64,";
        image.src = imagePrepend + myJson.thumbnail;
        imageBox.appendChild(image);                                   
    } 
    // If not, create a thumbnail
    else {
        imageBox.classList = 'createThumb';
        imageBox.innerText = "Seddit";
    }  
    
    // Create post Title wrapper
    let postBox = document.createElement('div');
    postBox.id = 'title';
    feedPost.appendChild(postBox);                           
    
    // Display post title
    let postTitle = document.createElement('h4');
    postTitle.innerText = myJson.title;               
    postTitle.classList = 'post-title alt-text';    
    postTitle.addEventListener('click', function() { 
        // Click through to access post
        if (document.getElementById('postTree' + myJson.id)) {
            showHideFeed(1);
            document.getElementById('postTree' + myJson.id).style.display = "";
            document.getElementById('subsedditHeading').innerText = myJson.meta.subseddit;            
        } else {
            showPost(myJson, apiUrl)
        }
    });    
    postBox.appendChild(postTitle);
    
    // Create feed post detail wrapper
    let detailBox = document.createElement('div');
    detailBox.id = 'detail';
    detailBox.classList = 'detailBox';
    postBox.appendChild(detailBox);  
    
    // "Posted by"
    let postedBy = document.createElement('p');
    postedBy.innerText = "Posted by ";
    postedBy.classList = 'detailNormal';
    detailBox.appendChild(postedBy);   
    
    // Display author of post
    let author = document.createElement('p');
    author.innerText = " @" + myJson.meta.author;
    author.classList = 'author';    
    author.addEventListener('click', function() {
        // Click through to author profile
        if (!localStorage.getItem("token")) {
            return;
        }
        showHideFeed()
        showUserPage(apiUrl, myJson.meta.author);
    });
    detailBox.appendChild(author);      
    
    // "in"
    let inSubseddit = document.createElement('p');
    inSubseddit.innerText = "in ";
    inSubseddit.classList = 'detailNormal';
    detailBox.appendChild(inSubseddit);    

    // Display subseddit
    let subseddit = document.createElement('p');
    subseddit.innerText = myJson.meta.subseddit;
    subseddit.classList = 'detailOther';
    subseddit.addEventListener('click', function() {
        // Click through to subseddit feed
        if (!localStorage.getItem("token")) {
            return;
        }   
        grabSubseddit(apiUrl, myJson.meta.subseddit);
    });
    detailBox.appendChild(subseddit);      
     
    // Calculate and display date of post
    let time = new Date(myJson.meta.published * 1000);    
    let postedTime = document.createElement('p');
    postedTime.innerText = time;
    postedTime.classList = 'feedDate';   
    postBox.appendChild(postedTime); 
    
    // If not current user's feed
    if (check != 3) {
        let blankBox = document.createElement('div');
        blankBox.id = 'space';
        blankBox.classList = 'extraSpace';
        blankBox.addEventListener('click', function() { 
                // Set blank box to post
                if (document.getElementById('postTree' + myJson.id)) {
                showHideFeed(1);
                document.getElementById('postTree' + myJson.id).style.display = "";
                document.getElementById('subsedditHeading').innerText = myJson.meta.subseddit; 
                } else {
                    showPost(myJson, apiUrl)
            }
        });        
        feedPost.appendChild(blankBox);
    } else {
        // If current user's feed add edit/delete options for posts
        let editDelete = document.createElement('div');
        editDelete.classList = 'editDelete';
        feedPost.appendChild(editDelete);
        
        // Create edit button
        let editPost = document.createElement('button');
        editPost.id = 'editPost';
        editPost.innerText = 'Edit';
        editPost.classList = 'sideBar';  
        editPost.addEventListener('click', function() {
            createPost(apiUrl, myJson);
        });    
        editDelete.appendChild(editPost);   
        
        // Create delete button        
        let deletePost = document.createElement('button');
        deletePost.id = 'deletePost';
        deletePost.innerText = 'Delete';
        deletePost.classList = 'sideBar';    
        deletePost.addEventListener('click', function(){
            removePost(apiUrl, myJson, feedPost);
        });  
        editDelete.appendChild(deletePost);          
    }
}

// Generate a user's page
function showUserPage(apiUrl, username) {
    
    if (!localStorage.getItem("token")) {
        return;
    }
    
    // Grab user's information
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token") ,
            "username": username  
        },
        method: "GET"
    }    
    fetch(`${apiUrl}/user/?username=${username}`, options)
        .then(res => res.json())
        .then(json => {
            getUserInfo(apiUrl, json.id)
            .then(json => {
                // Hide feed
                document.getElementById('feed').style.display = "none"; 
                const profileWrapper = document.createElement('div');
                profileWrapper.classList = 'publicPost';
                profileWrapper.id = "otherProfile"; 
                root.appendChild(profileWrapper);
                    
                // Create profile button wrapper
                const profileButtons = document.createElement('div');
                profileButtons.classList = 'feed-header';
                profileButtons.id = 'profileButtons';
                profileWrapper.appendChild(profileButtons);
                
                // Create back button
                const profileBack = document.createElement('button');
                profileBack.classList = 'button';
                profileBack.innerText = "Back";
                profileBack.addEventListener('click', function () {
                // When clicked, go back to previous session
                    profileWrapper.remove();
                    document.getElementById('feed').style.display = ""; 
                    document.getElementById('pagination').style.display = "";     
                    window.scrollTo(0, 0);  
                });
                profileButtons.appendChild(profileBack);
                
                // Create follow user button
                const followUser = document.createElement('button');
                followUser.classList = 'button';
                              
                // Check if following user or not              
                let checkFol = document.getElementsByClassName('followListItem');
                if (checkFol[0].innerText === json.name + ", ") {
                    followUser.innerText = "Unfollow"; 
                    followUser.addEventListener('click', function() {
                        followFunct (apiUrl, username) 
                    });                     
                } else {
                    followUser.innerText = "Follow";  
                    followUser.addEventListener('click', function() {
                        unfollowUser(apiUrl, username)
                    });                      
                }
                followUser.id = 'followButton';   
                profileButtons.appendChild(followUser);          

                // Create profile wrapper
                const profileBox = document.createElement('div');
                profileBox.classList = 'submitPost';
                profileWrapper.appendChild(profileBox);
                      
                // Display user's username
                const profileUsername = document.createElement('p');
                profileUsername.innerText = "Username:  ";
                profileUsername.classList = 'profileTitle';
                profileBox.appendChild(profileUsername);        
                
                const profileUser = document.createElement('p');
                profileUser.innerText = json.username; 
                profileUser.classList = 'profileInfo'; 
                profileUsername.appendChild(profileUser);                 
                
                // Display user's email
                const profileEmail = document.createElement('p');
                profileEmail.innerText = "Email:";
                profileEmail.classList = 'profileTitle';        
                profileBox.appendChild(profileEmail);    
                
                const emailAddress = document.createElement('p');
                emailAddress.innerText = json.email;
                emailAddress.id = 'emailAddress';
                emailAddress.classList = 'profileInfo';        
                profileEmail.appendChild(emailAddress);   

                // Display user's name                
                const profileRealName = document.createElement('p');
                profileRealName.innerText = "Name:  ";
                profileRealName.classList = 'profileTitle';
                profileRealName.id = 'profileRealName';
                profileBox.appendChild(profileRealName);
                
                const realName = document.createElement('p');
                realName.innerText = json.name;
                realName.classList = 'profileInfo';
                realName.id = 'realNameOut';
                profileRealName.appendChild(realName);        

                // Display user's user id                
                const profileId = document.createElement('p');
                profileId.innerText = "User ID: ";
                profileId.classList = 'profileTitle';
                profileBox.appendChild(profileId);
                
                const profileIdNum = document.createElement('p');
                profileIdNum.innerText = json.id;
                profileIdNum.classList = 'profileInfo';
                profileId.appendChild(profileIdNum);
                        
                // Display user's number of followers                
                const profileFollowers = document.createElement('p');
                profileFollowers.innerText = "Number of Followers:  ";
                profileFollowers.classList = 'profileTitle';
                profileFollowers.id = 'followerChange';
                profileBox.appendChild(profileFollowers);
                
                const followedNum = document.createElement('p');
                followedNum.innerText = json.followed_num;
                followedNum.classList = 'profileInfo';
                profileFollowers.appendChild(followedNum);
 
                 // Display user's number of following               
                const foloowingNum = document.createElement('p');
                foloowingNum.innerText = "Following:  ";
                foloowingNum.classList = 'profileTitle';
                profileBox.appendChild(foloowingNum);
                
                const numbFoloowing = document.createElement('p');
                numbFoloowing.innerText = json.following.length;
                numbFoloowing.classList = 'profileInfo';
                foloowingNum.appendChild(numbFoloowing);   
                       
                // Display the user of each followed user             
                for (let i = 0; i < json.posts.length; i++) {
                    getPostInfo(apiUrl, json.posts[i])
                    .then(myJson => {
                        createFeedPost(myJson, apiUrl, 2)
                    });
                }
            });
        });       
}

// Display upvote profile modal
function updateProfile(apiUrl, json) {
    
    // Create update profile modal
    const updateModal = document.createElement('div');
    updateModal.id = 'updateModal';
    updateModal.classList = 'modal';
    root.appendChild(updateModal);    
    
    // Create form
    const updateForm = document.createElement('div');
    updateForm.classList = 'modal-content';
    updateModal.appendChild(updateForm);    
    
    const updateBox = document.createElement('div');
    updateBox.id = 'updateBox';
    updateBox.classList = 'container';
    updateForm.appendChild(updateBox);
    
    // Input field to update email       
    const updateEmail = document.createElement('label');
    updateEmail.innerText = "Update Email:";
    updateBox.appendChild(updateEmail);
    
    // Top right hand corner x to close modal
    const closeUpdate = document.createElement('span');
    closeUpdate.classList = 'updateClose';
    closeUpdate.innerText = "x";
    closeUpdate.id = 'closeUpdate';
    updateBox.appendChild(closeUpdate);    
    
    const emailInput = document.createElement('input');
    emailInput.id = 'emailInput';
    emailInput.placeholder = "Enter Email";
    emailInput.setAttribute('type', 'text');
    updateBox.appendChild(emailInput);
     
    // Input field to update name         
    const updateName = document.createElement('label');
    updateName.innerText = "Update Name:";
    updateBox.appendChild(updateName);
    
    const nameInput = document.createElement('input');
    nameInput.id = 'nameInput';    
    nameInput.placeholder = "Enter Name";
    nameInput.setAttribute('type', 'text');    
    updateBox.appendChild(nameInput);  

    // Input field to update password     
    const updatePass = document.createElement('label');
    updatePass.innerText = "Update Password";
    updateBox.appendChild(updatePass);
    
    const updatePassOne = document.createElement('input');
    updatePassOne.id = 'updatePassOne';    
    updatePassOne.placeholder = "Enter Password";
    updatePassOne.setAttribute('type', 'password');    
    updateBox.appendChild(updatePassOne);    
    
    // Secondary password field
    const updatePassTwo = document.createElement('input');
    updatePassTwo.id = 'updatePassTwo';    
    updatePassTwo.placeholder = "Confirm Password";
    updatePassTwo.setAttribute('type', 'password');    
    updateBox.appendChild(updatePassTwo); 
          
    // Update submit button   
    const updateButton = document.createElement('button');
    updateButton.innerText = "Update";
    updateButton.classList = 'loginButton';
    updateButton.addEventListener('click', function () { 
        updateStatus (apiUrl)
    });
    updateBox.appendChild(updateButton);
   
    // If user generates an error, display in modal
    const updateError = document.createElement('div'); 
    updateError.id = 'updateError';
    updateError.classList = 'loginError';
    updateBox.appendChild(updateError);
            
    // If clicked x or outside modal, close modal
    window.addEventListener('click', function (event) {
      if (event.target == updateModal || event.target == closeUpdate) {
        updateModal.style.display = "none";
        updateError.innerText = "";
      }        
    });       
    updateModal.style.display = 'inline';          
}

// Update a user's information
function updateStatus (apiUrl) {

    // Generate data from modal inputs
    const email = document.getElementById('emailInput').value;
    const realName = document.getElementById('nameInput').value;          
    const passOne = document.getElementById('updatePassOne').value; 
    const passTwo = document.getElementById('updatePassTwo').value;  
    const updateError = document.getElementById('updateError');
    
    // If all fields are empty, return an error
    if (email === "" && realName === "" && 
        passOne === "" && passTwo === "") {
        updateError.innerText = "Fields must not be Empty";
        return;
    } 
    // If passwords do not match, return error
    else if (passOne != passTwo) {
        updateError.innerText = "Passwords do not match";
        return;   
    } 
    // If password is one character, return error 
    else if (passOne.length === 1) {
        updateError.innerText = "Password must be greater than one character";
        return;       
    }

    // Send request to update user's details
    let options = {
        method: "PUT",
        body: JSON.stringify({
            "email": email, 
            "name": realName, 
            "password" :passOne
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token")  
        },
    };
    fetch(`${apiUrl}/user`, options)
    .then(response => {
        response.json().then(json => {
            // Live update details in profile
            if (email) {
                document.getElementById('emailAddress').innerText = email;
            } 
            if (realName) {
                document.getElementById('realNameOut').innerText = realName;
            }
            document.getElementById('updateModal').remove();   
        })
    })         
}

// Create profile page for logged in user
function profilePage(apiUrl, username) {

    if (!localStorage.getItem("token")) {
        return;
    }
    
    // Grab user details
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token")  
        },
        method: "GET"
    }        
    fetch(`${apiUrl}/user/`, options)
        .then(res => res.json())
        .then(json => {
            getUserInfo(apiUrl, json.id)
            .then(json => {
                // Create profile wrapper    
                const profileWrapper = document.createElement('div');
                profileWrapper.classList = 'publicPostExtra';
                profileWrapper.style.display = "none";
                profileWrapper.id = 'profileWrapper' 
                root.appendChild(profileWrapper);
                    
                // Create button wrapper    
                const profileButtons = document.createElement('div');
                profileButtons.classList = 'feed-header';
                profileWrapper.appendChild(profileButtons);
                
                // Create back button
                const profileBack = document.createElement('button');
                profileBack.classList = 'button backComment';
                profileBack.innerText = "Back";
                // When clicked, go back to previous session
                profileBack.addEventListener('click', function () {     
                    showHideFeed();                    
                    document.getElementById('mainFeed').style.display = ""; 
                    document.getElementById('pagination').style.display = "";     
                    window.scrollTo(0, 0);  
                });
                profileButtons.appendChild(profileBack);
                
                // Create edit profile button
                const editProfile = document.createElement('button');
                editProfile.classList = 'button backComment';
                editProfile.innerText = "Update Profile";  
                editProfile.addEventListener('click', function() {
                    updateProfile(apiUrl, json);
                });       
                profileButtons.appendChild(editProfile);

                // Create post wrapper
                const profileBox = document.createElement('div');
                profileBox.classList = 'submitPost';
                profileWrapper.appendChild(profileBox);
                      
                // Display user's details                
                const profileUsername = document.createElement('p');
                profileUsername.innerText = "Username:  ";
                profileUsername.classList = 'profileTitle';
                profileBox.appendChild(profileUsername);        
                
                // Display username
                const profileUser = document.createElement('p');
                profileUser.innerText = json.username; 
                profileUser.classList = 'profileInfo'; 
                profileUsername.appendChild(profileUser);                 
                
                // Display email
                const profileEmail = document.createElement('p');
                profileEmail.innerText = "Email:";
                profileEmail.classList = 'profileTitle';        
                profileBox.appendChild(profileEmail);    
                
                const emailAddress = document.createElement('p');
                emailAddress.innerText = json.email;
                emailAddress.id = 'emailAddress';
                emailAddress.classList = 'profileInfo';        
                profileEmail.appendChild(emailAddress);   
                
                // Display name
                const profileRealName = document.createElement('p');
                profileRealName.innerText = "Name:  ";
                profileRealName.classList = 'profileTitle';
                profileRealName.id = 'profileRealName';
                profileBox.appendChild(profileRealName);
                
                const realName = document.createElement('p');
                realName.innerText = json.name;
                realName.classList = 'profileInfo';
                realName.id = 'realNameOut';
                profileRealName.appendChild(realName);        
                
                // Display user id
                const profileId = document.createElement('p');
                profileId.innerText = "User ID: ";
                profileId.classList = 'profileTitle';
                profileBox.appendChild(profileId);
                
                const profileIdNum = document.createElement('p');
                profileIdNum.innerText = json.id;
                profileIdNum.classList = 'profileInfo';
                profileId.appendChild(profileIdNum);
                 
                // Display number of followers                        
                const profileFollowers = document.createElement('p');
                profileFollowers.innerText = "Number of Followers:  ";
                profileFollowers.classList = 'profileTitle';
                profileBox.appendChild(profileFollowers);
                
                const followedNum = document.createElement('p');
                followedNum.innerText = json.followed_num;
                followedNum.classList = 'profileInfo';
                profileFollowers.appendChild(followedNum);
                
                // Display number of following
                const foloowingNum = document.createElement('p');
                foloowingNum.innerText = "Following:  ";
                foloowingNum.classList = 'profileTitle';
                profileBox.appendChild(foloowingNum);
                
                const numbFoloowing = document.createElement('p');
                numbFoloowing.innerText = json.following.length;
                numbFoloowing.classList = 'profileInfo';
                foloowingNum.appendChild(numbFoloowing);                 
                    
                let followBox = document.createElement('div');
                followBox.classList = 'followingList';
                profileBox.appendChild(followBox);
                
                // Create list of followed users
                for (let j = 0; j < json.following.length; j++) {
                    let followUser = document.createElement('p');
                    getUserInfo(apiUrl, json.following[j])
                    .then(json => {
                        followUser.innerText = json.username + ", ";
                    })
                    followUser.classList = 'followListItem';
                    followBox.appendChild(followUser);
                }
                
                // Generate posts the user has made overall
                for (let i = 0; i < json.posts.length; i++) {
                    getPostInfo(apiUrl, json.posts[i])
                    .then(myJson => {
                        createFeedPost(myJson, apiUrl, 3)
                    });
                }
            });
        });    
}

// Show upvotes modal
function showUserVotes(myJson, apiUrl) {
    
    // Create modal to show user's that have upvoted a post
    const userVoteModal = document.createElement('div');
    userVoteModal.id = 'userVoteModal';
    userVoteModal.classList = 'voteModal';
    root.appendChild(userVoteModal);    
    
    // Create modal wrapper
    const userVoteWrapper = document.createElement('div');
    userVoteWrapper.classList = 'voteModalContent';
    userVoteModal.appendChild(userVoteWrapper);    
    
    const userVoteBox = document.createElement('div');
    userVoteBox.id = 'userVoteBox';
    userVoteWrapper.appendChild(userVoteBox);
    
    // Modal heading
    const userVoteLabel = document.createElement('label');
    userVoteLabel.innerText = "Users that have upvoted this post:";
    userVoteBox.appendChild(userVoteLabel);
        
    // Modal x button
    const closeVoteModal = document.createElement('span');
    closeVoteModal.classList = 'VoteClose';
    closeVoteModal.innerText = "x";
    userVoteBox.appendChild(closeVoteModal);
    
    // Create a list of users
    const userVoteList = document.createElement('ul');
    userVoteList.classList = 'voteModalList';
    userVoteBox.appendChild(userVoteList);
    
    // Check if the user has downvoted this post
    let checkDown = document.getElementById('downVote' + myJson.id);
    checkDown = parseInt(checkDown.attributes.checked.value);
    let profile = document.getElementById('profileName');
    let num = parseInt(profile.attributes.check.value)
    let found = 0;
    for (let i = 0; i < myJson.meta.upvotes.length; i++) { 
        // If the upvote user id matches the user's id
        if (myJson.meta.upvotes[i] === parseInt(num)) {
            found = 1;
        }
        let checkUser = getUserInfo(apiUrl, myJson.meta.upvotes[i]);
        checkUser.then(json => {
            // If the upvote has already downvoted this post (live)
            if (checkDown === 1 && json.id === parseInt(num)) {
                return;
            } else {
                let userVoteName = document.createElement('li');        
                userVoteName.innerText = json.username;
                userVoteList.appendChild(userVoteName);            
            }
        });
    }
    
    // Check if the user has upvoted this post
    let checkUp = document.getElementById('upVote' + myJson.id);
    checkUp = parseInt(checkUp.attributes.checked.value);
    if (found === 0 && checkUp === 1) {
        let userVoteName = document.createElement('li');        
        userVoteName.innerText = profile.innerText;
        userVoteList.appendChild(userVoteName);          
    }
    
    // Allow the modal to exit when x is clicked or outside modal window 
    window.addEventListener('click', function (event) {
        if (event.target == userVoteModal || event.target == closeVoteModal) {
            userVoteModal.remove();
        }        
    });        
}

// Generate a user's details if id is supplied or not
function getUserInfo(apiUrl, id) {
    
    // If id is supplied, return user's details
    if (id) {
        let options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("token"),
                "id": id     
            },
            method: "GET"
        }
        return fetch(`${apiUrl}/user/?id=${id}`, options)
            .then(res => res.json())
            .then(json => {
                return json;
            });        
    } 
    // If id is not supplied return current user's details
    else {
        let options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("token")    
            },
            method: "GET"
        }    
        return fetch(`${apiUrl}/user/`, options)
            .then(res => res.json())
            .then(json => {
                return json;
            });
    }
}

// Upvote a post live function
function upvotePost(myJson, apiUrl, upFunction) {

    // Grab all current vote details
    let voteNum = document.getElementById("voteNum" + myJson.id);
    let liveNum = voteNum.innerText;
    let upvote = document.getElementById("upVote" + myJson.id);
    let downvote = document.getElementById("downVote" + myJson.id);
    // Store downvote function to remove later
    let downFunction = function() { 
        downVotePost(myJson, apiUrl, downFunction) 
    };           
    let showVoteNum = document.getElementById('showVoteNum' + myJson.id);
    let showDownVote = document.getElementById('showDownvote' + myJson.id);
    let showUpvote = document.getElementById('showUpvote' + myJson.id);    
    
    // Send request to upvote a post
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token"),
            "id": myJson.id          
        },
        method: "PUT"
    }    
    fetch(`${apiUrl}/post/vote?id=${myJson.id}`, options) 
    .then(response => {
        response.json().then(json => {   
            // Live update the vote count and remove and readd event listeners
            // to prevent double voting 
            voteNum.innerText = parseInt(liveNum) + 1;
            upvote.classList = 'frontDisUp';
            downvote.classList = 'frontDownArrow';
            upvote.removeEventListener('click', upFunction);
            downvote.addEventListener('click', downFunction);
            // Store vote information
            upvote.setAttribute('checked', 1);
            downvote.setAttribute('checked', 0);
            // If user has voted on the inner post
            if (showVoteNum) {
                // Change vote number            
                showVoteNum.innerText = parseInt(liveNum) + 1;
                showUpvote.classList = 'showDisUp';
                showDownVote.classList = 'downArrow';
                // Shift vote event listeners
                showUpvote.removeEventListener('click', upFunction);
                showDownVote.removeEventListener('click', downFunction);
                showDownVote.addEventListener('click', downFunction);
            }                                              
        })
    })                    
}

// Upvote a post live function
function downVotePost(myJson, apiUrl, downFunction) {
    
    // Grab all current vote details
    let voteNum = document.getElementById("voteNum" + myJson.id);
    let liveNum = voteNum.innerText;
    let downvote = document.getElementById("downVote" + myJson.id);
    let upvote = document.getElementById("upVote" + myJson.id);
    // Store upvote function to remove later    
    let upFunction = function() { 
        upvotePost(myJson, apiUrl, upFunction) 
    };      
    let showVoteNum = document.getElementById('showVoteNum' + myJson.id);
    let showDownVote = document.getElementById('showDownvote' + myJson.id);
    let showUpvote = document.getElementById('showUpvote' + myJson.id);
    
    // Send request to downvote a post    
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token"),
            "id": myJson.id          
        },
        method: "DELETE"
    }    
    fetch(`${apiUrl}/post/vote?id=${myJson.id}`, options)
    .then(response => {
        response.json().then(json => {    
            // Live update the vote count and remove and readd event listeners
            // to prevent double voting              
            voteNum.innerText = parseInt(liveNum) - 1;
            downvote.classList = 'frontDisDown';
            upvote.classList = 'frontUpArrow';
            // Remove event listener on downvote
            downvote.removeEventListener('click', downFunction);
            upvote.addEventListener('click', upFunction);
            upvote.setAttribute('checked', 0); 
            downvote.setAttribute('checked', 1);           
            // If user has voted on the inner post
            if (showVoteNum) {
                // Change vote number  
                showVoteNum.innerText = parseInt(liveNum) - 1;
                showDownVote.classList = 'showDisDown';
                showUpvote.classList = 'upArrow';
                // Shift vote event listeners
                showDownVote.removeEventListener('click', downFunction);
                showUpvote.removeEventListener('click', upFunction); 
                showUpvote.addEventListener('click', upFunction);
            }                 
        })
    })        
}


function showPost(myJson, apiUrl) {

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
    postDiv.id = 'postTree' + myJson.id;
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
    backButton.classList = 'button backComment';
    backButton.innerText = "Back";
    // When clicked, go back to previous session
    backButton.addEventListener('click', function () {
        // If sum is defined and pagination is present
        if (sum && document.getElementById('pagination')) {
            // Determine votenumber
            let num = document.getElementById("showVoteNum" + myJson.id).innerText;
            sum.innerText = num;
            // Remove potential post element      
            if (document.getElementById('comment' + myJson.id)) {
                postDiv.style.display = "none";
            } else {
                postDiv.remove();
            }     
            // Reset and show feed                   
            showHideFeed();    
            document.getElementById('pagination').style.display = "";  
            window.scrollTo(0, scrollPosition);
        } else {
            // Remove potential post element 
             if (document.getElementById('comment' + myJson.id)) {
                postDiv.style.display = "none";
            } else {
                postDiv.remove();
            }
            if (document.getElementById('commentWrap')) {
                document.getElementById('commentWrap').remove();
            }        
            // Show feed
            document.getElementById('feed').style.display = ""; 
            document.getElementById('subsedditHeading').innerText = "";            
        }
    });
    buttonHeader.appendChild(backButton);
    
    // Create comment button
    const commentButton = document.createElement('button');
    commentButton.classList = 'button backComment';
    commentButton.innerText = "Comment"; 
    commentButton.addEventListener('click', function() {
        if (document.getElementById('commentWrap')) {
            document.getElementById('commentWrap').remove();
        }
        postComment(apiUrl, myJson);
    });   
    buttonHeader.appendChild(commentButton);    
    
    // If post contains picture, display it
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
    commentPost.id = 'commentTree';
    postDiv.appendChild(commentPost);
                    
    // Create upvote/downvote box
    const commentVote = document.createElement('div');
    commentVote.classList = 'vote';
    commentPost.appendChild(commentVote);   
        
    // If user is logged in and has upvoted a post    
    if (localStorage.getItem("token") &&
         document.getElementById("upVote" + myJson.id)) {        
        // Create upvote triangle
        const upvote = document.createElement('div');
        let checkUpvote = document.getElementById("upVote" + myJson.id);
        // If upvote is present, temporarily disable upvotes
        if (parseInt(checkUpvote.attributes.checked.value) === 1) {
            upvote.classList = 'showDisUp';
        }
        // If upvote is not present add function to upvote triangle   
         else {
            upvote.classList = 'upArrow';
            const upFunction = function(event) {
                // When clicked, send request to upvote post
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
        voteNumber.setAttribute('data-id-upvotes', '');
        voteNumber.addEventListener('click', function() {
            // When clicked, display vote details modal
            showUserVotes(myJson, apiUrl)
        });        
        commentVote.appendChild(voteNumber);  
        
        // Create downvote triangle       
        const downvote = document.createElement('div');
        let checkDownvote = document.getElementById("downVote" + myJson.id);
        // If downvote is present, temporarily disable upvotes            
        if (parseInt(checkDownvote.attributes.checked.value) === 1) {
            downvote.classList = 'showDisDown';
        } 
        // If downvote is not present add function to downvote triangle         
        else {
            downvote.classList = 'downArrow'; 
            const downFunction = function() {
                // When clicked, send request to downvote post            
                downVotePost(myJson, apiUrl, downFunction)
            };          
            downvote.addEventListener('click', downFunction);        
        }            
        downvote.id = "showDownvote" + myJson.id;        
        commentVote.appendChild(downvote);  
    } 
    // If user is not logged in, only display vote number
    else {
        const voteNumber = document.createElement('p');
        if (sum) {
            voteNumber.innerText = sum.innerText;
        } 
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
    postTitle.setAttribute('data-id-title', ''); 
    titleBox.appendChild(postTitle);
  
    // Create post detail wrapper                
    let detailBox = document.createElement('div');
    detailBox.id = 'detail';
    detailBox.classList = 'postCommentBox';
    postBox.appendChild(detailBox);  
    
    // Display author of post            
    let postedBy = document.createElement('p');
    postedBy.innerText = "Posted by";
    postedBy.classList = 'detailNormal';
    detailBox.appendChild(postedBy);   

    let author = document.createElement('p');
    author.innerText = "@" + myJson.meta.author;
    author.classList = 'author';
    author.setAttribute('data-id-author', '');

    // Open author's profile if clicked
    author.addEventListener('click', function() {
        if (!localStorage.getItem("token")) {
            return;
        }    
        document.getElementById('subsedditHeading').innerText = "";
        document.getElementById('feed').style.display = "";
        document.getElementById('postTree' + myJson.id).style.display = "none";
        showHideFeed()
        showUserPage(apiUrl, myJson.meta.author);
    });      
    detailBox.appendChild(author);      
                    
    // Display when the post was posted 
    let time = new Date(myJson.meta.published * 1000);    
    const postDate = document.createElement('p');
    postDate.innerText = "on " + time;
    postDate.classList = 'detailNormal';
    detailBox.appendChild(postDate); 
    
    // Display the number of comments on the post
    let commentNum = document.createElement('p');
    commentNum.innerText = ":  " + myJson.comments.length + " comments";
    commentNum.classList = 'detailNormal'; 
    detailBox.appendChild(commentNum);   
    
    // Display text description of post                  
    const description = document.createElement('p');
    description.innerText = myJson.text;
    description.classList = 'postText';
    postBox.appendChild(description);               
    
    // Loop and append each comment to the post               
    for (let i = 0; i < myJson.comments.length; i++) {       
        // Create comment wrapper
        let commentBox = document.createElement('div');
        commentBox.classList = "comment";
        postDiv.appendChild(commentBox);
        
        // Create comment details wrapper
        let commentDetails = document.createElement('div');
        commentDetails.classList = 'publicLayout';
        commentBox.appendChild(commentDetails);
        
        // Display comment's author
        let commentAuthor = document.createElement('p');
        commentAuthor.innerText = "@" + myJson.comments[i].author;
        commentAuthor.classList = 'commentAuthor';
        // If clicked, open up comment author's user page
        commentAuthor.addEventListener('click', function () {
            if (!localStorage.getItem("token")) {
                return;
            }        
            // Hide current feed
            document.getElementById('subsedditHeading').innerText = "";
            document.getElementById('postTree' + myJson.id).style.display = "none";
            document.getElementById('feed').style.display = "";
            showHideFeed()
            showUserPage(apiUrl, myJson.comments[i].author);
        });         
        commentDetails.appendChild(commentAuthor);  
        
        // Display the date of when the comment was posted
        let commentTime = new Date(myJson.comments[i].published * 1000);        
        let commentDate = document.createElement('p');
        commentDate.innerText = commentTime;
        commentDetails.appendChild(commentDate);
        
        // Create comment wrapper
        let commentDiv = document.createElement('div');
        commentBox.appendChild(commentDiv);
        
        // Display the text contents of the comment
        let commentPost = document.createElement('p');
        commentPost.innerText = myJson.comments[i].comment;
        commentPost.classList = 'description';
        commentDiv.appendChild(commentPost);            
    }
}

// Post a comment
function postComment(apiUrl, myJson) {

    if (localStorage.getItem("token") === null) {
        alert("You must be logged in to comment");    
        return;
    }
    
    // Create post wrapper
    const commentWrap = document.createElement('div');
    commentWrap.classList = 'publicPost';
    commentWrap.id = 'commentWrap' 
    document.getElementById('mainFeed').appendChild(commentWrap);
                
    // Create button header    
    const postCommentButtons = document.createElement('div');
    postCommentButtons.classList = 'feed-header';
    commentWrap.appendChild(postCommentButtons);
    
    // Create back button
    const hideComment = document.createElement('button');
    hideComment.classList = 'button';
    hideComment.innerText = "Hide";
    // When clicked, go back to previous session
    hideComment.addEventListener('click', function () {
        commentWrap.remove();
    });
    postCommentButtons.appendChild(hideComment);
    
    // Create submit comment button
    const submitComment = document.createElement('button');
    submitComment.classList = 'button';
    submitComment.innerText = "Submit";  
    submitComment.addEventListener('click', function() {
        // Live append the comment to the post
        appendNewComment(apiUrl, myJson.id, commentText.value)
    });       
    postCommentButtons.appendChild(submitComment);          

    // Create comment wrapper
    const commentBox = document.createElement('div');
    commentBox.classList = 'submitPost';
    commentWrap.appendChild(commentBox);
    
    // Display comment label    
    const commentTitle = document.createElement('label');
    commentTitle.innerText = "Comment:";
    commentBox.appendChild(commentTitle);
   
    // Create comment text box     
    const commentText = document.createElement('textarea');
    commentText.id = 'commentText';
    commentText.classList = 'postDescription';
    commentText.placeholder = "Enter comment";
    commentBox.appendChild(commentText);   
    
    // Create submit comment button
    const commentSubmit = document.createElement('button');
    commentSubmit.classList = 'submitButton';
    commentSubmit.innerText = "Submit";  
    commentSubmit.addEventListener('click', function() {
        // When clicked, send request to post comment
        appendNewComment(apiUrl, myJson.id, commentText.value)
    });  
    commentBox.appendChild(commentSubmit);  
    
    // When submit comment button is clicked, scroll comment input into view
    commentSubmit.scrollIntoView();    
}

// Create a post
function createPost(apiUrl, myJson, subseddit) {

    // If user is not logged in, display an alert and return
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
    // When clicked, go back to previous session
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
        // When clicked, display submit post inputs
        submitPost(apiUrl)
    });       
    createPostButtons.appendChild(submitButton);          

    // Create post wrapper
    const createPostWrapper = document.createElement('div');
    createPostWrapper.classList = 'submitPost';
    createPostWrapper.Id = 'postBoxRemove';
    createPostDiv.appendChild(createPostWrapper);
          
    // Display post title lable
    const postTitle = document.createElement('label');
    postTitle.innerText = "Post Title";
    createPostWrapper.appendChild(postTitle);

    // Display post title input
    const postTitleInput = document.createElement('input');
    postTitleInput.id = 'postTitle';
    // If post is being edited, put previous title into input
    if (myJson) {
        postTitleInput.value = myJson.title;
    } else {
        postTitleInput.placeholder = "Enter name of your Post Title";    
    }
    postTitleInput.setAttribute('type', 'text');
    createPostWrapper.appendChild(postTitleInput);
    
    // Display subseddit label
    const subsedditTitle = document.createElement('label');
    subsedditTitle.innerText = "Subseddit";
    createPostWrapper.appendChild(subsedditTitle);

    // Display subseddit name input
    const subsedditPostInput = document.createElement('input');
    subsedditPostInput.id = 'postSubseddit';    
    // If post is being edited, put previous subseddit into input    
    if (myJson) {
        subsedditPostInput.value = myJson.meta.subseddit;
    } 
    // If posting to an existing subseddit feed, put into input
    else if (subseddit) {
        subsedditPostInput.value = subseddit;
    } else {
        subsedditPostInput.placeholder = "Enter name of subseddit you want to post to";
    }    
    subsedditPostInput.setAttribute('type', 'text');    
    createPostWrapper.appendChild(subsedditPostInput);   

    // Display image label
    const imageTitle = document.createElement('label');
    imageTitle.innerText = "Image (optional)";
    createPostWrapper.appendChild(imageTitle);
    
    // Display upload image submit file input
    const imagePostInput = document.createElement('input');
    imagePostInput.id = 'postImage';    
    imagePostInput.classList = 'uploadImage';
    imagePostInput.setAttribute('type', 'file');       
    createPostWrapper.appendChild(imagePostInput);     

    // Display description label
    const descriptionTitle = document.createElement('label');
    descriptionTitle.innerText = "Text";
    createPostWrapper.appendChild(descriptionTitle);
     
    // Display description resizeable text box for input
    const postDescription = document.createElement('textarea');
    postDescription.id = 'postDescription';
    postDescription.classList = 'postDescription';
    // If post is being edited, put previous description into input     
    if (myJson) {
        postDescription.innerText = myJson.text;
    } else {
        postDescription.placeholder = "Enter text contents of your post";  
    }     
    createPostWrapper.appendChild(postDescription);   
    
    // Create submit post button
    const bottomSubmit = document.createElement('button');
    bottomSubmit.classList = 'submitButton';
    bottomSubmit.innerText = "Submit";  
    bottomSubmit.addEventListener('click', function() {
        // Send request to submit post when clicked
        submitPost(apiUrl, myJson)
    });  
    createPostWrapper.appendChild(bottomSubmit);         
}

// Submit a post
function submitPost(apiUrl, myJson) {

    // Grab submit post data from input field    
    const title = document.getElementById('postTitle').value;
    const subseddit = document.getElementById('postSubseddit').value;    
    const image = document.getElementById('postImage').files[0];
    const text = document.getElementById('postDescription').value;
    
    // If any of the fields were empty, sned alert and return
    if (!title || !subseddit || !text) {
        alert("Must not have an empty text field");
        return;
    }
    
    // If image is defined and post is being edited
    if (image && myJson) {
        // Use filereader to read image
        const reader = new FileReader();
        reader.onloadend = function() {
            // Convert image to base 64 and strip of preprend details
            let extract = reader.result.replace("data:image/jpeg;base64,", "");
            // Send request to server to upload image and submit post
            let options = {
                method: "PUT",
                body: JSON.stringify({
                    "title": title,
                    "text": text,
                    "subseddit": subseddit,
                    "image": extract                        
                }),
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("token"),
                "id": myJson.id    
                },
            }
            fetch(`${apiUrl}/post/?id=${myJson.id}`, options)
            .then(response => {
                response.json().then(json => {
                    // If image uploading errors occur
                    if (response.status === 400) {
                        alert('Image could not be processed. Try again');
                    } else {   
                        showHideFeed(0);
                        window.scrollTo(0, 0);  
                        alert("Sucessfully edited post"); 
                    }        
                })
            })         
        }
        reader.readAsDataURL(image);    
    } 
    // If no image is inputted and user want's to edit a post
    else if (myJson) {
        // Send request to server to edit post
        let options = {
            method: "PUT",
            body: JSON.stringify({
            "title": title,
            "text": text,
            "subseddit": subseddit                       
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("token"),
                "id": myJson.id      
            },
        }
        fetch(`${apiUrl}/post/?id=${myJson.id}`, options)
        .then(response => {
            response.json().then(json => {  
                showHideFeed(0);
                window.scrollTo(0, 0);  
                alert("Sucessfully edited post");      
            })
        })                 
    } 
    // If user is submitting new post and image is inputed
    else if (image) {
        // Read image and convert to base 64 string
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
                    // If image upload errors occur, send alert
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
    } 
    // If user is submitting a new post and no image is inputted
    else {
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
                // If error occurs, send alert
                if (response.status === 400) {
                    alert('Error with submission. Try again');
                } else {   
                    showHideFeed(0);
                    window.scrollTo(0, 0);  
                    alert("Sucessfully posted to " + subseddit); 
                }        
            })
        })             
    }        
}

// Create login modal
function createLogin (apiUrl) {
    
    // Create modal wrapper
    const loginModal = document.createElement('div');
    loginModal.id = 'loginModal';
    loginModal.classList = 'modal';
    root.appendChild(loginModal);    
    
    // Create login form for username
    const loginForm = document.createElement('div');
    loginForm.classList = 'modal-content';
    loginModal.appendChild(loginForm);    
    
    // Create login wrapper
    const loginBox = document.createElement('div');
    loginBox.id = 'loginBox';
    loginBox.classList = 'container';
    loginForm.appendChild(loginBox);
    
    // Create label for username    
    const usernameLabel = document.createElement('label');
    usernameLabel.innerText = "Username";
    loginBox.appendChild(usernameLabel);
    
    // Create an exit button
    const closeModal = document.createElement('span');
    closeModal.classList = 'close';
    closeModal.innerText = "x";
    closeModal.id = 'loginClose';
    loginBox.appendChild(closeModal);    
    
    // Create an input field for a username
    const usernameInput = document.createElement('input');
    usernameInput.id = 'usernameInput';
    usernameInput.placeholder = "Enter Username";
    usernameInput.setAttribute('type', 'text');
    loginBox.appendChild(usernameInput);
     
    // Create a password label
    const passwordLabel = document.createElement('label');
    passwordLabel.innerText = "Password";
    loginBox.appendChild(passwordLabel);
    
    // Create a password input field
    const passwordInput = document.createElement('input');
    passwordInput.id = 'passwordInput';    
    passwordInput.placeholder = "Enter Password";
    passwordInput.setAttribute('type', 'password');    
    loginBox.appendChild(passwordInput);    
    
    // Create a login button
    const loginButton = document.createElement('button');
    loginButton.innerText = "Log In";
    loginButton.classList = 'loginButton';
    loginButton.addEventListener('click', function () { 
        // When clicked, request is sent 
        loginStatus(apiUrl); 
    });
    loginBox.appendChild(loginButton);
   
    // Create hidden error field for potential login status errors
    const loginError = document.createElement('div'); 
    loginError.id = 'loginError';
    loginError.classList = 'loginError';
    loginBox.appendChild(loginError);
    
    // When x or outside modal skeleton is clicked, exit modal        
    window.addEventListener('click', function (event) {
      if (event.target == loginModal || event.target == closeModal) {
        loginModal.style.display = "none";
        loginError.innerText = "";
      }        
    });         
}

// Create sign up modal
function createSignUp (apiUrl) {
    
    // Create modal wrapper
    const signUpModal = document.createElement('div');
    signUpModal.id = 'signUpModal';
    signUpModal.classList = 'modal';
    root.appendChild(signUpModal);    
    
    // Create form wrapper
    const signupForm = document.createElement('div');
    signupForm.classList = 'modal-content';
    signUpModal.appendChild(signupForm);    
    
    // Create signup wrapper
    const signUpBox = document.createElement('div');
    signUpBox.id = 'signUpBox';
    signUpBox.classList = 'container';
    signupForm.appendChild(signUpBox);
    
    // Create label for username
    const createUsername = document.createElement('label');
    createUsername.innerText = "Username";
    signUpBox.appendChild(createUsername);
    
    // Create exit symbol
    const closeSignUp = document.createElement('span');
    closeSignUp.classList = 'close';
    closeSignUp.innerText = "x";
    signUpBox.appendChild(closeSignUp);    
        
    // Create a username register input
    const registerUser = document.createElement('input');
    registerUser.id = 'registerUsername';
    registerUser.placeholder = "Enter Username";
    registerUser.setAttribute('type', 'text');
    signUpBox.appendChild(registerUser);
     
    // Create a password label
    const createPassword = document.createElement('label');
    createPassword.innerText = "Password";
    signUpBox.appendChild(createPassword);
    
    // Create a register password input
    const registerPass = document.createElement('input');
    registerPass.id = 'registerPass1';    
    registerPass.placeholder = "Enter Password";
    registerPass.setAttribute('type', 'password');    
    signUpBox.appendChild(registerPass);    
    
    // Create a confirm passowrd input
    const secondPass = document.createElement('input');
    secondPass.id = 'registerPass2';    
    secondPass.placeholder = "Confirm Password";
    secondPass.setAttribute('type', 'password');    
    signUpBox.appendChild(secondPass);      
    
    // Create an email label
    const labelEmail = document.createElement('label');
    labelEmail.innerText = "Email";
    signUpBox.appendChild(labelEmail);    
        
    // Create a register email input
    const registerEmail = document.createElement('input');
    registerEmail.id = 'registerEmail';    
    registerEmail.placeholder = "Enter Email";
    registerEmail.setAttribute('type', 'text');    
    signUpBox.appendChild(registerEmail); 
    
    // Create a name label
    const labelName = document.createElement('label');
    labelName.innerText = "Name";
    signUpBox.appendChild(labelName);    

    // Create a register name input
    const registerName = document.createElement('input');
    registerName.id = 'registerName';    
    registerName.placeholder = "Enter Name";
    registerName.setAttribute('type', 'text');    
    signUpBox.appendChild(registerName);             
    
    // Create a signup button
    const signUpButton = document.createElement('button');
    signUpButton.innerText = "Sign Up";
    signUpButton.classList = 'loginButton';
    signUpButton.addEventListener('click', function () { 
        // If clicked send request to signup to the server
        signUpStatus(apiUrl); 
    });
    signUpBox.appendChild(signUpButton);
       
    // Create an invisible signup error text display for erros
    const signUpError = document.createElement('div'); 
    signUpError.id = 'signUpError';
    signUpError.classList = 'loginError';
    signUpBox.appendChild(signUpError);
    
    // If x or outside modal skeleton is clicked, hide modal    
    window.addEventListener('click', function (event) {
      if (event.target == signUpModal || event.target == closeSignUp) {
        signUpModal.style.display = "none";
        signUpError.innerText = "";
      }        
    });    
}

// Show search feed of a given search query
function showSearchPosts(apiUrl) {

    if (!localStorage.getItem("token")) {
        return;
    }

    // Grab the search query from the search bar input
    const searchTerm = document.getElementById('searchInput').value;
    document.getElementById('feed').style.display = "none"; 
    
    // Create a search feed wrapper
    const searchFeed = document.createElement('div');
    searchFeed.classList = 'publicPost';
    searchFeed.id = "searchFeed"; 
    root.appendChild(searchFeed);
        
    // Create search button header    
    const searchBack = document.createElement('div');
    searchBack.classList = 'feed-header';
    searchBack.id = 'searchBack';
    searchFeed.appendChild(searchBack);
    
    // Create back button
    const searchBackButton = document.createElement('button');
    searchBackButton.classList = 'button backComment';
    searchBackButton.innerText = "Back";
    // When clicked, go back to previous session
    searchBackButton.addEventListener('click', function () {
        showHideFeed()
    });
    searchBack.appendChild(searchBackButton);
        
    // Create post wrapper
    const foundPosts = document.createElement('div');
    foundPosts.id = 'foundPosts';
    searchFeed.appendChild(foundPosts);
    
    let subHeading = document.getElementById('subsedditHeading');
    let sum = 0; 
    // Gather all posts that contain the search query      
    getUserInfo(apiUrl)
    .then(json => {
    for (let i = 0; i < json.following.length; i++) {
        // Loop through each of the user's available posts
        getUserInfo(apiUrl, json.following[i])
        .then(myJson => {
            for (let j = 0; j < myJson.posts.length; j++) {
                // Loop through each post details
                getPostInfo(apiUrl, myJson.posts[j])
                .then(searchJson => {
                    // If search word is found, increment sum and add post to feed
                    if (searchJson.text.includes(searchTerm)) {
                        createFeedPost(searchJson, apiUrl, 4)  
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
        })
    }
})
}

export default initApp;
