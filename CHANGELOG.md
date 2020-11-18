## 0.3.0 - The Main Event - Nov 18, 2020
### New Features
* Textures are now cached for all doors on scene change, allowing doors to render without needing state change

### Bug Fixes
* Fixed textures not caching correctly on submission of settings forms. Previously, forms had to be submitted twice before a texture was recognised.
* Fixed logic for the selection of default or unique textures per door.

### Known Issues
* None

---

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
