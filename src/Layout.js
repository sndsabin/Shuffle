import YoutubeChannel from './YoutubeChannel';

class Layout 
{
	/**
	 * Constructor
	 */
	constructor() 
	{
		this.bakeVideodetails();
		this.bakeLoadingButton();
	}

	/**
	 * Creates loading layout for the video-container 
	 * section and appends it to view
	 */
	bakeVideodetails() 
	{
		// Loading Icon
		this.prepareLoadingVideoFrame();

	}

	/**
	 * Creates layout for Sidebar Playlist Section
	 * and appends it to view
	 *
	 * @param {Object} playlistItemsDetails 
	 * @return {DOM element} childElementItem
	 */
	bakeSideBarPlaylist(playlistItemsDetails) 
	{
		
		if (playlistItemsDetails.videoId != undefined) {
			
			// Heading
			this.prepareSideBarPlaylistHeadingContent(playlistItemsDetails.playlistTitle);

			// CheckBox
			this.prepareCheckbox();

			// Content
			let childElementItem = this.prepareSideBarPlaylistContent(playlistItemsDetails.videoId, playlistItemsDetails.title);

			return childElementItem;
			
		}
		
	}

	/**
	 * Creates layout for single item in Other Playlist Section
	 * and appends it to view
	 *
	 * @param {Object} playlistDetails
	 * @return {DOM element} childDiv 
	 */
	bakeOtherPlaylist(playlistDetails) 
	{

		let otherPlaylistContainer = document.getElementById('other-playlist-container');

		let parentDiv =  document.createElement('div');
		parentDiv.setAttribute('class', 'col-md-4');

		let childDiv = document.createElement('div');
		childDiv.setAttribute('class', 'card');
		childDiv.style.width = '21.5rem';

		let aTagFirst = document.createElement('a');
		aTagFirst.setAttribute('href', '#');

		let imgTag = document.createElement('img');
		imgTag.setAttribute('class', 'card-img-top');
		imgTag.setAttribute('src', playlistDetails.thumbnail);
		imgTag.setAttribute('alt', playlistDetails.title);
		imgTag.setAttribute('id', 'img#'+playlistDetails.playlistId);

		let cardDiv = document.createElement('div');
		cardDiv.setAttribute('class', 'card-body');
		cardDiv.setAttribute('id', 'card#'+playlistDetails.playlistId);

		let h4Tag =  document.createElement('h4');
		h4Tag.setAttribute('class', 'card-title');
		

		let anchorTag =  document.createElement('a');
		anchorTag.setAttribute('href', '#');
		anchorTag.innerHTML = playlistDetails.title;
		anchorTag.setAttribute('id', 'other-playlist-a#'+playlistDetails.playlistId);

		
		h4Tag.appendChild(anchorTag);
		cardDiv.appendChild(anchorTag);
		aTagFirst.appendChild(imgTag);
		childDiv.appendChild(aTagFirst);
		childDiv.appendChild(cardDiv);

		parentDiv.appendChild(childDiv);
		otherPlaylistContainer.appendChild(parentDiv);

		return childDiv;
	}

	/**
	 * Creates the loading button DOM element and
	 * appends in the Other Playlist Section
	 */
	bakeLoadingButton() 
	{
		let loadingContainer = document.getElementById('loading-button-container');

		let loadingIcon =  document.createElement('i');
		loadingIcon.setAttribute('class', 'fa fa-spinner fa-spin');
		
		let loadButtonTag = document.createElement('button');
		loadButtonTag.setAttribute('class', 'btn btn-default btn-lg center');
		loadButtonTag.setAttribute('id', 'load-button');
		loadButtonTag.setAttribute('disabled', '');

		loadButtonTag.appendChild(loadingIcon);
		loadButtonTag.innerHTML += ' loading';

		
		loadingContainer.appendChild(loadButtonTag);

	}

