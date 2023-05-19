import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-retour-cx',
  templateUrl: './modal-retour-cx.component.html',
  styleUrls: ['./modal-retour-cx.component.css']
})
export class ModalRetourCxComponent {
  @Input() jobids: Array<any>;

  constructor(public activeModal: NgbActiveModal) {}
}
