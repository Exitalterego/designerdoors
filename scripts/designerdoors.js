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

        if (this.wall.getFlag(modId, 'doorIcon') === true) {

            let s = this.wall.data.ds;
            const ds = CONST.WALL_DOOR_STATES;
            if (!game.user.isGM && s === ds.LOCKED) s = ds.CLOSED;
            const textures = this.wall.getFlag(modId, 'doorIcon');
            return getTexture(textures[s] || ds.CLOSED);

        // eslint-disable-next-line padded-blocks
        // eslint-disable-next-line no-else-return
        } else {

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

    }

    libWrapper.register(modId, 'DoorControl.prototype._getTexture', getTextureOverride, 'MIXED');

});

// Wall Config modifications
Hooks.on('renderWallConfig', (app, html, data) => {

    let thisDoor; // Object containing closed, open and locked paths as parameters

    // Flag logic.
    // Check for initial flag. If not present set default values.
    if (app.object.getFlag(modId, 'doorIcon') === undefined) {

        // If wall has no flag, populate thisDoor from default settings
        thisDoor = {
            0: game.settings.get(modId, 'doorClosedDefault'),
            1: game.settings.get(modId, 'doorOpenDefault'),
            2: game.settings.get(modId, 'doorLockedDefault'),
        };
        // Then set flag with contents of thisDoor
        app.object.setFlag(modId, 'doorIcon', thisDoor);

    } else {

        // If the flag already exist, populate thisDoor with the flag
        thisDoor = app.object.getFlag(modId, 'doorIcon');

    }

    let doorClosedFlag = thisDoor.doorClosedPath;
    let doorOpenFlag = thisDoor.doorOpenPath;
    let doorLockedFlag = thisDoor.doorLockedPath;

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
    form.submit.disabled = false;
    form.addEventListener("submit", () => {

        TextureLoader.loader.loadTexture(thisDoor.doorClosedPath);
        TextureLoader.loader.loadTexture(thisDoor.doorOpenPath);
        TextureLoader.loader.loadTexture(thisDoor.doorLockedPath);

    });

});
