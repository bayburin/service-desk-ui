import { Type } from '@angular/core';
import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, OnDestroy } from '@angular/core';

import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-dynamic-template-content',
  templateUrl: './dynamic-template-content.component.html',
  styleUrls: ['./dynamic-template-content.component.scss']
})
export class DynamicTemplateContentComponent implements OnInit, OnDestroy {
  @Input() data: Category | Service | Ticket;
  @ViewChild('templateContainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  componentRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    const factories = Array.from(this.componentFactoryResolver['_factories'].keys());
    const factoryClass = factories.find((factory: any) => factory.name === this.data.pageComponent()) as Type<any>;

    this.entry.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(factoryClass);
    this.componentRef = this.entry.createComponent(componentFactory);
    this.componentRef.instance.data = this.data;
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }
}