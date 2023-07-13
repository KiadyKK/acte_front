import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-resume-takeover',
  templateUrl: './modal-resume-takeover.component.html',
  styleUrls: ['./modal-resume-takeover.component.css']
})
export class ModalResumeTakeoverComponent {
  @Input() nbLigne: any;
  @Input() nbrError: any;
  @Input() client: string;

  constructor(public activeModal: NgbActiveModal) {}
}
