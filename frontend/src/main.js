/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import { clearBody, showHideFeed } from './remove.js'

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // your app initialisation goes here
    
    const root = document.getElementById('root');  
    

    createBanner(apiUrl);  
    createBasePage(apiUrl, 0);
    createLogin(apiUrl);
    createSignUp (apiUrl);
    profilePage(apiUrl);         
    

}

// Create public banner
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
    // Add home refresh click event to logo
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
        
    // Create input field for search box
    const searchInput = document.createElement('input');
    searchInput.id = 'searchInput';
    searchInput.classList = 'inputBox';
    searchInput.placeholder = "Search Seddit";
    searchInput.type = 'search';    
    searchBox.appendChild(searchInput);
    
    const searchButton = document.createElement('button');
    searchButton.id = 'searchButton';
    searchButton.innerText = '\u2315'
    searchButton.classList = 'searchButton';
    searchButton.addEventListener('click', function() {
        if (document.getElementById('searchInput').textLength === 0) {
            return;
        }
        showHideFeed()
        showSearchPosts(apiUrl);
    })
    searchBox.appendChild(searchButton);    
    
    if (localStorage.getItem("token") === null) {
        // Create login button warapper
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
        
        // Create signup button wrapper
        const signupBox = document.createElement('li');
        signupBox.classList = 'nav-item';
        nav.appendChild(signupBox);  
        
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
    } else {
        const profileBox = document.createElement('li');
        profileBox.classList = 'nav-item';
        nav.appendChild(profileBox);  
        
        const profileLink = document.createElement('button'); 
        profileLink.classList = 'button button-primary'; 
        profileLink.addEventListener('click', function() {
            showHideFeed(1)       
            document.getElementById('profileWrapper').style.display = "";
        
        
        });
        profileBox.appendChild(profileLink);  
        
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
                profileLink.innerText = json.username;
                profileLink.id = "profileName";
                profileLink.setAttribute('check', json.id);
        }); 
            
        const logoutBox = document.createElement('li');
        logoutBox.classList = 'nav-item';
        nav.appendChild(logoutBox);  
        
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutButton';    
        logoutButton.classList = 'buttonThree';
        logoutButton.innerText = "LOG OUT";
        logoutButton.addEventListener('click', function() { 

            document.getElementById('profileWrapper').remove();    
            clearBody('logout');  
            createLogin(apiUrl);
            createBanner(apiUrl);  
            createBasePage(apiUrl, 0);                    
            
        });    
        logoutBox.appendChild(logoutButton);    
    } 
}

function grabSubseddit(apiUrl, subseddit) {

    if (!localStorage.getItem("token")) {
        return;
    }
    
    let found = 0;
    let subHeading = document.getElementById('subsedditHeading');
    let valueText = subHeading.innerText;
    
    if (subHeading.innerText === "") {
        valueText = subseddit;
    }
    getUserInfo(apiUrl)
    .then(json => {
        for (let i = 0; i < json.following.length; i++) {
            getUserInfo(apiUrl, json.following[i])
            .then(myJson => {
                for (let j = 0; j < myJson.posts.length; j++) {
                    getPostInfo(apiUrl, myJson.posts[j])
                    .then(searchJson => {  
                        if (valueText === searchJson.meta.subseddit && found === 0) { 
                            found = 1;
                            buildSubsedditPosts(apiUrl, valueText);
                        } else if (valueText === searchJson.meta.subseddit) {
                            createFeedPost(searchJson, apiUrl, 5)
                        }
                    });
                }
            })
        }
    })    
}

function buildSubsedditPosts(apiUrl, subHeading) {

    showHideFeed(4) 
    document.getElementById('feed').style.display = "none"; 
    
    document.getElementById('subsedditHeading').innerText = subHeading;
    
    // Create feed list
    const subsedditFeed = document.createElement('ul');
    subsedditFeed.id = 'subsedditFeed';
    subsedditFeed.classList = 'subsedditFeed';
    root.appendChild(subsedditFeed);
    
    // Create feed header
    const subFeedHeader = document.createElement('div');
    subFeedHeader.classList = 'feed-header';
    subsedditFeed.appendChild(subFeedHeader);
    
    // Create post button
    const subBackButton = document.createElement('button');
    subBackButton.classList = 'button button-primary';
    subBackButton.innerText = "Back";
    subBackButton.addEventListener('click', showHideFeed);
    subsedditFeed.appendChild(subBackButton);    
    
    // Create post button
    const postButton = document.createElement('button');
    postButton.classList = 'button button-secondary';
    postButton.innerText = "Post";
    postButton.addEventListener('click', function() {
        createPost(apiUrl, false, subHeading.innerText)
    });
    subsedditFeed.appendChild(postButton);
}



