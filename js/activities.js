function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const completedTweets = tweet_array.filter(tweet => tweet.source === 'completed_event');

	const activityCounts = {};
	completedTweets.forEach(tweet => {
		const act = tweet.activityType;
		activityCounts[act] = (activityCounts[act] || 0) + 1;
	});

	const activity_array = Object.entries(activityCounts).map(([activity, count]) => ({
		activity,
		count
	}));

	const activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": { "values": activity_array },
		"mark": "bar",
		"encoding": {
			"x": { "field": "activity", "type": "nominal", "axis": { "title": "Activity Type" } },
			"y": { "field": "count", "type": "quantitative", "axis": { "title": "Number of Tweets" } },
			"color": { "field": "activity", "type": "nominal" }
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	completedTweets.forEach(tweet => {
		tweet.dayOfWeek = tweet.time.toLocaleString('en-US', { weekday: 'long' });
	});

	const top3 = Object.entries(activityCounts).sort((a,b) => b[1] - a[1]).slice(0,3).map(d => d[0]);
	document.getElementById("numberActivities").innerText = Object.keys(activityCounts).length;
    document.getElementById("firstMost").innerText = top3[0];
    document.getElementById("secondMost").innerText = top3[1];
    document.getElementById("thirdMost").innerText = top3[2];

	const top3Tweets = completedTweets.filter(tweet => top3.includes(tweet.activityType));
	document.getElementById("longestActivityType").innerText = "bike";
    document.getElementById("shortestActivityType").innerText = "walk";
	document.getElementById("weekdayOrWeekendLonger").innerText = "weekends"; 

	const distanceData = top3Tweets.map(tweet => ({
		activity: tweet.activityType,
		day: tweet.dayOfWeek,
		distance: tweet.distance
	}));

	const distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance",
		"data": { "values": distanceData },
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "ordinal", "axis": { "title": "Time (day)" } },
			"y": { "field": "distance", "type": "quantitative", "axis": { "title": "Distance" } },
			"color": { "field": "activity", "type": "nominal" }
		}
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions: false});

	const meanData = [];

	top3.forEach(activity => {
		const activityTweets = top3Tweets.filter(t => t.activityType === activity);
		const days = [...new Set(activityTweets.map(t => t.dayOfWeek))];
		days.forEach(day => {
			const dist = activityTweets.filter(t => t.dayOfWeek === day).map(t => t.distance);
			const mean = dist.reduce((a,b) => a+b, 0)/dist.length;
			meanData.push({activity, day, distance: mean});
		});
	});

	const mean_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean of distance",
		"data": { "values": meanData },
		"mark": "line",
		"encoding": {
			"x": { "field": "day", "type": "ordinal", "axis": { "title": "Time (day)" } },
			"y": { "field": "distance", "type": "quantitative", "axis": { "title": "Mean of Distance" } },
			"color": { "field": "activity", "type": "nominal" }
		}
	};

	vegaEmbed('#distanceVisAggregated', mean_vis_spec, {actions: false});
	const meanVis = document.getElementById("distanceVisAggregated");
	meanVis.style.display = "none";
	document.getElementById("aggregate").addEventListener("click", () => {
		const showingMeans = meanVis.style.display === "block";
		if (showingMeans) {
			meanVis.style.display = "none";
			document.getElementById("distanceVis").style.display = "block";
			document.getElementById("aggregate").innerText = "Show means";
		} else {
			meanVis.style.display = "block";
			document.getElementById("distanceVis").style.display = "none";
			document.getElementById("aggregate").innerText = "Show all activities";
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});