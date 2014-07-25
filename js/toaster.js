/**
 * Copyright 2014 Kyle Kamperschroer (http://kylek.me)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
**/

/**
 * Toaster is the class responsible for handling notifications on track
 * changes.
 */
function Toaster(playerHandler){
	this.playerHandler = playerHandler;
	this.timeToLeaveUpToast = 5000;

	// Immediately check if toasting is enabled in storage
	chrome.storage.local.get('toaster_enabled', $.proxy(function(data){
		this.enabled = data.toaster_enabled;
	}, this));

	// Bind click events on the toasters buttons
    chrome.notifications.onButtonClicked.addListener( $.proxy(function(id, btnIdx){
        if (btnIdx == 0){
            // Pause
            this.playerHandler.ClickSomething(CLICK_PAUSE);
        }else if (btnIdx == 1){
            // Next
            this.playerHandler.ClickSomething(CLICK_NEXT_TRACK);
        }
        this.playerHandler.PopulateInformation();
    }, this));
}

/**
 * Determine if the toaster is plugged in or not
 * @return {boolean} true if it's enabled, false if not.
 */
Toaster.prototype.IsEnabled = function(){
	return this.enabled;
}

/**
 * Set whether or not the toaster should be enabled
 * @param {boolean} enabled -- whether or not toaster should be enabled
 */
Toaster.prototype.SetEnabled = function(enabled){
	this.enabled = enabled;
}

/**
 * Toast with the provided info
 * @param {Object} track info
 */
Toaster.prototype.Toast = function(info){
	chrome.notifications.create(
		"",
		{
			type: "basic",
			iconUrl: info.artUrl,
			title: info.track,
			message: info.artist,
			buttons: [{
				title: "Pause",
				iconUrl: "/images/preSprite/pause.png"
			},{
				title: "Skip",
				iconUrl: "/images/preSprite/play.png"
			}]
		}, $.proxy(function(id){
			// Timeout
			if (this.timeToLeaveUpToast > 0){
				setTimeout(function(){
					chrome.notifications.clear(id, function(cleared){});
				}, this.timeToLeaveUpToast);
			}
		}, this)
	);
}