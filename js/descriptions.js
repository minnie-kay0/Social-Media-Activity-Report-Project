function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

    const tweet_array = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at));

    writtenTweets = tweet_array.filter(tweet => tweet.source === 'completed_event' && tweet.written);

    document.getElementById("searchCount").innerText = writtenTweets.length;
    document.getElementById("searchText").innerText = "";
}

function addEventHandlerForSearch() {
    const searchBox = document.getElementById("textFilter"); 
    const tableBody = document.getElementById("tweetTable"); 

    searchBox.addEventListener("input", () => {
        const searchTerm = searchBox.value.toLowerCase();

        tableBody.innerHTML = "";

        if (searchTerm === "") {
            document.getElementById("searchText").innerText = "";
            document.getElementById("searchCount").innerText = writtenTweets.length;
            return;
        }

        const filteredTweets = writtenTweets.filter(tweet => tweet.text.toLowerCase().includes(searchTerm));

        document.getElementById("searchText").innerText = searchTerm;
        document.getElementById("searchCount").innerText = filteredTweets.length;

        filteredTweets.forEach((tweet, index) => {
            const rowHTML = tweet.getHTMLTableRow(index + 1);
            tableBody.insertAdjacentHTML('beforeend', rowHTML);
        });
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});