// Create non logged in base page
function createBasePage(apiUrl, num) {   
          
    // Create feed wrapper
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
    if (localStorage.getItem("token") === null) {
        feedHeading.innerText = "Public Feed";
    } else {
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
    
    if (localStorage.getItem("token") === null) {
    // Fetch public posts
    fetch(`${apiUrl}/post/public`)
        .then(res => res.json())
        .then(myJson => {        
            // Sort the posts based on their date
            myJson.posts.sort( (a, b) => a.meta.published - b.meta.published);
            // Loop through and add each post
            for (let i = 0; i < myJson.posts.length; i++) {
                createFeedPost(myJson.posts[i], apiUrl, 0)
    
            }
         }) 
    } else {
        addFeedPosts(num, apiUrl);
    }
    
    if (localStorage.getItem("token")) {
        let number = (num / 6) + 1;
        const pageBox = document.createElement('div');
        pageBox.classList = 'pagination';
        pageBox.id = 'pagination';
        mainFeed.appendChild(pageBox);
        
        const leftPage = document.createElement('button');
        leftPage.classList = 'leftButton';
        leftPage.innerText = "<";
        leftPage.addEventListener('click', function() {
            changePage(apiUrl, number - 1);
        });
        pageBox.appendChild(leftPage);
        
        const pageNumber = document.createElement('p');
        pageNumber.classList = 'postText';
        pageNumber.innerText = number;
        pageNumber.id = 'overallPage';
        pageBox.appendChild(pageNumber);
        
        const rightPage = document.createElement('button');
        rightPage.classList = 'rightButton';
        rightPage.innerText = ">";
        rightPage.addEventListener('click', function() {
            changePage(apiUrl, number + 1);
        });
        pageBox.appendChild(rightPage);
    }
             
}

function changePage(apiUrl, num) {

    let pageNum = document.getElementById('overallPage');
    if (parseInt(pageNum.innerText) === 1 && num <= 0) {
        return;
    }
    
    let page =  (num - 1) * 6; 

        
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
        if (myJson.posts.length === 0) {
            return;
        } else {
            document.getElementById('mainFeed').remove();         
            createBasePage(apiUrl, page);    
            pageNum.innerText = parseInt(pageNum.innerText) - 1         
        }
        });     
    
}

function addFeedPosts(num, apiUrl) {

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
        if (!myJson.posts.length) {
            return;
        }
            for (let i = 0; i < 6; i++) { 
                if (!myJson.posts[i]) {
                    break;
                }
                createFeedPost(myJson.posts[i], apiUrl, 1);                 
            }
        })              
}

function createFeedPost(myJson, apiUrl, check) {

    // Create a feed post
    let feedPost = document.createElement('li');
    feedPost.classList = 'post';
    feedPost.setAttribute('data-id-post', myJson.id);
    if (check === 0 || check === 1) {
        feed.appendChild(feedPost);  
    } else if (check === 2) {
        document.getElementById('otherProfile').appendChild(feedPost);    
    } else if (check === 3) {
        document.getElementById('profileWrapper').appendChild(feedPost);    
    } else if (check === 4) {
        document.getElementById('foundPosts').appendChild(feedPost);     
    } else if (check === 5) {
        document.getElementById('subsedditFeed').appendChild(feedPost);
    }
    
                    
    // Create upvote/downvote section
    let vote = document.createElement('div');
    vote.classList = 'vote';
       
    feedPost.appendChild(vote);
    
    if (localStorage.getItem("token") && check === 1) {
        let checkUser = document.getElementById("profileName");
        let checkUserId = parseInt(checkUser.attributes.check.value);  
        let included = myJson.meta.upvotes.includes(checkUserId);

       
        
        
        // Create upvote triangle                
        const upvote = document.createElement('div');
        upvote.id = "upVote" + myJson.id
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
        
        // Sum the number of upvotes a post has        
        let sum = myJson.meta.upvotes.length;                    
        // Display upvote number
        const voteNumber = document.createElement('p');
        voteNumber.innerText = sum;
        voteNumber.id = "voteNum" + myJson.id;
        
        voteNumber.addEventListener('click', function() {
            showUserVotes(myJson, apiUrl)
        });
        
        vote.appendChild(voteNumber);  
           
        // Create downvote triangle            
        const downvote = document.createElement('div');
        downvote.classList = 'frontDownArrow';
        downvote.id = "downVote" + myJson.id   
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
    } else {
        // Sum the number of upvotes a post has        
        let sum = myJson.meta.upvotes.length;                    
        // Display upvote number
        const voteNumber = document.createElement('p');
        voteNumber.innerText = sum;
        voteNumber.id = "voteNum" + myJson.id;        
        vote.appendChild(voteNumber); 
    }           
    
    // Create thumbnail wrapper               
    let imageBox = document.createElement('div');
    imageBox.classList = 'thumbnail';
    imageBox.addEventListener('click', function() { 
    /////////////////////////////////////
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
    
    if (check != 3) {
        let blankBox = document.createElement('div');
        blankBox.id = 'space';
        blankBox.classList = 'extraSpace';
        blankBox.addEventListener('click', function() { 
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
        let editDelete = document.createElement('div');
        editDelete.classList = 'editDelete';
        feedPost.appendChild(editDelete);
        
        let editPost = document.createElement('button');
        editPost.id = 'editPost';
        editPost.innerText = 'Edit';
        editPost.classList = 'sideBar';  
        editPost.addEventListener('click', function() {
            createPost(apiUrl, myJson);
        });    
        editDelete.appendChild(editPost);   
        
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

function removePost(apiUrl, myJson, feedPost) {

    let confirmAlert = confirm("This post will be permanently deleted");
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
                feedPost.remove();
            });
    } else {
        return;
    }

}



function followFunct (apiUrl, username) {
        
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token") ,
            "username": username  
        },
        method: "PUT"
    } 
    fetch(`${apiUrl}/user/follow?username=${username}`, options)
        .then(res => res.json())
        .then(json => {
            document.getElementById('followButton').remove();
            
            const followUser = document.createElement('button');
            followUser.classList = 'button';
            followUser.innerText = "Follow"; 
            followUser.addEventListener('click', function() {
                unfollowUser(apiUrl, username);
            });
            followUser.id = 'followButton';   
            document.getElementById('profileButtons').appendChild(followUser);  
        })    
}

function unfollowUser(apiUrl, username) {
        
    let options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token") ,
            "username": username  
        },
        method: "PUT"
    } 
    fetch(`${apiUrl}/user/follow?username=${username}`, options)
        .then(res => res.json())
        .then(json => {
            document.getElementById('followButton').remove();
            
            const followUser = document.createElement('button');
            followUser.classList = 'button';
            followUser.innerText = "Unfollow"; 
            followUser.addEventListener('click', function() {
                followFunct (apiUrl, username) 
            });
            followUser.id = 'followButton';   
            document.getElementById('profileButtons').appendChild(followUser);
        })    
}

