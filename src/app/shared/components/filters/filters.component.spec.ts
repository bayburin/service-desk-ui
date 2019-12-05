import { FilterI } from '@interfaces/filter.interface';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersComponent } from './filters.component';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let filters: FilterI[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    filters = [
      { id: 1, name: 'First filter', count: 1 },
      { id: 2, name: 'Second filter', count: 3 }
    ];

    fixture.detectChanges();
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#selectFilter', () => {
    let selectedFilter: FilterI;

    beforeEach(() => {
      selectedFilter = filters[0];
    });

    it('should assign "selectedFilter" attribute', () => {
      component.selectFilter(selectedFilter.id);

      expect(component.selectedFilterId).toEqual(selectedFilter.id);
    });

    it('should emit "selectedFilter" attribute to "changeFilter" subject', () => {
      const spy = spyOn(component.changeFilter, 'emit');
      component.selectFilter(selectedFilter.id);

      expect(spy).toHaveBeenCalled();
    });
  });

// Shallow tests ===========================================================================================================================

  describe('shallow tests', () => {
    beforeEach(() => {
      component.data = filters;
      fixture.detectChanges();
    });

    it('should show all avaliable filters', () => {
      const filterNames = filters.map(filter => filter.name);

      filterNames.forEach(name => {
        expect(fixture.debugElement.nativeElement.textContent).toContain(name);
      });
    });

    it('should show count of data in each filter', () => {
      const filterCounts = filters.map(filter => filter.count);

      filterCounts.forEach(count => {
        expect(fixture.debugElement.nativeElement.textContent).toContain(`(${count})`);
      });
    });

    it('should set "active" class after filter has been clicked', () => {
      const item = fixture.debugElement.nativeElement.querySelector('span.nav-item:last-child');
      item.click();
      fixture.detectChanges();

      expect(item.classList).toContain('active');
    });

    it('should call "selectFilter" after filter has been clicked', () => {
      const spy = spyOn(component, 'selectFilter');
      const item = fixture.debugElement.nativeElement.querySelector('span.nav-item:last-child');
      item.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });
});
