import '../styles/game-platforms.css';

export default function GamePlatforms() {
  return (
    <ul className="game-platforms" data-game-platforms="windows,macos,linux">
      <li><img src="/assets/platforms/windows.svg" width="32" height="32" alt="" /><span>Windows<small>x86-64</small></span></li>
      <li><img src="/assets/platforms/macos.svg" width="32" height="32" alt="" /><span>macOS<small>Apple Silicon</small></span></li>
      <li><img src="/assets/platforms/linux.svg" width="32" height="32" alt="" /><span>Linux<small>x86-64</small></span></li>
    </ul>
  );
}
