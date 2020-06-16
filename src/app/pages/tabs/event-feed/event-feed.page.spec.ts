import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventFeedPage } from './event-feed.page';

describe('EventFeedPage', () => {
  let component: EventFeedPage;
  let fixture: ComponentFixture<EventFeedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventFeedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
