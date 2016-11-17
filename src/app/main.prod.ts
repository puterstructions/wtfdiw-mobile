import {platformBrowser} from '@angular/platform-browser';
import {enableProdMode} from '@angular/core';

import {WtfDiwModuleNgFactory} from './app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(WtfDiwModuleNgFactory);