function showUserPage(apiUrl, username) {

/////////////////

    if (!localStorage.getItem("token")) {
        return;
    }
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
      
                document.getElementById('feed').style.display = "none"; 
                const profileWrapper = document.createElement('div');
                profileWrapper.classList = 'publicPost';
                profileWrapper.id = "otherProfile"; 
                root.appendChild(profileWrapper);
                    
                // Create button header    
                const profileButtons = document.createElement('div');
                profileButtons.classList = 'feed-header';
                profileButtons.id = 'profileButtons';
                profileWrapper.appendChild(profileButtons);
                
                // Create back button
                const profileBack = document.createElement('button');
                profileBack.classList = 'button';
                profileBack.innerText = "Back";
                // When click, go back to previous session
                profileBack.addEventListener('click', function () {
                    profileWrapper.remove();
                    document.getElementById('feed').style.display = ""; 
                    document.getElementById('pagination').style.display = "";     
                    window.scrollTo(0, 0);  
                });
                profileButtons.appendChild(profileBack);
                
               
                const followUser = document.createElement('button');
                followUser.classList = 'button';
                              
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


                // Create post wrapper
                const profileBox = document.createElement('div');
                profileBox.classList = 'submitPost';
                profileWrapper.appendChild(profileBox);
                      
                
                const profileUsername = document.createElement('p');
                profileUsername.innerText = "Username:  ";
                profileUsername.classList = 'profileTitle';
                profileBox.appendChild(profileUsername);        
                
                const profileUser = document.createElement('p');
                profileUser.innerText = json.username; 
                profileUser.classList = 'profileInfo'; 
                profileUsername.appendChild(profileUser);                 
                
                const profileEmail = document.createElement('p');
                profileEmail.innerText = "Email:";
                profileEmail.classList = 'profileTitle';        
                profileBox.appendChild(profileEmail);    
                
                const emailAddress = document.createElement('p');
                emailAddress.innerText = json.email;
                emailAddress.id = 'emailAddress';
                emailAddress.classList = 'profileInfo';        
                profileEmail.appendChild(emailAddress);   
                
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
                
                const profileId = document.createElement('p');
                profileId.innerText = "User ID: ";
                profileId.classList = 'profileTitle';
                profileBox.appendChild(profileId);
                
                const profileIdNum = document.createElement('p');
                profileIdNum.innerText = json.id;
                profileIdNum.classList = 'profileInfo';
                profileId.appendChild(profileIdNum);
                        
                
                const profileFollowers = document.createElement('p');
                profileFollowers.innerText = "Number of Followers:  ";
                profileFollowers.classList = 'profileTitle';
                profileFollowers.id = 'followerChange';
                profileBox.appendChild(profileFollowers);
                
                const followedNum = document.createElement('p');
                followedNum.innerText = json.followed_num;
                followedNum.classList = 'profileInfo';
                profileFollowers.appendChild(followedNum);
                
                const foloowingNum = document.createElement('p');
                foloowingNum.innerText = "Following:  ";
                foloowingNum.classList = 'profileTitle';
                profileBox.appendChild(foloowingNum);
                
                const numbFoloowing = document.createElement('p');
                numbFoloowing.innerText = json.following.length;
                numbFoloowing.classList = 'profileInfo';
                foloowingNum.appendChild(numbFoloowing);   
                       
                
                for (let i = 0; i < json.posts.length; i++) {
                    getPostInfo(apiUrl, json.posts[i])
                    .then(myJson => {
                        createFeedPost(myJson, apiUrl, 2)
                    });
                }
            });
        });    
    
}
function updateProfile(apiUrl, json) {
    
    const updateModal = document.createElement('div');
    updateModal.id = 'updateModal';
    updateModal.classList = 'modal';
    root.appendChild(updateModal);    
    
    const updateForm = document.createElement('div');
    updateForm.classList = 'modal-content';
    updateModal.appendChild(updateForm);    
    
    const updateBox = document.createElement('div');
    updateBox.id = 'updateBox';
    updateBox.classList = 'container';
    updateForm.appendChild(updateBox);
    
    
        
    const updateEmail = document.createElement('label');
    updateEmail.innerText = "Update Email:";
    updateBox.appendChild(updateEmail);
    
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
     
    const updateName = document.createElement('label');
    updateName.innerText = "Update Name:";
    updateBox.appendChild(updateName);
    
    const nameInput = document.createElement('input');
    nameInput.id = 'nameInput';    
    nameInput.placeholder = "Enter Name";
    nameInput.setAttribute('type', 'text');    
    updateBox.appendChild(nameInput);  
    
    const updatePass = document.createElement('label');
    updatePass.innerText = "Update Password";
    updateBox.appendChild(updatePass);
    
    const updatePassOne = document.createElement('input');
    updatePassOne.id = 'updatePassOne';    
    updatePassOne.placeholder = "Enter Password";
    updatePassOne.setAttribute('type', 'password');    
    updateBox.appendChild(updatePassOne);    
    
    const updatePassTwo = document.createElement('input');
    updatePassTwo.id = 'updatePassTwo';    
    updatePassTwo.placeholder = "Confirm Password";
    updatePassTwo.setAttribute('type', 'password');    
    updateBox.appendChild(updatePassTwo); 
    
      
    
    const updateButton = document.createElement('button');
    updateButton.innerText = "Update";
    updateButton.classList = 'loginButton';
    updateButton.addEventListener('click', function () { 
        updateStatus (apiUrl)
    });
    updateBox.appendChild(updateButton);
   
    const updateError = document.createElement('div'); 
    updateError.id = 'updateError';
    updateError.classList = 'loginError';
    updateBox.appendChild(updateError);
            
    window.addEventListener('click', function (event) {
      if (event.target == updateModal || event.target == closeUpdate) {
        updateModal.style.display = "none";
        updateError.innerText = "";
      }        
    });   
    
    updateModal.style.display = 'inline';          
}


