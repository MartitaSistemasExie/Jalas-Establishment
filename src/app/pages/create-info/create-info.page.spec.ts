import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateInfoPage } from './create-info.page';

describe('CreateInfoPage', () => {
  let component: CreateInfoPage;
  let fixture: ComponentFixture<CreateInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
