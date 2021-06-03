/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import { libWrapper } from './shim.js';

const modName = 'Designer Doors';
const modId = 'designerdoors';

// Global function to cache default textures
const cacheTex = ((key) => {

    const defaultPath = game.settings.get(modId, key);
    TextureLoader.loader.loadTexture(defaultPath);

});

Hooks.on('setup', () => {
    
    // Override of the original getTexture method.
    // Adds additional logic for checking which icon to return
    function getTextureOverride() {

        // Determine door state
        const ds = CONST.WALL_DOOR_STATES;
        let s = this.wall.data.ds;  
        if (!game.user.isGM && s === ds.LOCKED ) s = ds.CLOSED;
        
        const wallPaths = this.wall.document.getFlag(modId, 'doorIcon');
        
        let path;
        if (s === ds.CLOSED && this.wall.data.door === CONST.WALL_DOOR_TYPES.SECRET) {
            path = game.settings.get(modId, 'doorSecretDefault');
        } else {
            // Determine texture to render
            if (s === ds.CLOSED) {
                path = wallPaths?.doorClosedPath ?? game.settings.get(modId, 'doorClosedDefault');
        } else if (s === ds.OPEN) { 
                path = wallPaths?.doorOpenPath ?? game.settings.get(modId, 'doorOpenDefault');
        } else if (s === ds.LOCKED) {
                path = wallPaths?.doorLockedPath ?? game.settings.get(modId, 'doorLockedDefault');
        }

        path ??= wallPaths?.doorClosedPath ?? game.settings.get(modId, 'doorClosedDefault');
        }

        return getTexture(path);
    }
        
    libWrapper.register( modId, 'DoorControl.prototype._getTexture', getTextureOverride, 'OVERRIDE');
    
    console.log('Loading Designer Doors module...');

    // Initialise settings for default icon paths
    // Closed door default icon

    game.settings.register(modId, 'doorClosedDefault', {
        name: 'Closed Door',
        hint: 'The default icon for a closed door',
        scope: 'world',
        config: true,
        default: `modules/${modId}/icons/door-steel.svg`,
        type: String,
        filePicker: true,
    });

    // Open door default icon

    game.settings.register(modId, 'doorOpenDefault', {
        name: 'Open Door',
        hint: 'The default icon for an open door',
        scope: 'world',
        config: true,
        default: `modules/${modId}/icons/door-exit.svg`,
        type: String,
        filePicker: true,
    });

    // Locked door default icon

    game.settings.register(modId, 'doorLockedDefault', {
        name: 'Locked Door',
        hint: 'The default icon for a locked door',
        scope: 'world',
        config: true,
        default: `modules/${modId}/icons/padlock.svg`,
        type: String,
        filePicker: true,
    });
        
    // Secret door default icon
    game.settings.register(modId, 'doorSecretDefault', {
        name: 'Secret Door',
        hint: 'The default icon for a secret door',
        scope: 'world',
        config: true,
        default: `modules/${modId}/icons/mute.svg`,
        type: String,
        filePicker: true,
    });


    // Cache default icons on setup of world
    console.log(`Loading ${modName} default door textures`);
    cacheTex('doorClosedDefault');
    cacheTex('doorOpenDefault');
    cacheTex('doorLockedDefault');
    cacheTex('doorSecretDefault');
    console.log(`${modName} texture loading complete`);
    


});

