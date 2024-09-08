import videojs from 'video.js';

const Button = videojs.getComponent('Button');

class QualitySelector extends Button {
  controlText: any;
  constructor(player: any, options: any) {
    super(player, options);
    this.controlText('Quality');
  }

  override buildCSSClass(): string {
    return 'vjs-quality-selector-control vjs-control vjs-button';
  }

  handleClick(): void {
    const player = this.player();
    const qualityMenu = document.getElementById('qualityMenu');
    if (qualityMenu) {
      qualityMenu.classList.toggle('show');
      console.log('Quality Menu visibility toggled:', qualityMenu.classList.contains('show'));
      document.addEventListener('click', (event) => {
        if (!qualityMenu.contains(event.target as Node)) {
          qualityMenu.classList.remove('show');
        }
      });
    }
  }
  
}

videojs.registerComponent('QualitySelector', QualitySelector);
