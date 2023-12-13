import { Routes } from '@angular/router';
import { DeckDetailComponent } from './pages/deck-detail/deck-detail.component';
import { DecksComponent } from './pages/decks/decks.component';

export const routes: Routes = [
  {
    path: '',
    component: DecksComponent,
    title: 'Baralhos',
  },
  {
    path: 'novo',
    component: DeckDetailComponent,
    title: 'Novo baralho',
  },
  {
    path: 'baralhos/:id',
    component: DeckDetailComponent,
    title: 'Detalhe',
  },
  { path: '**', redirectTo: '/' },
];