function updateStatus (apiUrl) {

    const email = document.getElementById('emailInput').value;
    const realName = document.getElementById('nameInput').value;          
    const passOne = document.getElementById('updatePassOne').value; 
    const passTwo = document.getElementById('updatePassTwo').value;  
    const updateError = document.getElementById('updateError');
    
    if (email === "" && realName === "" && 
        passOne === "" && passTwo === "") {
        updateError.innerText = "Fields must not be Empty";
        return;
    } else if (passOne != passTwo) {
        updateError.innerText = "Passwords do not match";
        return;   
    } else if (passOne.length === 1) {
        updateError.innerText = "Password must be greater than one character";
        return;       
    }

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








function profilePage(apiUrl, username) {
    if (!localStorage.getItem("token")) {
        return;
    }
    

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
     
             
   
                const profileWrapper = document.createElement('div');
                profileWrapper.classList = 'publicPostExtra';
                profileWrapper.style.display = "none";
                profileWrapper.id = 'profileWrapper' 
                root.appendChild(profileWrapper);
                    
                // Create button header    
                const profileButtons = document.createElement('div');
                profileButtons.classList = 'feed-header';
                profileWrapper.appendChild(profileButtons);
                
                // Create back button
                const profileBack = document.createElement('button');
                profileBack.classList = 'button';
                profileBack.innerText = "Back";
                // When click, go back to previous session
                profileBack.addEventListener('click', function () {
                
               
                    showHideFeed();
                    
                    document.getElementById('mainFeed').style.display = ""; 
                    document.getElementById('pagination').style.display = "";     
                    window.scrollTo(0, 0);  
                });
                profileButtons.appendChild(profileBack);
                
                // Create comment button
                const editProfile = document.createElement('button');
                editProfile.classList = 'button';
                editProfile.innerText = "Update Profile";  
                editProfile.addEventListener('click', function() {
                    updateProfile(apiUrl, json);
                });       
                profileButtons.appendChild(editProfile);

                // Create post wrapper
                const profileBox = document.createElement('div');
                profileBox.classList = 'submitPost';
                profileWrapper.appendChild(profileBox);
                      
                
                const profileUsername = document.createElement('p');
                profileUsername.innerText = "Username:  ";
                profileUsername.classList = 'profileTitle';
                profileBox.appendChild(profileUsername);        
                
                const profileUser = document.createElement('p');
                profileUser.innerText = json.username; 
                profileUser.classList = 'profileInfo'; 
                profileUsername.appendChild(profileUser);                 
                
                const profileEmail = document.createElement('p');
                profileEmail.innerText = "Email:";
                profileEmail.classList = 'profileTitle';        
                profileBox.appendChild(profileEmail);    
                
                const emailAddress = document.createElement('p');
                emailAddress.innerText = json.email;
                emailAddress.id = 'emailAddress';
                emailAddress.classList = 'profileInfo';        
                profileEmail.appendChild(emailAddress);   
                
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
                
                const profileId = document.createElement('p');
                profileId.innerText = "User ID: ";
                profileId.classList = 'profileTitle';
                profileBox.appendChild(profileId);
                
                const profileIdNum = document.createElement('p');
                profileIdNum.innerText = json.id;
                profileIdNum.classList = 'profileInfo';
                profileId.appendChild(profileIdNum);
                        
                
                const profileFollowers = document.createElement('p');
                profileFollowers.innerText = "Number of Followers:  ";
                profileFollowers.classList = 'profileTitle';
                profileBox.appendChild(profileFollowers);
                
                const followedNum = document.createElement('p');
                followedNum.innerText = json.followed_num;
                followedNum.classList = 'profileInfo';
                profileFollowers.appendChild(followedNum);
                
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
                
                for (let j = 0; j < json.following.length; j++) {
                    let followUser = document.createElement('p');
                    getUserInfo(apiUrl, json.following[j])
                    .then(json => {
                        followUser.innerText = json.username + ", ";
                    })
                    followUser.classList = 'followListItem';
                    followBox.appendChild(followUser);
                }
                
                for (let i = 0; i < json.posts.length; i++) {
                    getPostInfo(apiUrl, json.posts[i])
                    .then(myJson => {
                        createFeedPost(myJson, apiUrl, 3)
                    });
                }
            });
        });    
}


