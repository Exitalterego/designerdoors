## 3.0.0 - One Year Later - May 03, 2022
### New Features
* While DD v2 worked in Foundry v9, it suffered from an error that involved the Wall Config tool. This has now been fixed, so DD v3 is now completely compatible with Foundry v9.

### Bug Fixes
* WallConfig element ID was changed in Foundry from "wall-config" to "wall-sheet-WALL_ID". This version now has had this updated

### Known Issues
* As this module has been changed to be compatible with Foundry 9, this version is specifically NOT backwards compatible with earlier Foundry versions.
* I have not encountered any major issues during testing, but I have not tested this against other modules. If any issues or incompatibilities arise, please report them via the modules Github page.

---

### 2.0.0 - Foundryversary Edition - Jun 03, 2021
#### New Features
* Designer Doors is now compatible with Foundry 0.8.6!
* Default icons can now be chosen with the Foundry file picker.
* Added compatibility with Foundry's secret doors. A default icon can be chosen for these in the module settings. As these icons are only visible to the GM, custom icons per door have not been added.
* Code has been cleaned up somewhat, making future maintenance easier. This is a work in progress though and future updates will likely continue this

#### Bug Fixes
* None

#### Known Issues
* As this module has been changed to be compatible with Foundry 0.8.6, this version is specifically NOT backwards compatible with earlier Foundry versions. Some of the code clean-up may make it into an update of Designer Doors 1.x.x versions, but features will not.
* I have not encountered any major issues during testing, but I have not tested this against other modules. If any issues or incompatibilities arise, please report them via the modules Github page.

---

### 1.0.1 - Spring Cleaning - Feb 10, 2021
#### New Features
* None

#### Bug Fixes
* Primarily a house keeping update, fixing some stuff in the text formatting of the ReadMe and links in the module.json
* Some slight refactoring of code to bring it up to a slightly more dev-friendly standard. This is a work in progress, and is likely to see more improvements in future updates.

#### Known Issues
* None, but I am aware of the existence of Smart Doors. Currently, there is no overlap in functionality and I don't believe there to be any  incompatibilities. Should any arise, I shall see what can be done about them.

---

### 1.0.0 - It's Alive! - Dec 17, 2020
#### New Features
* The supposed caching on scene change in 0.3.0 was, in fact only partial. Now ALL textures (default icons and per door icons) are cached on scene change.

#### Bug Fixes
* See above. For an as unyet determined reason, default door icons were not being rendered (this did not affect per door icons). By adding a re-caching of these textures on scene change, this problem is now resolved.

#### Known Issues
* No known issues at this time.

### 0.3.0 - The Main Event - Nov 18, 2020
#### New Features
* Textures are now cached for all doors on scene change, allowing doors to render without needing state change

#### Bug Fixes
* Fixed textures not caching correctly on submission of settings forms. Previously, forms had to be submitted twice before a texture was recognised.
* Fixed logic for the selection of default or unique textures per door.

#### Known Issues
* None

### 0.2.2 - An Actual Fix - Nov 10, 2020
#### New Features
* None

#### Bug Fixes
* Module is now listed in Module Manger form correctly.

#### Known Issues
* None

### 0.2.1 - The First Patch - Nov 09, 2020
#### Features

#### Bug Fixes
* Fixed a pathing issue in module.json

#### Known Issues
* None

### 0.2.0 - Doors Are Open - Nov 09, 2020
#### Features
* Added the ability to choose a new set of default icons from directly inside Foundry. The options for this can be found under Game Settings > Configure Settings > Module Settings.
* It is important to note that once the settings have been saved, simply toggling the door states will trigger a refresh of the icon system and new icons will be displayed.

#### Bug Fixes
* None

#### Known Issues
* IF DOORS DO NOT DISPLAY after toggling the door control, open the settings menu again and save one more time. This should be fixed in a later release.
