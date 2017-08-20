import * as httpUtil from './httpUtil';
import * as YOUTUBE from './constant';
import * as misc from './miscellaneous';

import Layout from './Layout';
import YoutubeIframe from './YoutubeIframe';

class YoutubeChannel 
{
	constructor(channelId, maxResult, part) 
	{
		this.loadButton;
		this.playlistResponse;
		this.playlistItemsResponse;

		this.loadSize = 6; // No.of Video to be loaded in other playlist section
		this.selectedPlaylistId;
		this.selectedPlaylistTitle;
		this.selectedVideoId;
		this.previousVideoId;
		this.selectedVideoTitle;
		this.selectedVideoDescription;

		this.youtubeIframe;

		this.BASE_API_URL = YOUTUBE.BASE_API_URL;
		this.PLAYLIST_URL = YOUTUBE.PLAYLIST_URL;
		this.PLAYLIST_ITEMS_URL = YOUTUBE.PLAYLIST_ITEMS_URL;
		this.API_KEY = YOUTUBE.API_KEY;

		this.channelId = channelId || YOUTUBE.CHANNEL_ID;
		this.maxResults = maxResult || 50;
		this.part = part || 'snippet,contentDetails';

		
		this.layout = new Layout();
		this.loadButton = document.getElementById('load-button');

		this.getPlaylist();

		this.isButtonClicked();

		this.isVideoEnded.bind(this);
		

	}

	getPlaylist()
	{	

		let params = {
			'channelId': this.channelId,
            'maxResults': this.maxResults,
            'part': this.part,
            'key': this.API_KEY
		};


		httpUtil.get(this.PLAYLIST_URL, params).then(response => {
			if (response.data) {
				this.playlistResponse =  response.data;
				this.prepareOtherPlaylist(this.playlistResponse);
				this.getPlaylistItems(this.getRandomPlaylistId(this.playlistResponse));
			}

		});

	}

	getPlaylistItems(playlistId) 
	{
		let params = {
			'maxResults': this.maxResults,
            'part': this.part,
            'playlistId': playlistId,
            'key': this.API_KEY
        };

        httpUtil.get(this.PLAYLIST_ITEMS_URL, params).then(response => {
        	if (response.data) {
        		this.playlistItemsResponse = response.data;
        		this.prepareSidebarPlaylistItems(this.playlistItemsResponse);
        		this.prepareVideo(this.getRandomVideoId(this.playlistItemsResponse.items));
        		this.prepareVideoTitle(this.selectedVideoTitle);

        	}
        });


	}
	
	prepareVideo(videoId) {

		if (this.youtubeIframe == undefined) {
			let promiseObj = new Promise((resolve, reject) => {
				// Load Youtube Video
				this.youtubeIframe = new YoutubeIframe(videoId);
				resolve('loaded');
			});

			promiseObj.then((successMessage) => {
				this.listenVideoEvent();
			});
		} else {
			this.youtubeIframe.loadVideoById(videoId);
		}
		

	}

	prepareOtherPlaylist(playlistCollection, startIndex, stopIndex) 
	{
		// Shuffle the playlistCollection items
		misc.shuffle(playlistCollection.items)

		this.startIndex = startIndex || 0;
		this.stopIndex = stopIndex || this.loadSize-1;

		let i = this.startIndex;

		for(i ; i <= this.stopIndex; i++) {
			
			let title = playlistCollection.items[i].snippet.title;
			let description = playlistCollection.items[i].snippet.description;
			let thumbnail = playlistCollection.items[i].snippet.thumbnails.medium.url;
			let playlistId = playlistCollection.items[i].id;
			let playlistItemsCount = playlistCollection.items[i].contentDetails.itemCount;


			let playlistDetails = {
				'title': title,
				'description': title,
				'thumbnail': thumbnail,
				'playlistId': playlistId,
				'playlistItemsCount': playlistItemsCount
			};

			var otherPlaylistChildDiv = this.layout.bakeOtherPlaylist(playlistDetails);

			// Click Event Listener
			this.listenOtherPlaylistCardClickEvent(otherPlaylistChildDiv);

		}

		this.loadButton.removeAttribute('disabled');
		this.loadButton.innerHTML = 'Load More';
	}

	prepareSidebarPlaylistItems(playlistItemsCollection) 
	{
		playlistItemsCollection.items.forEach((item, index) =>{
			
			let title = item.snippet.title;
			let channelId = item.snippet.channelId;
			let playlistId = item.snippet.playlistId;
			let videoId = item.contentDetails.videoId;
			let description = item.snippet.description;
			let publishedDate = item.snippet.publishedAt;
			
			let thumbnail = item.snippet.thumbnails.medium.url;

			let channelTitle = item.snippet.channelTitle;
			
			
			let playlistItemsDetails = {
				'title': title,
				'channelId': channelId,
				'playlistId': playlistId,
				'videoId': videoId,
				'description': description,
				'publishedDate': publishedDate,
				'thumbnail': thumbnail,
				'channelTitle': channelTitle,
				'playlistTitle': this.selectedPlaylistTitle
			};

			let childElementItem = this.layout.bakeSideBarPlaylist(playlistItemsDetails);
			
			// Event Listener
			this.listenSidebarPlaylistItemClickEvent(childElementItem);

		});
	}