function showUserVotes(myJson, apiUrl) {
    
    const userVoteModal = document.createElement('div');
    userVoteModal.id = 'userVoteModal';
    userVoteModal.classList = 'voteModal';
    root.appendChild(userVoteModal);    
    
    const userVoteWrapper = document.createElement('div');
    userVoteWrapper.classList = 'voteModalContent';
    userVoteModal.appendChild(userVoteWrapper);    
    
    const userVoteBox = document.createElement('div');
    userVoteBox.id = 'userVoteBox';
    userVoteWrapper.appendChild(userVoteBox);
    
    const userVoteLabel = document.createElement('label');
    userVoteLabel.innerText = "Users that have upvoted this post:";
    userVoteBox.appendChild(userVoteLabel);
        
    const closeVoteModal = document.createElement('span');
    closeVoteModal.classList = 'VoteClose';
    closeVoteModal.innerText = "x";
    userVoteBox.appendChild(closeVoteModal);
    
    const userVoteList = document.createElement('ul');
    userVoteList.classList = 'voteModalList';
    userVoteBox.appendChild(userVoteList);
    
    let checkDown = document.getElementById('downVote' + myJson.id);
    checkDown = parseInt(checkDown.attributes.checked.value);
    let profile = document.getElementById('profileName');
    let num = parseInt(profile.attributes.check.value)
    let found = 0;
    for (let i = 0; i < myJson.meta.upvotes.length; i++) { 
        if (myJson.meta.upvotes[i] === parseInt(num)) {

            found = 1;
        }
        let checkUser = getUserInfo(apiUrl, myJson.meta.upvotes[i]);
        checkUser.then(json => {
            if (checkDown === 1 && json.id === parseInt(num)) {
                return;
            } else {
                let userVoteName = document.createElement('li');        
                userVoteName.innerText = json.username;
                userVoteList.appendChild(userVoteName);            
            }
        });
    }
    
    let checkUp = document.getElementById('upVote' + myJson.id);
    checkUp = parseInt(checkUp.attributes.checked.value);
    if (found === 0 && checkUp === 1) {
        let userVoteName = document.createElement('li');        
        userVoteName.innerText = profile.innerText;
        userVoteList.appendChild(userVoteName);          
    }

        
        
    window.addEventListener('click', function (event) {
        if (event.target == userVoteModal || event.target == closeVoteModal) {
            userVoteModal.remove();
        }        
    });        
}

function getUserInfo(apiUrl, id) {
    
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
    } else {
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

function getPostInfo(apiUrl, id) {

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

function upvotePost(myJson, apiUrl, upFunction) {

    let voteNum = document.getElementById("voteNum" + myJson.id);
    let liveNum = voteNum.innerText;
    let upvote = document.getElementById("upVote" + myJson.id);
    let downvote = document.getElementById("downVote" + myJson.id);
    let downFunction = function() { 
        downVotePost(myJson, apiUrl, downFunction) };          
 
    let showVoteNum = document.getElementById('showVoteNum' + myJson.id);
    let showDownVote = document.getElementById('showDownvote' + myJson.id);
    let showUpvote = document.getElementById('showUpvote' + myJson.id);    
    
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
            voteNum.innerText = parseInt(liveNum) + 1;
            upvote.classList = 'frontDisUp';
            downvote.classList = 'frontDownArrow';
            upvote.removeEventListener('click', upFunction);
            downvote.addEventListener('click', downFunction);
            upvote.setAttribute('checked', 1);
            downvote.setAttribute('checked', 0);
             
            if (showVoteNum) {
                showVoteNum.innerText = parseInt(liveNum) + 1;
                showUpvote.classList = 'showDisUp';
                showDownVote.classList = 'downArrow';
                showUpvote.removeEventListener('click', upFunction);
                showDownVote.removeEventListener('click', downFunction);
                showDownVote.addEventListener('click', downFunction);
            }                                
              
        })
    })                    
}

