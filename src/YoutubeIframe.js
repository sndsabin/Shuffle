import YouTubePlayer from 'youtube-player';

class YoutubeIframe
{
	constructor(videoId, width, height) 
	{

		global.YouTubePlayer = YouTubePlayer;
		this.videoId = videoId;
		this.width = width || 869;
		this.height = height || 436;
		
		this.player;
		this.build();

	}

	build() {
		
		this.player = YouTubePlayer('video-player', {
	        'videoId': this.videoId,
	        'width': this.width,
	        'height': this.height,
	    });
	    this.player.playVideo()
	        .then(function () {
	            console.log('Starting to play video. It will take some time to buffer video before it starts playing.');
	        });
	}


	cueAndPlay(videoId) 
	{
		this.player.cueVideoById({
			'videoId': videoId
		});

		this.player.playVideo();
	}

	loadVideoById(videoId) 
	{
		this.player.loadVideoById(videoId);
		this.player.playVideo();
	}

	
}

export default YoutubeIframe;