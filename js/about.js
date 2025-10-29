function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	


	if(tweet_array.length > 0) {
		const sortedTweets = tweet_array.slice().sort((a, b) => a.time - b.time)
		const earliest = sortedTweets[0].time
		const latest = sortedTweets[sortedTweets.length - 1].time
		document.querySelector('#firstDate').innerText = earliest.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
		document.querySelector('#lastDate').innerText = latest.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
	}

	const categories = { completed_event: 0, live_event: 0, achievement: 0, miscellaneous: 0 } 
	tweet_array.forEach(tweet => categories[tweet.source]++)
	document.querySelectorAll('.completedEvents').forEach(el => el.innerText = categories.completed_event)
	document.querySelector('.completedEventsPct').innerText = math.format((categories.completed_event / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%'
	document.querySelector('.liveEvents').innerText = categories.live_event
	document.querySelector('.liveEventsPct').innerText = math.format((categories.live_event / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%'
	document.querySelector('.achievements').innerText = categories.achievement
	document.querySelector('.achievementsPct').innerText = math.format((categories.achievement / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%'
	document.querySelector('.miscellaneous').innerText = categories.miscellaneous
	document.querySelector('.miscellaneousPct').innerText = math.format((categories.miscellaneous / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%'

	const completedTweets = tweet_array.filter(tweet => tweet.source === 'completed_event')
	const writtenCount = completedTweets.filter(tweet => tweet.written).length
	document.querySelector('.written').innerText = writtenCount
	document.querySelector('.writtenPct').innerText = math.format((writtenCount / completedTweets.length) * 100, {notation: 'fixed', precision: 2}) + '%'
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});