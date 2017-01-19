import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { SemiProcesadoComponent} from './semiProcesadoComponent';
import { AgregadorSemiProcesadoComponent} from './agregadorSemiProcesadoComponent';
import { SemiProcesadoServices} from './semiProcesadoServices';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    SemiProcesadoComponent,
    AgregadorSemiProcesadoComponent
  ],
  providers: [ SemiProcesadoServices ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
