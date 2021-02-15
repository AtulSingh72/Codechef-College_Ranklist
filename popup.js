chrome.storage.sync.get(["college"], function(items) {
    if(items.college == undefined) document.getElementById("college").value = "";
    else document.getElementById("college").value = items.college;
});

document.getElementById('verify').addEventListener('click', function(){
    document.getElementById('verify').style.display = 'none';
})

document.getElementById("submit").addEventListener("click", function() {
    var college_name = document.getElementById("college").value;

    // check current tab
    chrome.tabs.query({currentWindow: true, active: true}, function(tab){
        var temp_url = tab[0].url;
        temp_url = temp_url.split("?")[0];
        var lastIndex = temp_url.lastIndexOf("/");
        var temp_contest = temp_url.substring(lastIndex + 1);
        temp_url = temp_url.substring(0, lastIndex);
        if(temp_url === "https://www.codechef.com" && temp_contest.length != 0) {
            // valid
            // save college name to memory
            chrome.storage.sync.set({"college" : college_name}, function() {
                // console.log(college_name);
                // Competition URL 👉 https://www.codechef.com/FEB21B?order=desc&sortBy=successful_submissions
                // Ranklist URL 👉 https://www.codechef.com/rankings/FEB21B?filterBy=Institution%3DNational%20Institute%20of%20Technology%2C%20Manipur&order=asc&sortBy=rank
                chrome.tabs.query({currentWindow: true, active: true}, function(tab){
                    var current_url = tab[0].url;
                    var contest = current_url.split("?")[0];
                    college_name.replace(" ", "%20");
                    college_name.replace(",", "%2C");
                    contest = contest.substring(0, contest.lastIndexOf("/")) + "/rankings" + contest.substring(contest.lastIndexOf("/"))
                    var ranking = contest + "?filterBy=Institution%3D" + college_name + "&order=asc&sortBy=rank";
                    // console.log(ranking);
                    chrome.tabs.create({url : ranking});
                });
            });
        }
        else {
            // invalid
            chrome.storage.sync.set({"college" : college_name}, function() {
                document.getElementById("verify").style.display = 'block';                
            });
        }
    });
});

document.getElementById('overall').addEventListener('click', function() {
    var college_name = document.getElementById("college").value;

    // save college name to memory
    chrome.storage.sync.set({"college" : college_name}, function() {
        // Overall URL 👉 https://www.codechef.com/ratings/all?filterBy=Institution%3DNational%20Institute%20of%20Technology%2C%20Manipur&order=asc&sortBy=global_rank
        college_name.replace(" ", "%20");
        college_name.replace(",", "%2C");
        var ranking = "https://www.codechef.com/ratings/all?filterBy=Institution%3D" + college_name + "&order=asc&sortBy=global_rank";
        chrome.tabs.create({url : ranking});
    })
});