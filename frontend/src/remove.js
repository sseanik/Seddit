

// Remove and rest feed display
export function clearBody(check) {
    const main = document.getElementById("mainFeed");
    main.parentNode.removeChild(main);
    if (document.getElementById('pagination')) {
        document.getElementById('pagination').remove();
    }
    if (document.getElementById('otherProfile')) {
        document.getElementById('otherProfile').remove();
    } 
    if (document.getElementById('profileWrapper')) {
        document.getElementById('profileWrapper').style.display = "none";    
    }    
    if (document.getElementById('subsedditHeading')){  
        document.getElementById('subsedditHeading').innerText = "";    
    }   
    if (check === 'logout') {
        document.getElementById("navHeader").remove();
        localStorage.removeItem('token');          
    }
    if (check === 'login') {
        document.getElementById("navHeader").remove();
        document.getElementById("loginModal").remove();     
    }
    if (document.getElementById('subsedditFeed')) {     
        document.getElementById('subsedditFeed').remove();
    }     
}

// Show and hide certain elements of the feed
export function showHideFeed(num) {
    if (num === 1) {
        document.getElementById('feed').style.display = "none";  
    } else {
        document.getElementById('feed').style.display = "";
    }
    if (document.getElementById('pagination')) {
        document.getElementById('pagination').style.display = "none";
    }  
    
    if (document.getElementById('createPost')) {
        document.getElementById('createPost').remove();
    }
    if (document.getElementById('profileWrapper')) {
        document.getElementById('profileWrapper').style.display = "none";
    }
    if (document.getElementById('otherProfile')) {
        document.getElementById('otherProfile').remove();
    }
    if (document.getElementById('searchFeed')) {
        document.getElementById('searchFeed').remove();
    }   
    if (document.getElementById('commentWrap')) {
        document.getElementById('commentWrap').remove();
    }    
    let visible = document.getElementsByClassName('publicPost');
    for (let i = 0; i < visible.length; i++) {
        visible[i].style.display = "none";
    }
    if (num != 4) {     
        document.getElementById('subsedditHeading').innerText = "";
    }
    if (document.getElementById('subsedditFeed')) {     
        document.getElementById('subsedditFeed').remove();
    }    
}
