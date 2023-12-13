import { Component, Input } from '@angular/core';
import { Card } from '../../../../services/card.service.types';

@Component({
  selector: 'app-deck-preview',
  standalone: true,
  imports: [],
  templateUrl: './deck-preview.component.html',
  styleUrl: './deck-preview.component.css',
})
export class DeckPreviewComponent {
  @Input()
  cards: Card[] = [];
}