	/**
	 * Creates and appends a layout for single item 
	 * in the sidebar playlist
	 *
	 * @return {DOM element} [aTag]
	 */
	prepareSideBarPlaylistContent(videoId, title) 
	{
		let sideBarPlaylist =  document.getElementById('list-tab');

		let aTag = document.createElement('a');
		aTag.setAttribute('class', 'list-group-item');
		aTag.setAttribute('id', 'sidebar-a#'+videoId);
		aTag.setAttribute('href', '#');
		aTag.innerHTML = title;

		sideBarPlaylist.appendChild(aTag);

		return aTag;
	}

	/**
	 * Creates and appends the checkbox in the sidebar
	 */
	prepareCheckbox() 
	{
		let checkboxContainer = document.getElementById('checkbox-container');

		let labelTag = document.createElement('label');
		labelTag.setAttribute('class', 'custom-control custom-checkbox');

		let inputTag = document.createElement('input');
		inputTag.setAttribute('type', 'checkbox');
		inputTag.setAttribute('class', 'custom-control-input');
		inputTag.setAttribute('id', 'same-playlist-option-checkbox');
		inputTag.setAttribute('checked', '');

		let checkboxSpanTag = document.createElement('span');
		checkboxSpanTag.setAttribute('class', 'custom-control-indicator');

		let checkboxDespcriptionSpanTag = document.createElement('span');
		checkboxDespcriptionSpanTag.setAttribute('class', 'custom-control-description');
		checkboxDespcriptionSpanTag.innerHTML = 'Play From Same Playlist';

		labelTag.appendChild(inputTag);
		labelTag.appendChild(checkboxSpanTag);
		labelTag.appendChild(checkboxDespcriptionSpanTag);

		checkboxContainer.innerHTML = '';
		checkboxContainer.appendChild(labelTag);
	}

	/**
	 * Sets the title of the sidebar playlist to 
	 * current selected playlist
	 */
	prepareSideBarPlaylistHeadingContent(playlistTitle) 
	{
		let sideBarPlaylistHeading = document.getElementById('playlist-title');
		let h2Tag = document.createElement('h2');
		h2Tag.setAttribute('class', 'sidebar-playlist font-size-24');
		h2Tag.innerHTML = playlistTitle;

		sideBarPlaylistHeading.innerHTML = ''; // Remove the Loading Button
		sideBarPlaylistHeading.appendChild(h2Tag);
	}

	/**
	 * Creates the loading div for the video-player div
	 * while it is loading
	 */
	prepareLoadingVideoFrame()
	{

		let videoPlayer = document.getElementById('video-player');

		let loadingDiv = document.createElement('div');
		loadingDiv.style.height = '436px';
		loadingDiv.style.background = '#cccccc';
		
		loadingDiv.setAttribute('class', 'text-center');
		
		let loadingIcon =  document.createElement('i');
		loadingIcon.setAttribute('class', 'fa fa-spinner fa-spin fa-4x');
		loadingIcon.style.lineHeight = '436px';

		loadingDiv.appendChild(loadingIcon);

		videoPlayer.appendChild(loadingDiv);
	}

	/**
	 * Sets the style of Sidebar item of Current ong Playing
	 * to active and removes the active from style of 
	 * sidebar item of previous song
	 * 
	 * @param  {string} currentSelectedItemId
	 * @param  {string} previousSelectedItemId
	 * @return void
	 */
	updateListItemActiveState(currentSelectedItemId, previousSelectedItemId) {

		let currentItem = document.getElementById('sidebar-a#'+currentSelectedItemId);
		let previousItem = document.getElementById('sidebar-a#'+previousSelectedItemId);

		if (previousItem != undefined) {
			previousItem.setAttribute('class', 'list-group-item');
		}
		currentItem.setAttribute('class', 'list-group-item active');

		// To Scroll into view
		
		let itemContainer = document.getElementById('sidebar-playlist-content');
		let topPosition = currentItem.offsetTop; // the distance between the top of itemContainer and currentItem

		itemContainer.scrollTop = topPosition-100;
		
	}
}

export default Layout;