function downVotePost(myJson, apiUrl, downFunction) {


    let voteNum = document.getElementById("voteNum" + myJson.id);
    let liveNum = voteNum.innerText;
    let downvote = document.getElementById("downVote" + myJson.id);
    let upvote = document.getElementById("upVote" + myJson.id);
    let upFunction = function() { 
        upvotePost(myJson, apiUrl, upFunction) };  
    
    let showVoteNum = document.getElementById('showVoteNum' + myJson.id);
    let showDownVote = document.getElementById('showDownvote' + myJson.id);
    let showUpvote = document.getElementById('showUpvote' + myJson.id);
    
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
            voteNum.innerText = parseInt(liveNum) - 1;
            downvote.classList = 'frontDisDown';
            upvote.classList = 'frontUpArrow';
            downvote.removeEventListener('click', downFunction);
            upvote.addEventListener('click', upFunction);
            upvote.setAttribute('checked', 0); 
            downvote.setAttribute('checked', 1);           
            
            if (showVoteNum) {
                showVoteNum.innerText = parseInt(liveNum) - 1;
                showDownVote.classList = 'showDisDown';
                showUpvote.classList = 'upArrow';
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
    backButton.classList = 'button';
    backButton.innerText = "Back";
    // When click, go back to previous session
    backButton.addEventListener('click', function () {
        if (sum && document.getElementById('pagination')) {
            let num = document.getElementById("showVoteNum" + myJson.id).innerText;
            sum.innerText = num;

      
            if (document.getElementById('comment' + myJson.id)) {
                postDiv.style.display = "none";
            } else {
                postDiv.remove();
            }
                        
            showHideFeed();    
            document.getElementById('pagination').style.display = "";  
            window.scrollTo(0, scrollPosition);
        } else {
             if (document.getElementById('comment' + myJson.id)) {
                postDiv.style.display = "none";
            } else {
                postDiv.remove();
            }
            if (document.getElementById('commentWrap')) {
                document.getElementById('commentWrap').remove();
            }        
            document.getElementById('feed').style.display = ""; 
            document.getElementById('subsedditHeading').innerText = "";  
           
        }
    });
    buttonHeader.appendChild(backButton);
    
    // Create comment button
    const commentButton = document.createElement('button');
    commentButton.classList = 'button';
    commentButton.innerText = "Comment"; 
    commentButton.addEventListener('click', function() {
        if (document.getElementById('commentWrap')) {
            document.getElementById('commentWrap').remove();
        }
        postComment(apiUrl, myJson);
    });   
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
    commentPost.id = 'commentTree';
    postDiv.appendChild(commentPost);
                    
    // Create upvote/downvote box
    const commentVote = document.createElement('div');
    commentVote.classList = 'vote';
    commentPost.appendChild(commentVote);   
        
        
    if (localStorage.getItem("token") && document.getElementById("upVote" + myJson.id)) {        
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
        voteNumber.setAttribute('data-id-upvotes', '');
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
                
    let postedBy = document.createElement('p');
    postedBy.innerText = "Posted by";
    postedBy.classList = 'detailNormal';
    detailBox.appendChild(postedBy);   

    let author = document.createElement('p');
    author.innerText = "@" + myJson.meta.author;
    author.classList = 'author';
    author.setAttribute('data-id-author', '');

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
                     
    let time = new Date(myJson.meta.published * 1000);    
    const postDate = document.createElement('p');
    postDate.innerText = "on " + time;
    postDate.classList = 'detailNormal';
    detailBox.appendChild(postDate); 
    
    let commentNum = document.createElement('p');
    commentNum.innerText = ":  " + myJson.comments.length + " comments";
    commentNum.classList = 'detailNormal'; 
    detailBox.appendChild(commentNum);   
                      
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
        commentAuthor.classList = 'commentAuthor';
        commentAuthor.addEventListener('click', function () {
            if (!localStorage.getItem("token")) {
                return;
            }        
            document.getElementById('subsedditHeading').innerText = "";
            document.getElementById('postTree' + myJson.id).style.display = "none";
            document.getElementById('feed').style.display = "";
            showHideFeed()
            showUserPage(apiUrl, myJson.comments[i].author);
        });         
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
    // When click, go back to previous session
    hideComment.addEventListener('click', function () {
        commentWrap.remove();
    });
    postCommentButtons.appendChild(hideComment);
    
    // Create comment button
    const submitComment = document.createElement('button');
    submitComment.classList = 'button';
    submitComment.innerText = "Submit";  
    submitComment.addEventListener('click', function() {
        appendNewComment(apiUrl, myJson.id, commentText.value)
    });       
    postCommentButtons.appendChild(submitComment);          

    // Create post wrapper
    const commentBox = document.createElement('div');
    commentBox.classList = 'submitPost';
    commentWrap.appendChild(commentBox);
          
    
    const commentTitle = document.createElement('label');
    commentTitle.innerText = "Comment:";
    commentBox.appendChild(commentTitle);
        
    const commentText = document.createElement('textarea');
    commentText.id = 'commentText';
    commentText.classList = 'postDescription';
    commentText.placeholder = "Enter comment";
    commentBox.appendChild(commentText);   
    
    // Create comment button
    const commentSubmit = document.createElement('button');
    commentSubmit.classList = 'submitButton';
    commentSubmit.innerText = "Submit";  
    commentSubmit.addEventListener('click', function() {
        appendNewComment(apiUrl, myJson.id, commentText.value)
    });  
    commentBox.appendChild(commentSubmit);  
    
    commentSubmit.scrollIntoView();    
}

function appendNewComment(apiUrl, id, value) {

        if (value.length === 0) {
            alert('Comment cannot be empty');
            return;
        }    
        sendComment(apiUrl, id, value)
        .then(json => {
            commentWrap.remove();
            
            let commentTree = document.getElementById('postTree' + id);    
            let userName = document.getElementById('profileName');
                    
            let commentBox = document.createElement('div');
            commentBox.classList = "comment";
            commentBox.id = 'comment' + id;
            commentTree.appendChild(commentBox);
            
            let commentDetails = document.createElement('div');
            commentDetails.classList = 'publicLayout';
            commentBox.appendChild(commentDetails);
            
            let commentAuthor = document.createElement('p');
            commentAuthor.innerText = "@" + userName.innerText;
            commentDetails.appendChild(commentAuthor);              
            
            let commentDate = document.createElement('p');
            commentDate.innerText = new Date();
            commentDetails.appendChild(commentDate);
            
            let commentDiv = document.createElement('div');
            commentBox.appendChild(commentDiv);
            let commentPost = document.createElement('p');
            commentPost.innerText = value;
            commentPost.classList = 'description';
            commentDiv.appendChild(commentPost);  
            
            commentPost.scrollIntoView();
                        
                          
        });
}

function sendComment(apiUrl, id, comment) {

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

function createPost(apiUrl, myJson, subseddit) {

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
        submitPost(apiUrl)
    });       
    createPostButtons.appendChild(submitButton);          




    // Create post wrapper
    const createPostWrapper = document.createElement('div');
    createPostWrapper.classList = 'submitPost';
    createPostWrapper.Id = 'postBoxRemove';
    createPostDiv.appendChild(createPostWrapper);
          
    
    const postTitle = document.createElement('label');
    postTitle.innerText = "Post Title";
    createPostWrapper.appendChild(postTitle);

    const postTitleInput = document.createElement('input');
    postTitleInput.id = 'postTitle';
    if (myJson) {
        postTitleInput.value = myJson.title;
    } else {
        postTitleInput.placeholder = "Enter name of your Post Title";    
    }
    postTitleInput.setAttribute('type', 'text');
    createPostWrapper.appendChild(postTitleInput);
     
    const subsedditTitle = document.createElement('label');
    subsedditTitle.innerText = "Subseddit";
    createPostWrapper.appendChild(subsedditTitle);

    const subsedditPostInput = document.createElement('input');
    subsedditPostInput.id = 'postSubseddit';    
    if (myJson) {
        subsedditPostInput.value = myJson.meta.subseddit;
    } else if (subseddit) {
        subsedditPostInput.value = subseddit;
    } else {
        subsedditPostInput.placeholder = "Enter name of subseddit you want to post to";   
    }    
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
    if (myJson) {
        postDescription.innerText = myJson.text;
    } else {
        postDescription.placeholder = "Enter text contents of your post";  
    }     
    createPostWrapper.appendChild(postDescription);   
    
    // Create comment button
    const bottomSubmit = document.createElement('button');
    bottomSubmit.classList = 'submitButton';
    bottomSubmit.innerText = "Submit";  
    bottomSubmit.addEventListener('click', function() {
        submitPost(apiUrl, myJson)
    });  
    createPostWrapper.appendChild(bottomSubmit);         
}

function submitPost(apiUrl, myJson) {

    console.log(myJson);
    
    
    const title = document.getElementById('postTitle').value;
    const subseddit = document.getElementById('postSubseddit').value;    
    const image = document.getElementById('postImage').files[0];
    const text = document.getElementById('postDescription').value;
    
    if (!title || !subseddit || !text) {
        alert("Must not have an empty text field");
        return;
    }
    
    if (image && myJson) {
    console.log("EDIT WITH IMAGE")    
        const reader = new FileReader();
        reader.onloadend = function() {
            let extract = reader.result.replace("data:image/jpeg;base64,", "");
            
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
    } else if (myJson) {
    console.log("EDIT WITHOUT IMAGE")
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
    } else if (image) {
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
                    window.scrollTo(0, 0);  
                    alert("Sucessfully posted to " + subseddit); 
                }        
            })
        })             
    }        
}





