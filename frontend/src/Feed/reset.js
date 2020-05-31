// Remove and rest feed display
export function resetFeed(check) {
  const main = document.getElementById("mainFeed");
  main.parentNode.removeChild(main);
  if (document.getElementById("pagination")) {
    document.getElementById("pagination").remove();
  }
  if (document.getElementById("otherProfile")) {
    document.getElementById("otherProfile").remove();
  }
  if (document.getElementById("profileWrapper")) {
    document.getElementById("profileWrapper").style.display = "none";
  }
  if (document.getElementById("subsedditHeading")) {
    document.getElementById("subsedditHeading").innerText = "";
  }
  if (check === "logout") {
    document.getElementById("navHeader").remove();
    localStorage.removeItem("token");
  }
  if (check === "login") {
    document.getElementById("navHeader").remove();
    document.getElementById("loginModal").remove();
  }
  if (document.getElementById("subsedditFeed")) {
    document.getElementById("subsedditFeed").remove();
  }
  if (document.getElementById("loader")) {
    document.getElementById("loader").remove();
  }
}

// Show and hide certain elements of the feed
export function toggleFeed(num) {
  if (num === 1) {
    document.getElementById("feed").style.display = "none";
    if (document.getElementById("pagination")) {
      document.getElementById("pagination").style.display = "none";
    }
  } else {
    document.getElementById("feed").style.display = "";
  }
  if (num === 5) {
    document.getElementById("pagination").style.display = "none";
  } else if (num == 7) {
    document.getElementById("pagination").style.display = "";
  }
  if (document.getElementById("createPost")) {
    document.getElementById("createPost").remove();
  }
  if (document.getElementById("profileWrapper")) {
    document.getElementById("profileWrapper").style.display = "none";
  }
  if (document.getElementById("otherProfile")) {
    document.getElementById("otherProfile").remove();
  }
  if (document.getElementById("searchFeed")) {
    document.getElementById("searchFeed").remove();
  }
  if (document.getElementById("commentWrap")) {
    document.getElementById("commentWrap").remove();
  }
  let visible = document.getElementsByClassName("publicPost");
  for (let i = 0; i < visible.length; i++) {
    visible[i].style.display = "none";
  }
  if (num != 4) {
    document.getElementById("subsedditHeading").innerText = "";
  }
}

export function toggleLoader(flag) {
  if (flag === true && document.getElementById("loader")) {
    document.getElementById("loader").style.display = "";
  } else if (document.getElementById("loader")) {
    document.getElementById("loader").style.display = "none";
  }
}

/*
export function resetFeed () {
    const main = document.getElementById("mainFeed");
    main.parentNode.removeChild(main);

}

export function toggleFeed(num) {
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
*/
