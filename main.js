var response;

function getResponseFromServer() {
    var requestUrl = "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            if (xmlHttp.responseText != null)
                successCallback(xmlHttp.responseText);
    }

    xmlHttp.open("GET", requestUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function successCallback(result) {
    response = JSON.parse(result);

    allConferenceList = response.free.concat(response.paid);
    //Creating elements
    document.getElementById("isload").style.display = "none";
    createElementsDynamically(allConferenceList);
}

function createElementsDynamically(jsonData) {
    var card = document.getElementById("new_process");

    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }

    jsonData.forEach(item => {

        var container = document.createElement("div");
        container.classList.add("whole_container");
        container.style.background = "linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(" + item.imageURL + ")";
        container.style.backgroundSize = "cover";

        var confName = document.createElement("div");
        confName.classList.add("confName_class");
        confName.append(item.confName);

        var venue = document.createElement("div");
        venue.classList.add("venue_class");
        venue.append(item.venue);

        var duration = document.createElement("div")
        duration.classList.add("duration");
        duration.append(item.confStartDate + " - " + item.confEndDate)


        var confUrlBtn = document.createElement("button");
        confUrlBtn.type = 'button';
        confUrlBtn.innerText = 'More Info';
        confUrlBtn.className = 'url_btns';
        var confUrlAnchor = document.createElement('a');
        confUrlAnchor.href = item.confUrl;
        confUrlAnchor.target = "_blank";
        confUrlAnchor.appendChild(confUrlBtn);

        var registerNowUrlBtn = document.createElement("button");
        registerNowUrlBtn.type = 'button';
        registerNowUrlBtn.innerText = 'Register Now !';
        registerNowUrlBtn.className = 'url_btns';
        var registerNowUrlAnchor = document.createElement('a');
        registerNowUrlAnchor.href = item.confRegUrl;
        registerNowUrlAnchor.target = "_blank";
        registerNowUrlAnchor.appendChild(registerNowUrlBtn);

        var twitterHandle = document.createElement("div");
        twitterHandle.classList.add("twitterHandle_class");
        if (item.twitter_handle != "") {
            twitterHandle.append("Twitter : " + item.twitter_handle);
        }

        container.appendChild(duration);
        container.appendChild(confName);
        container.appendChild(venue);
        container.appendChild(confUrlAnchor);
        container.appendChild(registerNowUrlAnchor);
        container.appendChild(twitterHandle);

        card.appendChild(container);
    })
}

//Sorting 
function sort() {
    allConferenceList = this.response.free.concat(this.response.paid);
    sortedArray = allConferenceList.sort(custom_sort);
    createElementsDynamically(sortedArray);
}

function custom_sort(a, b) {
    return new Date(a.confStartDate).getTime() - new Date(b.confStartDate).getTime();
}

function clearAll() {
    allConferenceList = this.response.free.concat(this.response.paid);
    createElementsDynamically(allConferenceList);
}

//Search
function search() {
    let self = this;
    var searchResults = [];
    searchKey = (document.getElementById("searchBox").value == "") ? null : document.getElementById("searchBox").value;
    if (searchKey != null) {
        var allUsersArray = self.response.paid.concat(self.response.free);
        allUsersArray.forEach(item => {
            if (item.searchTerms.toLowerCase().includes(searchKey.toLowerCase())) {
                searchResults.push(item)
            }
        })
    } else {
        alert("Empty Search Query");
    }
    console.log(searchResults.length);

    createElementsDynamically(searchResults);
}

function filter(key, value) {
    //city , month , free , paid , country
    let self = this;
    var filterResults = [];
    var allUsersArray = self.response.paid.concat(self.response.free);

    if (key == "edition") {
        filterResults = self.response[value];
    } else {
        allUsersArray.forEach(item => {
            var dd = (key == "city" || "country") ? "true" : "false";
            if (key == "city" || key == "country") {
                if (item[key] == value) {
                    filterResults.push(item);
                }
            } else if (key == "month") {
                month = new Date(item.confStartDate).getMonth();
                if (month == value) {
                    filterResults.push(item);
                }
            }
        })
    }

    createElementsDynamically(filterResults);

    console.log(filterResults.length);
    return filterResults;
}