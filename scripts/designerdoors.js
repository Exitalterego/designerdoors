import { libWrapper } from './shim.js';

const modName = 'Designer Doors';
const modId = 'designerdoors';

Hooks.on('setup', (game) => {

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
            if ( !game.user.isGM && s === ds.LOCKED ) s = ds.CLOSED;
            const textures = {
                [ds.LOCKED]: game.settings.get('foundrydoors', 'doorLockedPathDefault'),
                [ds.CLOSED]: game.settings.get('foundrydoors', 'doorClosedPathDefault'),
                [ds.OPEN]: game.settings.get('foundrydoors', 'doorOpenPathDefault')
            };
            return getTexture(textures[s] || ds.CLOSED);

        }

    }

    libWrapper.register(modId, 'DoorControl.prototype._getTexture', getTextureOverride, 'MIXED');

});

// Wall Config modifications
Hooks.on('renderWallConfig', (app, html, data) => {

    if (data.object.door === 0) {

        app.setPosition({
            height: 270,
            width: 400,
        });
        return;

    }
    app.setPosition({
        height: 270,
        width: 400,
    });

    let thisDoor; // Object containing closed, open and locked paths as parameters

    // Flag logic.
    // Check for initial flag. If not present set default values. Otherwise initialise empty flag
    if (app.object.getFlag(modId, 'doorIcon') == null)
    {

        thisDoor = {
            doorClosedPath: game.settings.get(modId, 'doorClosedPathDefault'),
            doorOpenPath: game.settings.get(modId, 'doorOpenPathDefault'),
            doorLockedPath: game.settings.get(modId, 'doorLockedPathDefault'),
        };
        app.object.setFlag(modId, 'doorIcon', thisDoor);
        console.log(thisDoor);

    } else {

        thisDoor = app.object.getFlag(modId, 'doorIcon');
        console.log(thisDoor);

    }

});
