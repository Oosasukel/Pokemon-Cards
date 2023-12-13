import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DeleteConfirmationDialogComponent } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Deck, DeckService } from '../../services/deck.service';
import { DeckPreviewComponent } from './components/deck-preview/deck-preview.component';

@Component({
  selector: 'app-decks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    DeckPreviewComponent,
  ],
  templateUrl: './decks.component.html',
  styleUrl: './decks.component.css',
})
export class DecksComponent {
  decks: Deck[] = [];

  constructor(private deckService: DeckService, public dialog: MatDialog) {
    this.decks = this.deckService.getDecks();
  }

  openDialogDeleteConfirmation(deckId: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deckService.deleteDeck(deckId);
        this.decks = this.deckService.getDecks();
      }
    });
  }
}