	prepareVideoTitle(videoTitle)
	{
		// Heading
		let videoDetails = document.getElementById('video-details');
		videoDetails.innerHTML = ''; // Removes all the child
		
		let h1Tag = document.createElement('h1');
		h1Tag.setAttribute('class', 'video-wrapper-heading');
		h1Tag.innerHTML = videoTitle;

		videoDetails.appendChild(h1Tag);
	}

	getRandomPlaylistId(playlistCollection) 
	{
		let randomNumber = misc.generateRandomNumber(0, this.maxResults);

		this.selectedPlaylistId = playlistCollection.items[randomNumber].id;
		this.selectedPlaylistTitle = playlistCollection.items[randomNumber].snippet.title;

		return playlistCollection.items[randomNumber].id;
	}

	getRandomVideoId(selectedPlaylist) 
	{
		let randomNumber = misc.generateRandomNumber(0, selectedPlaylist.length);

		if (this.selectedVideoId != undefined) {
			this.previousVideoId = this.selectedVideoId;
		}

		this.selectedVideoId = selectedPlaylist[randomNumber].contentDetails.videoId;
		this.selectedVideoTitle = selectedPlaylist[randomNumber].snippet.title;
		this.selectedVideoDescription = selectedPlaylist[randomNumber].snippet.description;

		// Update the List Active State
		
		this.layout.updateListItemActiveState(this.selectedVideoId, this.previousVideoId);

		return this.selectedVideoId;
	}


	isButtonClicked()
	{
		this.loadButton.addEventListener('click', (event) => {
			

			// Check if there is data to load 
			if (this.startIndex < this.maxResults - this.loadSize) {
				event.preventDefault();

				// loading icon
				let loadingIcon =  document.createElement('i');
				loadingIcon.setAttribute('class', 'fa fa-spinner fa-spin');

				this.loadButton.setAttribute('disabled', '');
				this.loadButton.innerHTML='';
				this.loadButton.appendChild(loadingIcon);
				this.loadButton.innerHTML += ' Loading';

				// Load More data in Other Playlist section
				this.startIndex = this.stopIndex+1;
				this.stopIndex = this.stopIndex + 6;
				this.prepareOtherPlaylist(this.playlistResponse, this.startIndex, this.stopIndex);
			}

		});
	}

	listenVideoEvent() 
	{
		let stateNames = {
	        '-1': 'unstarted',
	        '0': 'ended',
	        '1': 'playing',
	        '2': 'paused',
	        '3': 'buffering',
	        '5': 'video cued'
    	};
    	
    	if (this.youtubeIframe != undefined) {
    		
    		this.youtubeIframe.player.on('stateChange', (event) => {

	        	let eventCode = event.data;

	        	if (!stateNames[eventCode]) {
				console.log('Unknown Event Occured' + eventCode);
				}else{
					this.isVideoEnded(eventCode);
				}
			});
    		
    	}	

	}

	isVideoEnded(eventCode)
	{

		if (eventCode != undefined && eventCode == 0) {
			
			let checkbox = document.getElementById('same-playlist-option-checkbox');
			
			if (checkbox != undefined && checkbox.checked) {

				// Play from the same playlist
				let videoId = this.getRandomVideoId(this.playlistItemsResponse.items);

				this.youtubeIframe.cueAndPlay(videoId);
			} else {
				this.recreateSidebarPlaylistSection();
			}
			
		}
	}

	recreateOtherPlaylistSection() 
	{
		let otherPlaylistContainer = document.getElementById('other-playlist-container');

		// Remove All the child Element
		otherPlaylistContainer.innerHTML = '';

		this.prepareOtherPlaylist(this.playlistResponse);
	}

	recreateSidebarPlaylistSection(playlistId) 
	{

		playlistId = playlistId || this.getRandomPlaylistId(this.playlistResponse);

		let sideBarPlaylistHeading = document.getElementById('playlist-title');
		let checkboxContainer = document.getElementById('checkbox-container');
		let sideBarPlaylist =  document.getElementById('list-tab');

		// Remove all the child Element
		sideBarPlaylistHeading.innerHTML = '';
		checkboxContainer.innerHTML = '';
		sideBarPlaylist.innerHTML = '';


		this.getPlaylistItems(playlistId);
	}

	listenSidebarPlaylistItemClickEvent(childElementItem) 
	{
		childElementItem.addEventListener('click', (event) => {
				let title = childElementItem.innerHTML;
				let videoId = childElementItem.id.split('#')[1];

				this.previousVideoId = this.selectedVideoId
				this.selectedVideoId = videoId;

				this.youtubeIframe.loadVideoById(videoId);

				// Update the Active State Button
				this.layout.updateListItemActiveState(this.selectedVideoId, this.previousVideoId);

				// Update the title section
				let videoTitle = document.getElementsByClassName('video-wrapper-heading')[0];
				videoTitle.innerHTML = title;
		});
	}

	listenOtherPlaylistCardClickEvent(otherPlaylistChildDiv) {

		otherPlaylistChildDiv.addEventListener('click', (event) => {

			let title = otherPlaylistChildDiv.innerText
			let playlistId = otherPlaylistChildDiv.id.split('#')[1];


			this.recreateSidebarPlaylistSection(playlistId);

			// Update the title section
			this.selectedPlaylistTitle = title;
			
		});
	}

}

export default YoutubeChannel;