function createLogin (apiUrl) {
    
    const loginModal = document.createElement('div');
    loginModal.id = 'loginModal';
    loginModal.classList = 'modal';
    root.appendChild(loginModal);    
    
    const loginForm = document.createElement('div');
    loginForm.classList = 'modal-content';
    loginModal.appendChild(loginForm);    
    
    const loginBox = document.createElement('div');
    loginBox.id = 'loginBox';
    loginBox.classList = 'container';
    loginForm.appendChild(loginBox);
        
    const usernameLabel = document.createElement('label');
    usernameLabel.innerText = "Username";
    loginBox.appendChild(usernameLabel);
    
    const closeModal = document.createElement('span');
    closeModal.classList = 'close';
    closeModal.innerText = "x";
    closeModal.id = 'loginClose';
    loginBox.appendChild(closeModal);    
    
    const usernameInput = document.createElement('input');
    usernameInput.id = 'usernameInput';
    usernameInput.placeholder = "Enter Username";
    usernameInput.setAttribute('type', 'text');
    loginBox.appendChild(usernameInput);
     
    const passwordLabel = document.createElement('label');
    passwordLabel.innerText = "Password";
    loginBox.appendChild(passwordLabel);
    
    const passwordInput = document.createElement('input');
    passwordInput.id = 'passwordInput';    
    passwordInput.placeholder = "Enter Password";
    passwordInput.setAttribute('type', 'password');    
    loginBox.appendChild(passwordInput);    
    
    const loginButton = document.createElement('button');
    loginButton.innerText = "Log In";
    loginButton.classList = 'loginButton';
    loginButton.addEventListener('click', function () { 
        loginStatus(apiUrl); 
    });
    loginBox.appendChild(loginButton);
   
    const loginError = document.createElement('div'); 
    loginError.id = 'loginError';
    loginError.classList = 'loginError';
    loginBox.appendChild(loginError);
            
    window.addEventListener('click', function (event) {
      if (event.target == loginModal || event.target == closeModal) {
        loginModal.style.display = "none";
        loginError.innerText = "";
      }        
    });         
}

function createSignUp (apiUrl) {
    
    const signUpModal = document.createElement('div');
    signUpModal.id = 'signUpModal';
    signUpModal.classList = 'modal';
    root.appendChild(signUpModal);    
    
    const signupForm = document.createElement('div');
    signupForm.classList = 'modal-content';
    signUpModal.appendChild(signupForm);    
    
    const signUpBox = document.createElement('div');
    signUpBox.id = 'signUpBox';
    signUpBox.classList = 'container';
    signupForm.appendChild(signUpBox);
    
    const createUsername = document.createElement('label');
    createUsername.innerText = "Username";
    signUpBox.appendChild(createUsername);
        
    const closeSignUp = document.createElement('span');
    closeSignUp.classList = 'close';
    closeSignUp.innerText = "x";
    signUpBox.appendChild(closeSignUp);    
        
    const registerUser = document.createElement('input');
    registerUser.id = 'registerUsername';
    registerUser.placeholder = "Enter Username";
    registerUser.setAttribute('type', 'text');
    signUpBox.appendChild(registerUser);
     
    const createPassword = document.createElement('label');
    createPassword.innerText = "Password";
    signUpBox.appendChild(createPassword);
    
    const registerPass = document.createElement('input');
    registerPass.id = 'registerPass1';    
    registerPass.placeholder = "Enter Password";
    registerPass.setAttribute('type', 'password');    
    signUpBox.appendChild(registerPass);    
    
    const secondPass = document.createElement('input');
    secondPass.id = 'registerPass2';    
    secondPass.placeholder = "Confirm Password";
    secondPass.setAttribute('type', 'password');    
    signUpBox.appendChild(secondPass);      
    
    const labelEmail = document.createElement('label');
    labelEmail.innerText = "Email";
    signUpBox.appendChild(labelEmail);    
        
    const registerEmail = document.createElement('input');
    registerEmail.id = 'registerEmail';    
    registerEmail.placeholder = "Enter Email";
    registerEmail.setAttribute('type', 'text');    
    signUpBox.appendChild(registerEmail); 
    
    const labelName = document.createElement('label');
    labelName.innerText = "Name";
    signUpBox.appendChild(labelName);    

    const registerName = document.createElement('input');
    registerName.id = 'registerName';    
    registerName.placeholder = "Enter Name";
    registerName.setAttribute('type', 'text');    
    signUpBox.appendChild(registerName);             
    
    const signUpButton = document.createElement('button');
    signUpButton.innerText = "Sign Up";
    signUpButton.classList = 'loginButton';
    signUpButton.addEventListener('click', function () { 
        signUpStatus(apiUrl); 
    });
    signUpBox.appendChild(signUpButton);
       
    const signUpError = document.createElement('div'); 
    signUpError.id = 'signUpError';
    signUpError.classList = 'loginError';
    signUpBox.appendChild(signUpError);
        
    window.addEventListener('click', function (event) {
      if (event.target == signUpModal || event.target == closeSignUp) {
        signUpModal.style.display = "none";
        signUpError.innerText = "";
      }        
    });    
}


