import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeleteConfirmationDialogComponent } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageDialogComponent } from '../../components/message-dialog/message-dialog.component';
import { CardService } from '../../services/card.service';
import { Card } from '../../services/card.service.types';
import { Deck, DeckService } from '../../services/deck.service';
import { Pagination } from '../../types/pagination.types';

@Component({
  selector: 'app-deck-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    FormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './deck-detail.component.html',
  styleUrl: './deck-detail.component.css',
})
export class DeckDetailComponent {
  deck: Deck = new Deck(undefined, '', []);
  cardsPagination: Pagination<Card> | undefined;
  page: number = 1;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50];
  loading = true;

  cardsFilterForm = new FormGroup({
    name: new FormControl(''),
  });

  @ViewChild('deckContainer')
  deckContainer: ElementRef<HTMLDivElement> | undefined;

  constructor(
    private deckService: DeckService,
    private cardService: CardService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {
    const id = this.route.snapshot.params['id'];

    if (id) {
      const deck = deckService.getDeck(Number(id));
      if (deck) {
        this.deck = deck;
      }
    }

    this.searchCards();
  }

  private searchCards() {
    this.loading = true;
    this.cardService
      .searchCards({
        page: this.page,
        name: this.cardsFilterForm.value.name || '',
        size: this.pageSize,
      })
      .then((response) => {
        this.cardsPagination = response;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  removeCardByIndex(index: number) {
    this.deck.cards.splice(index, 1);
  }

  addNewCard(card: Card) {
    const cardsWithThisName = this.deck.cards.filter(
      (item) => item.name === card.name
    ).length;

    if (cardsWithThisName === 4) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: `Você já tem 4 "${card.name}"`,
          subtitle: 'Exclua uma das cartas para poder adicionar esta.',
        },
      });
      return;
    }

    this.deck.cards.push(card);

    setTimeout(() => {
      this.deckContainer?.nativeElement.scrollTo({
        behavior: 'smooth',
        top: this.deckContainer.nativeElement.scrollHeight,
        left: this.deckContainer.nativeElement.scrollWidth,
      });
    }, 50);
  }

  private goToHome() {
    this.router.navigate(['/']);
  }

  saveDeck() {
    if (this.deck.cards.length < 24) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Adicione mais cartas!',
          subtitle: 'Seu baralho precisa ter pelo menos 24 cartas.',
        },
      });
      return;
    }
    if (this.deck.cards.length > 60) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Seu baralho tem muitas cartas!',
          subtitle: 'Ele pode conter no máximo 60. Remova algumas.',
        },
      });
      return;
    }

    if (this.deck.id) {
      this.deckService.updateDeck(this.deck.id, {
        cards: this.deck.cards,
        name: this.deck.name,
      });
    } else {
      this.deckService.createDeck({
        cards: this.deck.cards,
        name: this.deck.name,
      });
    }

    this.goToHome();
  }

  handlePageEvent(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.searchCards();
  }

  filter() {
    this.searchCards();
  }

  deleteDeck() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        if (this.deck.id) {
          this.deckService.deleteDeck(this.deck.id);
        }

        this.goToHome();
      }
    });
  }
}
