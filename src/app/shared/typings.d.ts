declare module 'videojs-hls-quality-selector' {
    import * as videojs from 'video.js';
  
    interface QualitySelectorOptions {
      displayCurrentQuality?: boolean;
    }
  
    function hlsQualitySelector(options?: QualitySelectorOptions): void;
  
    export default hlsQualitySelector;
}
// declare module 'videojs-hls-quality-selector' {
//   const plugin: (options?: { displayCurrentQuality?: boolean }) => void;
//   export default plugin;
// }
