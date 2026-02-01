/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import { libWrapper } from './shim.js';

const modName = 'Designer Doors';
const modId = 'designerdoors';

// Cross-version texture preloader (v11–v13)
function loadTextureCompat(path) {
  try {
    const loader =
      foundry?.canvas?.TextureLoader?.loader ||       // v12–v13
      globalThis?.TextureLoader?.loader ||            // v11 global
      null;

    if (loader?.loadTexture) return loader.loadTexture(path);

    // Fallback: just create a PIXI texture to hint the cache
    const TexFrom = (globalThis.PIXI?.Texture ?? globalThis.Texture)?.from;
    if (typeof TexFrom === "function") TexFrom(path);
  } catch (e) {
    console.warn(`[${modId}] Texture preload failed for:`, path, e);
  }
}

// Cross-version texture factory (v11–v13)
function textureFromCompat(path) {
  try {
    // v13+ helper if present
    const getTex = foundry?.canvas?.getTexture;
    if (typeof getTex === "function") return getTex(path);
    // v11/v12: fall back to PIXI
    const TexFrom = (globalThis.PIXI?.Texture ?? globalThis.Texture)?.from;
    if (typeof TexFrom === "function") return TexFrom(path);
  } catch (e) {
    console.warn(`[${modId}] textureFromCompat failed for: ${path}`, e);
  }
  return null;
}

// Cross-version file picker (v11-v13)
function resolveFilePickerClass() {
  return (
    CONFIG?.ux?.FilePicker ||                                      // v13+ override point
    foundry?.applications?.apps?.FilePicker?.implementation ||     // v13 namespaced
    globalThis.FilePicker                                          // v11 global
  );
}

// Global function to cache default textures
const cacheTex = ((key) => {

    const defaultPath = game.settings.get(modId, key);
    loadTextureCompat(defaultPath);

});

