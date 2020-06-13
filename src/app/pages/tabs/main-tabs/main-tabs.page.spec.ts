import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainTabsPage } from './main-tabs.page';

describe('MainTabsPage', () => {
  let component: MainTabsPage;
  let fixture: ComponentFixture<MainTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTabsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
