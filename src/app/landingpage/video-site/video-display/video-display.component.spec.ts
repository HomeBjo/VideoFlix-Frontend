import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDisplayComponent } from './video-display.component';

describe('VideoDisplayComponent', () => {
  let component: VideoDisplayComponent;
  let fixture: ComponentFixture<VideoDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