Hooks.on('setup', () => {
    
    // Override of the original getTexture method.
    // Adds additional logic for checking which icon to return
    function getTextureOverride() {

        // Determine door state
        const ds = CONST.WALL_DOOR_STATES;
        let s = this.wall.document.ds;  
        if (!game.user.isGM && s === ds.LOCKED ) { s = ds.CLOSED;}
        
        const wallPaths = this.wall.document.getFlag(modId, 'doorIcon');
        
        let path;
        if (s === ds.CLOSED && this.wall.document.door === CONST.WALL_DOOR_TYPES.SECRET) {
			// Prefer per-door flag, fall back to world default
			path = wallPaths?.doorSecretPath ?? game.settings.get(modId, 'doorSecretDefault');
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

        return textureFromCompat(path);
    }
        
    const hasNamespacedDoorControl = !!(foundry?.canvas?.containers?.DoorControl);
    const target = hasNamespacedDoorControl
      ? 'foundry.canvas.containers.DoorControl.prototype._getTexture'  // v13+
      : 'DoorControl.prototype._getTexture';                            // v11–v12
    libWrapper.register(modId, target, getTextureOverride, 'OVERRIDE');
    
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
  // Prefer the document (AppV2); fall back for older patterns
  const wallDoc = app.document ?? app.object?.document ?? app.object ?? null;
  if (!wallDoc) return;

  // If the wall is not a door, shrink and exit
  if ((wallDoc.door ?? 0) === 0) {
    app.setPosition({ height: 270, width: 400 });
    return;
  }

  // Resize to make space for extra fields
  app.setPosition({ height: 'auto', width: 400 });

  // Resolve or initialize the per-door flag
  let thisDoor = wallDoc.getFlag(modId, 'doorIcon');
  if (thisDoor === undefined) {
    thisDoor = {
      doorClosedPath: game.settings.get(modId, 'doorClosedDefault'),
      doorOpenPath: game.settings.get(modId, 'doorOpenDefault'),
      doorLockedPath: game.settings.get(modId, 'doorLockedDefault'),
    };
    // setFlag returns a Promise; we don't need to await it here
    wallDoc.setFlag(modId, 'doorIcon', thisDoor);
  }

  const doorClosedFlag = thisDoor?.doorClosedPath ?? '';
  const doorOpenFlag   = thisDoor?.doorOpenPath   ?? '';
  const doorLockedFlag = thisDoor?.doorLockedPath ?? '';
  const doorSecretFlag = thisDoor?.doorSecretPath ?? '';

  // Build our additional form block
  const message = `
    <div class="form-group">
      <label>Door Icons</label>
      <p class="notes">File paths to icons representing various door states.</p>
    </div>

    <div class="form-group">
      <label>Door Closed</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="image" data-target="flags.${modId}.doorIcon.doorClosedPath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="img" type="text" name="flags.${modId}.doorIcon.doorClosedPath" value="${doorClosedFlag}" placeholder="Closed Door Icon Path" data-dtype="String" />
      </div>
    </div>

    <div class="form-group">
      <label>Door Open</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="image" data-target="flags.${modId}.doorIcon.doorOpenPath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="img" type="text" name="flags.${modId}.doorIcon.doorOpenPath" value="${doorOpenFlag}" placeholder="Open Door Icon Path" data-dtype="String" />
      </div>
    </div>

    <div class="form-group">
      <label>Door Locked</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="image" data-target="flags.${modId}.doorIcon.doorLockedPath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="img" type="text" name="flags.${modId}.doorIcon.doorLockedPath" value="${doorLockedFlag}" placeholder="Locked Door Icon Path" data-dtype="String" />
      </div>
     </div>

	<div class="form-group">
	  <label>Secret Door (Closed)</label>
	  <div class="form-fields">
	    <button type="button" class="file-picker" data-type="image" data-target="flags.${modId}.doorIcon.doorSecretPath" title="Browse Files" tabindex="-1">
		  <i class="fas fa-file-import fa-fw"></i>
		</button>
		<input class="img" type="text" name="flags.${modId}.doorIcon.doorSecretPath" value="${doorSecretFlag}" placeholder="Secret Door Icon Path" data-dtype="String" />
	  </div>
	 </div>
  `;

  // Normalize the hook's HTML param (HTMLElement vs jQuery wrapper)
  const rootEl = (html instanceof HTMLElement) ? html : html?.[0];
  if (!rootEl) return;

  // Prefer the “Door Configuration” fieldset; fall back sensibly.
  // Heuristics:
  // 1) fieldset with a legend containing "Door Configuration"
  // 2) fieldset that contains inputs named for door settings
  // 3) else the active/main tab, else the root
  let containerEl =
    // 1) Legend text match
    [...rootEl.querySelectorAll('fieldset')].find(fs =>
      fs.querySelector('legend')?.textContent?.toLowerCase().includes('door configuration')
    ) ||
    // 2) Contains door-related inputs (type/state)
    [...rootEl.querySelectorAll('fieldset')].find(fs =>
      fs.querySelector('[name="door"], [name="ds"], select[name="door"], select[name="ds"]')
    ) ||
    // 3) Fallbacks
    rootEl.querySelector('.tab.active') ||
    rootEl.querySelector('.tab[data-tab="main"]') ||
    rootEl;

  // Append our custom fields to the chosen container
  containerEl.insertAdjacentHTML('beforeend', message);

  // Resolve the form element once (AppV2 exposes app.form)
  const form = app.form ?? rootEl.closest('form');
  if (!form) return;

  // Attach a version-agnostic FilePicker handler
  rootEl.querySelectorAll('button.file-picker').forEach(btn => {
    btn.addEventListener('click', ev => {
      ev.preventDefault();
      const targetName = ev.currentTarget?.dataset?.target;
      const type = ev.currentTarget?.dataset?.type || 'image';
      if (!targetName) return;

      const input = form.querySelector(`[name="${targetName}"]`);
      const current = input?.value ?? '';
	  
	  // v11-friendly: if the app exposes a picker activator, delegate to it.
      const activateFP = (app._activateFilePicker ?? app.activateFilePicker);
      if (typeof activateFP === 'function') {
        // Core handler expects `this` = app and the click event
        return activateFP.call(app, ev);
      }

      // v12–v13 (or if the above isn’t present): construct a picker ourselves
      const Picker = resolveFilePickerClass();
      if (typeof Picker !== "function") {
        ui.notifications?.warn?.("[designerdoors] FilePicker not available");
        return;
      }
	  
      const fp = new Picker({
        type,
        current,
        callback: (url) => {
          if (!input) return;
          input.value = url;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      fp.render(true);
    });
  });

  // Warm cache when any of our per-door fields change
  const wallFlagNames = [
	`flags.${modId}.doorIcon.doorClosedPath`,
	`flags.${modId}.doorIcon.doorOpenPath`,
	`flags.${modId}.doorIcon.doorLockedPath`,
	`flags.${modId}.doorIcon.doorSecretPath`,
  ];

  form.addEventListener('change', (ev) => {
	const t = ev.target;
	if (!(t instanceof HTMLInputElement)) return;
	if (!wallFlagNames.includes(t.name)) return;
	const p = t.value?.trim();
	if (p) loadTextureCompat(p);
  }, { passive: true });
	
  form.addEventListener('submit', () => {
    const fields = [
      `flags.${modId}.doorIcon.doorClosedPath`,
      `flags.${modId}.doorIcon.doorOpenPath`,
      `flags.${modId}.doorIcon.doorLockedPath`,
	  `flags.${modId}.doorIcon.doorSecretPath`,
    ];
    for (const name of fields) {
      const input = form.querySelector(`[name="${name}"]`);
      const path = input?.value?.trim();
      if (path) loadTextureCompat(path);
    }
  });
});

// Warm textures when a wall updates AND refresh the affected control (v11–v13 safe)
Hooks.on('updateWall', (doc, changes) => {
  try {
    // Only act if our flags changed or door props changed
    const ddChanged = !!(changes?.flags?.[modId] || changes?.flags?.[`-=${modId}`]);
    const doorChanged = ('door' in (changes ?? {})) || ('ds' in (changes ?? {}));
    if (!ddChanged && !doorChanged) return;

    // Only if this wall is on the active scene
    const activeSceneId = canvas?.scene?.id;
    const wallSceneId = doc?.parent?.id ?? doc?.scene?._id; // v11 fallback
    if (activeSceneId && wallSceneId && activeSceneId !== wallSceneId) return;

    // Pre-cache any icon paths present
    const f = doc.getFlag(modId, 'doorIcon');
    if (f && typeof f === 'object') {
      for (const k of ['doorClosedPath', 'doorOpenPath', 'doorLockedPath', 'doorSecretPath']) {
        const p = f[k];
        if (p) loadTextureCompat(p);
      }
    }

    // Targeted refresh: find this wall's DoorControl and redraw it
    const doorsLayer = canvas?.controls?.doors;
    const children = doorsLayer?.children;
    const control = Array.isArray(children) ? children.find(dc => dc?.wall?.id === doc.id) : null;

    if (control?.draw) {
      control.draw();               // Best case: redraw only this control
    } else if (canvas?.controls?.refresh) {
      canvas.controls.refresh();    // Fallback: refresh controls layer
    } else if (doorsLayer?.draw) {
      doorsLayer.draw();            // Older fallback
    } else if (canvas?.draw) {
      canvas.draw();                // Last resort
    }
  } catch (e) {
    console.warn(`[${modId}] updateWall refresh failed`, e);
  }
});

// Cache default textures on submitting Settings Config (v11–v13 safe)
Hooks.on('renderSettingsConfig', (app, html /*, data */) => {
  // Prefer Application's form (AppV2), then html root, then legacy fallback
  const rootEl = (html instanceof HTMLElement) ? html : html?.[0];
  const form = app?.form ?? rootEl?.closest?.('form') ?? document.getElementById('client-settings');
  if (!form) return;

  // Avoid multiple listeners if the panel re-renders
  form.removeEventListener?.('__dd_cache_submit__', form.__dd_cache_submit_handler__);

  const handler = () => {
    const fields = [
      `${modId}.doorClosedDefault`,
      `${modId}.doorOpenDefault`,
      `${modId}.doorLockedDefault`,
      `${modId}.doorSecretDefault`,
    ];
    for (const name of fields) {
      const input = form.querySelector(`[name="${name}"]`);
      const path = input?.value?.trim();
      if (path) loadTextureCompat(path);
    }
  };

  // Tag the handler so we can safely remove/re-add on re-render
  form.__dd_cache_submit_handler__ = handler;
  form.addEventListener('submit', handler);

// Warm cache when any default path changes in settings
  const settingNames = [
    `${modId}.doorClosedDefault`,
    `${modId}.doorOpenDefault`,
    `${modId}.doorLockedDefault`,
    `${modId}.doorSecretDefault`,
  ];

  form.addEventListener('change', (ev) => {
    const t = ev.target;
    if (!(t instanceof HTMLInputElement)) return;
    if (!settingNames.includes(t.name)) return;
    const p = t.value?.trim();
    if (p) loadTextureCompat(p);
  }, { passive: true });

	
  // Marker event name to allow removeEventListener above to no-op safely
  form.addEventListener?.('__dd_cache_submit__', handler);
});

// On scene change, scan for doors and cache textures
Hooks.on('canvasInit', () => {

    // List of all walls in scene
    const sceneWalls = game.scenes.viewed.walls;
    
    // Scan walls for DD flags
    for (let wall of sceneWalls){
        if (wall.getFlag(modId, 'doorIcon')) {
            // Cycle through flag paths and submit to cache
            const pathsArray = Object.values(wall.getFlag(modId, 'doorIcon'));
            for (let path of pathsArray){
                loadTextureCompat(path);
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
