<div align="center">
    <br>
    <img src="https://user-images.githubusercontent.com/12241468/99018302-a4a83d80-2551-11eb-9a4b-32853b7302c2.png" alt="Logo">
    <br>
    <h3>Making better looking doors since 2020</h3>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/code%20style-air--bnb-brightgreen?style=flat-square" alt="Code Style Badge"></img>
  <img src="https://img.shields.io/github/license/exitalterego/designerdoors?color=bright%20green&style=flat-square" alt="MIT License Badge"></img>
  <img src="https://img.shields.io/github/v/release/exitalterego/designerdoors?color=bright%20green&style=flat-square" alt="Release Version Badge"></img>
  <img src="http://hits.dwyl.com/exitalterego/designerdoors.svg" alt="Hits Badge"></img>
  <img src="https://img.shields.io/github/downloads/exitalterego/designerdoors/total?color=bright%20green&style=flat-square" alt="Downloads Badge"></img>
</div>

<div align="center">
    <a href='https://ko-fi.com/B0B62PUPS' target='_blank'>
        <img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi3.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' />
    </a>
</div>

___

### Key Features
You can change the default door icons used to show closed, open and locked doors. These are set through the module settings panel and will be applied to all doors that DO NOT have their own custom icons.
![DD_default_doors](https://user-images.githubusercontent.com/12241468/99480682-7b701e80-2950-11eb-8f95-ff51749174d7.gif)<br>
This may be useful to create door control icons more appropriate to a given setting or genre of game.

Each door can also be assigned icons specific to that door only. These are assigned in the the wall control panel.
![DD_individual_doors](https://user-images.githubusercontent.com/12241468/99480703-86c34a00-2950-11eb-9389-3af05ef9723d.gif)<br>
This allows a GM to either give a particular door unique icons (perhaps a portal or teleporter would have different icons than a normal door), or to change the feel of a particular scene (a dungeon may use different icons than an inn).

### Installation
Either paste the manifest link below directly into the Module Installer in your Foundry server 'Configuration and Setup' tab, or search for the module listed in the same Module Installer.

### Manifest
https://raw.githubusercontent.com/Exitalterego/designerdoors/main/module.json

### Compatability
This module uses a re-write of the *\_getTexture* method from the Door Controller class. This method is, as far as I am aware, only utilised to choose which image to use for your doors.

As such, there should be no compatability issues unless another module directly tries to change door icons.

If I become aware of any such modules they will be listed here.

### Feedback
I am welcome to constructive feedback, improvement suggestions, additional feature requests and bug reports.

For all of these, please open an Issue here on Github. You can also find me on Discord as Exitalterego#8315, however I do not guarentee a swift response through there. Github issues are preferred.

If you can code your own features or bug fixes, you may also do a pull request. Full credit will be give for your contributions. 

### Abandonment
Abandoned modules are a (potential) problem for Foundry, because users and/or other modules might rely on abandoned modules, which might break in future Foundry updates.<br>
I consider this module abandoned if all of the below cases apply:
<ul>
  <li>This module/github page has not received any updates in at least 3 months</li>
  <li>I have not posted anything on "the Foundry" and "the League of Extraordinary Foundry VTT Developers" discord servers in at least 2 months</li>
  <li>I have not responded to emails or PMs on Discord in at least 1 month</li>
  <li>I have not announced a temporary break from development, unless the announced end date of this break has been passed by at least 2 months</li>
</ul>
If the above cases apply (as judged by the "League of Extraordinary Foundry VTT Developers" admins), I give permission to the "League of Extraordinary Foundry VTT Developers" admins to assign one or more developers to take over this module, including requesting the Foundry team to reassign the module to the new developer(s).<br>
I require the "League of Extraordinary Foundry VTT Developers" admins to send me an email 2 weeks before the reassignment takes place, to give me one last chance to prevent the reassignment.
I require to be credited for my work in all future releases.

### Licence
Designer Doors is licensed under the [MIT License](https://github.com/Exitalterego/designerdoors/blob/main/LICENSE).

This work is also licensed under the [FOUNDRY VIRTUAL TABLETOP END USER LICENSE AGREEMENT - May 29, 2020](https://foundryvtt.com/article/license/).

### Credits
* shim.js - provided by *Ruipin* and their *[libWrapper module](https://github.com/ruipin/fvtt-lib-wrapper)*
* Logo Font - **[Couture](https://www.dafont.com/couture.font)** by *Chase Babb*. Licensed under terms as an open-source project (email confirmation available upon request)
* Icons - **[game-icons.net](https://game-icons.net/)** licensed under *[CC-BY-3.0](https://creativecommons.org/licenses/by/3.0/)*
* Module Name - Inspiration kindly provided by *Norc#5108* on the FoundryVTT Discord server
* Many thanks to *Calego#0914* for pointing me in the right direction on several occasions.
* The League of Extraordinary Foundry VTT Developers Discord server for just generlly being all-round awesome.
