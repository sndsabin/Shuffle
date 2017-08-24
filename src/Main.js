import YoutubeChannel from './YoutubeChannel';

class Main 
{	
	/**
	 * Constructor
	 */
	constructor() 
	{
		this.channel;
		this.loadYoutubeData();	
		this.listenWindowEvent();

	}

	/**
	 * Responsible for loading all the contents 
	 * in the view
	 */
	loadYoutubeData() 
	{
		this.channel = new YoutubeChannel();

	}
	
	/**
	 * Listens for the keypress event
	 * @return void
	 */
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