// Wall Config extension. Allows each door to have individual icons
Hooks.on('renderWallConfig', (app, html, data) => {

    // If the wall is not a door, break out of this script.
    // This will stop Designer Doors being added to the wall config form
    if (data.object.door === 0) {

        app.setPosition({
            height: 270,
            width: 400,
        });
        return;

    }

    // If the wall is a door, extend the size of the wall config form
    app.setPosition({
        height: "auto",
        width: 400,
    });

    let thisDoor; // Object containing closed, open and locked paths as parameters

    // Flag logic.
    // Check for initial flag. If not present set default values.
    if (app.object.getFlag(modId, 'doorIcon') === undefined) {

        // If wall has no flag, populate thisDoor from default settings
        thisDoor = {
            doorClosedPath: game.settings.get(modId, 'doorClosedDefault'),
            doorOpenPath: game.settings.get(modId, 'doorOpenDefault'),
            doorLockedPath: game.settings.get(modId, 'doorLockedDefault'),
        };
        // Then set flag with contents of thisDoor
        app.object.setFlag(modId, 'doorIcon', thisDoor);

    } else {

        // If the flag already exist, populate thisDoor with the flag
        thisDoor = app.object.getFlag(modId, 'doorIcon');

    }

    const doorClosedFlag = thisDoor.doorClosedPath;
    const doorOpenFlag = thisDoor.doorOpenPath;
    const doorLockedFlag = thisDoor.doorLockedPath;

    // html to extend Wall Config form
    const message =
    `<div class="form-group">
        <label>Door Icons</label>
        <p class="notes">File paths to icons representing various door states.</p>
        </div>

    <div class="form-group">
		<label>Door Close</label>
		<div class="form-fields">
			<button type="button" class="file-picker" data-type="img" data-target="flags.${modId}.doorIcon.doorClosedPath" title="Browse Files" tabindex="-1">
			    <i class="fas fa-file-import fa-fw"></i>
			</button>
			<input class="img" type="text" name="flags.${modId}.doorIcon.doorClosedPath" value="${doorClosedFlag ? doorClosedFlag : ``}" placeholder="Closed Door Icon Path" data-dtype="String" />
		</div>
	</div>

    <div class="form-group">
		<label>Door Open</label>
		<div class='form-fields'>
			<button type='button' class='file-picker' data-type='img' data-target='flags.${modId}.doorIcon.doorOpenPath' title='Browse Files' tabindex='-1'>
				<i class='fas fa-file-import fa-fw'></i>
			</button>
			<input class='img' type='text' name='flags.${modId}.doorIcon.doorOpenPath' value='${doorOpenFlag ? doorOpenFlag : ``}' placeholder='Open Door Icon Path' data-dtype='String' />
	    </div>
	</div>

    <div class='form-group'>
		<label>Door Locked</label>
		<div class='form-fields'>
			<button type='button' class='file-picker' data-type='img' data-target='flags.${modId}.doorIcon.doorLockedPath' title='Browse Files' tabindex='-1'>
			    <i class='fas fa-file-import fa-fw'></i>
			</button>
			<input class='img' type='text' name='flags.${modId}.doorIcon.doorLockedPath' value='${doorLockedFlag ? doorLockedFlag : ``}' placeholder='Locked Door Icon Path' data-dtype='String' />
        </div>
	</div>
    `;

    // Thanks to Calego#0914 on the League of Extraordinary FoundryVTT Developers
    // Discord server for the jQuery assistance here.
    // Adds form-group and buttons to the correct position on the Wall Config
    html.find('.form-group').last().after(message);

    // File Picker buttons
    
    // Is it possible that this may cause conflicts with other modules that add file picker buttons? To be tested.
    // May need mod specific CSS class for file picker button - ddfile-picker?
    
    html.find('button.file-picker').on('click', app._activateFilePicker.bind(app));
    
    // On submitting the Wall Config form, requested textures are added to the cache

    const form = document.getElementById('wall-config');
    form.addEventListener('submit', (e) => {
        
        // Door state keys used to define HTML element names
        const doorStates = ['doorClosedPath','doorOpenPath','doorLockedPath'];
        
        // Loop through states, caching textures from provided paths
        for (let state of doorStates) {
            const elementName = `flags.${modId}.doorIcon.${state}`
            const path = document.getElementsByName(elementName)[0].value;
            e.preventDefault();
            TextureLoader.loader.loadImageTexture(path);
        };

    });

});

// Cache default textures on submitting Settings Config
// Only really needed if default textures are changed, but as I haven't
// yet figured out how to only run on changes, it will just run on every
// submission of the settings form.
Hooks.on('renderSettingsConfig', () => {

    const form = document.getElementById('client-settings');
    form.addEventListener('submit', (e) => {

        // Door state keys used in game settings
        const doorStates = ['doorClosedDefault','doorOpenDefault','doorLockedDefault','doorSecretDefault'];
        
        // Loop through states, caching textures from provided paths
        for (let state of doorStates) {
            const path = document.getElementsByName(`${modId}.${state}`)[0].value;
            e.preventDefault();
            TextureLoader.loader.loadImageTexture(path);
        };

    });

});

// On scene change, scan for doors and cache textures
Hooks.on('canvasInit', () => {

    // List of all walls in scene
    const sceneWalls = game.scenes.viewed.data.walls;
    
    // Scan walls for DD flags
    for (let wall of sceneWalls){
        if (wall.getFlag(modId, 'doorIcon')) {
            // Cycle through flag paths and submit to cache
            const pathsArray = Object.values(wall.getFlag(modId, 'doorIcon'));
            for (let path of pathsArray){
                TextureLoader.loader.loadImageTexture(path);
            };
        }
    };
 
    // Cache default icons on scene change
    console.log(`Loading ${modName} default door textures`);
    cacheTex('doorClosedDefault');
    cacheTex('doorOpenDefault');
    cacheTex('doorLockedDefault');
    cacheTex('doorSecretDefault');
    console.log(`${modName} texture loading complete`);
    
});
