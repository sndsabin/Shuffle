import YoutubeChannel from './YoutubeChannel';

class Main 
{
	constructor() 
	{
		this.channel;
		this.loadYoutubeData();	
		this.listenWindowEvent();

	}

	loadYoutubeData() 
	{
		this.channel = new YoutubeChannel();

	}

	listenWindowEvent() {
		window.addEventListener('keydown', (event) => {
			// O to recreate Other Playlist Section
			// S to recreate both other playlist Section and Sidebar playlist section
			if (event.keyCode == 79) {
				this.channel.recreateOtherPlaylistSection();
			} else if (event.keyCode == 83) {
				this.channel.recreateOtherPlaylistSection();
				this.channel.recreateSidebarPlaylistSection();
			}
		});
	}
}

export default Main;