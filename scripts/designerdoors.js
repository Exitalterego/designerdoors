/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import { libWrapper } from './shim.js';

const modName = 'Designer Doors';
const modId = 'designerdoors';

Hooks.on('setup', () => {

    console.log(`Loading ${modName} module...`);

    // Initialise settings for default icon paths
    // Closed door default icon

    game.settings.register(modId, 'doorClosedDefault', {
        name: 'Closed Door',
        hint: 'The default icon for a closed door',
        scope: 'world',
        config: true,
        default: `modules/${modId}/icons/door-steel.svg`,
        type: String,
    });

    // Open door default icon

    game.settings.register(modId, 'doorOpenDefault', {
        name: 'Open Door',
        hint: 'The default icon for an open door',
        scope: 'world',
        config: true,
        default: `modules/${modId}/icons/door-exit.svg`,
        type: String,
    });

    // Locked door default icon

    game.settings.register(modId, 'doorLockedDefault', {
        name: 'Locked Door',
        hint: 'The default icon for a locked door',
        scope: 'world',
        config: true,
        default: `modules/${modId}/icons/padlock.svg`,
        type: String,
    });

    const cacheTex = (key => {

        const defaultPath = game.settings.get(modId, key);
        TextureLoader.loader.loadTexture(defaultPath);

    });

    // Cache default icons on setup of world
    console.log(`Loading ${modName} default door textures`);
    cacheTex('doorClosedDefault');
    cacheTex('doorOpenDefault');
    cacheTex('doorLockedDefault');
    console.log(`${modName} texture loading complete`);

    async function getTextureOverride() {

        if (this.wall.getFlag(modId, 'doorIcon') === undefined) {

            let s = this.wall.data.ds;
            const ds = CONST.WALL_DOOR_STATES;
            if (!game.user.isGM && s === ds.LOCKED ) s = ds.CLOSED;
            const textures = {
                [ds.LOCKED]: game.settings.get(modId, 'doorLockedDefault'),
                [ds.CLOSED]: game.settings.get(modId, 'doorClosedDefault'),
                [ds.OPEN]: game.settings.get(modId, 'doorOpenDefault')
            };
            return getTexture(textures[s] || ds.CLOSED);

        }

        let s = this.wall.data.ds;
        const ds = CONST.WALL_DOOR_STATES;
        if (!game.user.isGM && s === ds.LOCKED) s = ds.CLOSED;
        const wallPaths = this.wall.getFlag(modId, 'doorIcon');
        const textures = {
            [ds.LOCKED]: wallPaths['doorLockedPath'],
            [ds.CLOSED]: wallPaths['doorClosedPath'],
            [ds.OPEN]: wallPaths['doorOpenPath'],
        };
        return getTexture(textures[s] || ds.CLOSED);

    }

    libWrapper.register(modId, 'DoorControl.prototype._getTexture', getTextureOverride, 'MIXED');

});

// Wall Config modifications
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
        height: 700,
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
    const button1 = html.find(`button[data-target="flags.${modId}.doorIcon.doorClosedPath"]`)[0];
    const button2 = html.find(`button[data-target="flags.${modId}.doorIcon.doorOpenPath"]`)[0];
    const button3 = html.find(`button[data-target="flags.${modId}.doorIcon.doorLockedPath"]`)[0];

    app._activateFilePicker(button1);
    app._activateFilePicker(button2);
    app._activateFilePicker(button3);

    // On submitting the Wall Config form, requested textures are added to the cache
    const form = document.getElementById('wall-config');
    form.addEventListener('submit', (e) => {

        e.preventDefault();

        // Grab values from form input
        const nameDCP = `flags.${modId}.doorIcon.doorClosedPath`;
        const nameDOP = `flags.${modId}.doorIcon.doorOpenPath`;
        const nameDLP = `flags.${modId}.doorIcon.doorLockedPath`;

        const wcDCD = document.getElementsByName(nameDCP)[0].value;
        const wcDOD = document.getElementsByName(nameDOP)[0].value;
        const wcDLD = document.getElementsByName(nameDLP)[0].value;

        TextureLoader.loader.loadTexture(wcDCD);
        TextureLoader.loader.loadTexture(wcDOD);
        TextureLoader.loader.loadTexture(wcDLD);

    });

});

// Cache default textures on submitting Settings Config
// Only really needed if default textures are changed, but as I haven't
// yet figured out how to only run on changes, it will just run on every
// form submission.
Hooks.on('renderSettingsConfig', () => {

    const form = document.getElementById('client-settings');
    form.addEventListener('submit', (e) => {

        e.preventDefault();

        // Grab values from form input
        const sdCD = document.getElementsByName(`${modId}.doorClosedDefault`);
        const sdOD = document.getElementsByName(`${modId}.doorOpenDefault`);
        const sdLD = document.getElementsByName(`${modId}.doorLockedDefault`);

        TextureLoader.loader.loadTexture(sdCD[0].value);
        TextureLoader.loader.loadTexture(sdOD[0].value);
        TextureLoader.loader.loadTexture(sdLD[0].value);

    });

});
