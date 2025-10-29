class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
	get source(): "live_event" | "achievement" | "completed_event" | "miscellaneous" {
		const t = this.text.toLowerCase()
		if (t.includes("completed") || t.includes("posted")) return "completed_event"
		if (t.includes("watch")) return "live_event"
		if (t.includes("achieved")) return "achievement"
		return "miscellaneous"
	}

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.text.toLowerCase().indexOf('@runkeeper') === -1;
	}

    get writtenText():string {
        return ""; // dont need this
    }


    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        const t = this.text.toLowerCase();

        const keywords = ["run", "walk", "bike", "swim", "hike", "elliptical", "ski"];
        for (const kw of keywords) {
            if (t.includes(` ${kw} `)) {
                return kw;
            }
        }

        return "other";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        const t = this.text.toLowerCase();
        const match = t.match(/(\d+(\.\d+)?)\s?(km|mi)/); 

        if (!match) {
            return 0;
        }

        let value = parseFloat(match[1]);
        const unit = match[3];

        if (unit === "km") {
            value = value / 1.609;
        }

        return value;
    }

    getHTMLTableRow(rowNumber:number):string {
        const linkedText = this.text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );

        return `
            <tr>
                <td>${rowNumber}</td>
                <td>${this.activityType}</td>
                <td>${linkedText}</td>
            </tr>
        `;
    }
}