function loginStatus (apiUrl) {

    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;    
    const loginError = document.getElementById('loginError');

    let options = {
        method: "POST",
        body: JSON.stringify({"username":username,"password":password}),
        headers:{"Content-Type":"application/json"},
    };

    fetch(`${apiUrl}/auth/login`, options)
    .then(response => {
        response.json().then(json => {
            if (response.status != 200) {
                loginError.innerText = json.message;
            } else {   
                let arg = json.token;
                buildLoggedIn(arg, apiUrl);
            }        
        })
    })       
}

function signUpStatus (apiUrl) {

    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const passOne = document.getElementById('registerPass1').value; 
    const passTwo = document.getElementById('registerPass2').value;  
    const realName = document.getElementById('registerName').value;          
    const signUpError = document.getElementById('signUpError');

    if (passOne === "" || passTwo === "" || email === "" || realName === ""
    || username === "") {
        signUpError.innerText = "Fields must not be Empty";
        return;
    } else if (passOne != passTwo) {
        signUpError.innerText = "Passwords do not match";
        return;   
    }
    
    let options = {
        method: "POST",
        body: JSON.stringify({
            "username":username,
            "password":passOne,
            "email":email,
            "name":realName}),
        headers:{"Content-Type":"application/json"},
    };

    fetch(`${apiUrl}/auth/signup`, options)
    .then(response => {
        response.json().then(json => {
            if (response.status != 200) {
                signUpError.innerText = json.message;
            } else {   
                document.getElementById('registerEmail').value = "";
                document.getElementById('registerUsername').value = "";
                document.getElementById('registerPass1').value = ""; 
                document.getElementById('registerPass2').value = "";  
                document.getElementById('registerName').value = ""; 
                document.getElementById("signUpModal").style.display = "";
                document.getElementById("loginModal").style.display = "inline";
                let printSucess = document.getElementById("loginError");
                printSucess.innerText = "Sign up sucessful. You may now log in";
            }    
        })
    })         
}

function buildLoggedIn(arg, apiUrl) {
    localStorage.setItem("token", arg)
    clearBody('login');
    createBanner(apiUrl)
    createBasePage(apiUrl, 0);
    profilePage(apiUrl); 
}

function showSearchPosts(apiUrl) {

    if (!localStorage.getItem("token")) {
        return;
    }

    const searchTerm = document.getElementById('searchInput').value;
    
    
    console.log(searchTerm);
    
    document.getElementById('feed').style.display = "none"; 
    
    const searchFeed = document.createElement('div');
    searchFeed.classList = 'publicPost';
    searchFeed.id = "searchFeed"; 
    root.appendChild(searchFeed);
        
    // Create button header    
    const searchBack = document.createElement('div');
    searchBack.classList = 'feed-header';
    searchBack.id = 'searchBack';
    searchFeed.appendChild(searchBack);
    
    // Create back button
    const searchBackButton = document.createElement('button');
    searchBackButton.classList = 'button';
    searchBackButton.innerText = "Back";
    // When click, go back to previous session
    searchBackButton.addEventListener('click', function () {
        showHideFeed()
    });
    searchBack.appendChild(searchBackButton);
        
    const foundPosts = document.createElement('div');
    foundPosts.id = 'foundPosts';
    searchFeed.appendChild(foundPosts);
    
    let subHeading = document.getElementById('subsedditHeading');
    let sum = 0;       
    getUserInfo(apiUrl)
    .then(json => {

        for (let i = 0; i < json.following.length; i++) {

            getUserInfo(apiUrl, json.following[i])
            .then(myJson => {

                for (let j = 0; j < myJson.posts.length; j++) {

                    getPostInfo(apiUrl, myJson.posts[j])
                    .then(searchJson => {
                        if (searchJson.text.includes(searchTerm)) {
                            createFeedPost(searchJson, apiUrl, 4)  
                            sum++;
                        }
                        if (sum === 1) {
                            subHeading.innerText = "1 result for '" + searchTerm + "'";
                        } else {
                            subHeading.innerText = sum + " results for '" + searchTerm + "'";                        
                        }             
                    });
                }
            })
        }
    })
        
   

}








export default initApp;
