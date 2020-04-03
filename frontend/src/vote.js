import { clearBody, showHideFeed } from './remove.js'





// Upvote a post live function
export function upvotePost(myJson, apiUrl, upFunction) {

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
export function downVotePost(myJson, apiUrl, downFunction) {
    
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
