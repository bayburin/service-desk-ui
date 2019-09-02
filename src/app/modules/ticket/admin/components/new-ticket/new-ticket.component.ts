import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.sass']
})
export class NewTicketComponent implements OnInit {
  modal: NgbModalRef;
  @ViewChild('content', { static: true }) content: ElementRef;

  constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.modal = this.modalService.open(
      this.content,
      {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'modal-holder'
      }
    );
  }

  save() {
    console.log('save');
  }

  cancel() {
    this.modal.dismiss();
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }
}
