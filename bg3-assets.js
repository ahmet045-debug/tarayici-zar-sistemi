window.BG3DiceAssets = (function() {

    function getCSS() {
        return `
        #tm-drag-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999990; display: none; cursor: grabbing; }
        #tm-ground-line { position: fixed; left: 0; width: 100vw; height: 2px; background: rgba(209, 48, 23, 0.6); box-shadow: 0 0 10px #d13017; display: none; z-index: 999991; pointer-events: none; transition: top 0.1s; }

        #tm-dice-scene {
            position: fixed; width: var(--d-size, 50px); height: var(--d-size, 50px);
            perspective: 800px; user-select: none; touch-action: none; pointer-events: auto;
            transition: opacity 0.6s ease-in-out; z-index: 999992;
            will-change: transform;
            --plate-offset: 0;
            --plate-depth: 1;
            transform-style: preserve-3d;
        }

        #tm-dice-mesh {
            width: 100%; height: 100%; position: relative; transform-style: preserve-3d; cursor: grab;
            will-change: transform;
        }
        #tm-dice-mesh:active { cursor: grabbing; }

        .tm-dice-face {
            position: absolute;
            box-sizing: border-box;
            font-family: 'Georgia', serif;
            font-weight: bold;
            backface-visibility: hidden;
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: border-color 0.3s, box-shadow 0.3s;
            overflow: visible;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            --active-glow: 1;
            transform-style: preserve-3d;
        }

        .tm-body-fill-layer {
            position: absolute; inset: 0;
            border-radius: 4%;
            overflow: hidden;
            z-index: 1;
            background: var(--body-fill, linear-gradient(150deg, #2c2320 0%, #16110f 100%));
            transform-style: preserve-3d;
        }

        .tm-inner-mass {
            position: absolute;
            width: calc(var(--d-size) * 0.98); height: calc(var(--d-size) * 0.98);
            border-radius: 18%;
            border: none !important; box-shadow: none !important;
            top: 1%; left: 1%;
            transform-style: preserve-3d;
        }

        .tm-dice-content {
            position: absolute; width: 100%; height: 100%;
            display: flex; justify-content: center; align-items: center; z-index: 10;
            transform-style: preserve-3d;
        }

        .face-d4 .tm-dice-content, .face-d20 .tm-dice-content {
            top: 60%; left: 50%; width: auto; height: auto; transform: translate(-50%, -50%);
        }
        .tm-dice-content.inverted {
            transform: translate(-50%, -50%) rotateZ(180deg) !important;
        }

        .face-d6 { width: var(--d-size); height: var(--d-size); }

        .face-d4, .face-d20 {
            top: var(--tri-offset-y) !important;
            left: 0;
            background: var(--body-fill, linear-gradient(150deg, #2c2320 0%, #16110f 100%));
            border: calc(var(--d-size) * 0.045) solid var(--ring-color, #8a5a3a) !important;
            box-shadow:
                0 0 calc(var(--d-size) * 0.12) var(--ring-glow, rgba(255,120,50,0.7)),
                0 0 calc(var(--d-size) * 0.24) var(--ring-glow-soft, rgba(255,90,30,0.4)),
                inset 0 0 calc(var(--d-size) * 0.10) rgba(0,0,0,0.6);
        }

        .face-d4 { width: var(--d-size); height: var(--d4-h); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); font-size: calc(var(--d-size) * 0.32); transform-origin: 50% 66.6666%; }
        .face-d20 { width: var(--d-size); height: var(--d20-h); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); font-size: calc(var(--d-size) * 0.30); transform-origin: 50% 66.6666%; }

        .tm-face-glow {
            --glow-alpha: calc(var(--glow-int, 65) / 100);
            z-index: 100;
        }

        .tm-face-glow.face-d4, .tm-face-glow.face-d20 {
            border-color: var(--ring-color, #8a5a3a) !important;
            box-shadow:
                0 0 calc(var(--d-size) * 0.20) calc(var(--glow-int, 65) * 0.06px) var(--ring-glow, rgba(255,120,50,0.9)),
                0 0 calc(var(--d-size) * 0.36) calc(var(--glow-int, 65) * 0.09px) var(--ring-glow-soft, rgba(255,90,30,0.55)),
                inset 0 0 calc(var(--d-size) * 0.12) rgba(0,0,0,0.5) !important;
            filter: brightness(calc(1 + (var(--glow-alpha) * 0.4)));
        }

        .tm-pips-container {
            display: grid;
            grid-template-areas: "a b c" "d e f" "g h i";
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            width: 100%; height: 100%; gap: 0;
            transform-style: preserve-3d;
        }

        .tm-pip {
            border-radius: 50%; position: relative;
            background: radial-gradient(circle at 38% 30%, var(--pip-hi, #ffdca0) 0%, var(--pip-mid, #ff7a3d) 42%, var(--pip-dark, #7a1e06) 100%);
            box-shadow: inset -1px -1px 2px rgba(0,0,0,0.5), inset 1px 1px 2px rgba(255,255,255,0.3);
        }

        .tm-compact-pips {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: calc(var(--d-size) * 0.018);
            width: calc(var(--d-size) * 0.42);
            max-width: 100%;
            transform-style: preserve-3d;
        }
        .face-d4 .tm-compact-pips, .face-d20 .tm-compact-pips {
            width: calc(var(--d-size) * 0.30);
            gap: calc(var(--d-size) * 0.010);
        }
        .tm-compact-pip {
            width: calc(var(--d-size) * 0.045);
            height: calc(var(--d-size) * 0.045);
            border-radius: 50%;
            place-self: center;
            background: radial-gradient(circle at 38% 30%, var(--pip-hi, #ffdca0) 0%, var(--pip-mid, #ff7a3d) 44%, var(--pip-dark, #7a1e06) 100%);
            box-shadow: 0 0 calc(var(--d-size) * 0.035) var(--pip-glow, rgba(255,140,50,0.7)), inset -1px -1px 2px rgba(0,0,0,0.55);
        }
        .tm-style-skull-mark {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: calc(var(--d-size) * 0.32);
            min-height: calc(var(--d-size) * 0.32);
        }
        .tm-style-skull-mark .tm-skull-icon {
            position: absolute;
            width: 135%;
            height: 135%;
            opacity: 0.28;
            filter: drop-shadow(0 0 calc(var(--d-size) * 0.08) var(--num-glow, rgba(255,110,40,0.95)));
        }
        .tm-style-skull-mark .tm-number-glow {
            position: relative;
            z-index: 2;
        }

        .tm-face-ring {
            position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; z-index: 20;
            transform-style: preserve-3d;
        }
        .face-d6 .tm-face-ring { width: 78%; height: 78%; }
        .face-d6 .tm-face-ring.tm-ring-horned-skull { width: 130%; height: 130%; }

        .tm-number-glow {
            font-family: 'Georgia', serif; font-weight: bold; font-size: calc(var(--d-size) * 0.5); line-height: 1;
            color: var(--num-color, #ffb27a); z-index: 10; pointer-events: none;
        }
        .face-d4 .tm-number-glow, .face-d20 .tm-number-glow { font-size: calc(var(--d-size) * 0.36); }

        .tm-skull-icon { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none; transform-style: preserve-3d; }
        .tm-skull-icon svg { width: 92%; height: 92%; }
        .tm-skull-icon.horned-skull svg { width: 100%; height: 100%; }
        .tm-skull-icon svg .skull-fill { fill: var(--num-color, #ffb27a); }
        .tm-skull-icon svg .skull-dark { fill: rgba(0,0,0,0.55); }

        .tm-skull-pip {
            width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;
            transform-style: preserve-3d;
        }

        .tm-face-body {
            width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;
            transform-style: preserve-3d;
        }

        .tm-corner-plate {
            position: absolute; width: 28%; height: 28%; pointer-events: none; z-index: 16; overflow: visible;
            --p-off: calc(var(--plate-offset, 0) * 1%);
            transform: translateZ(calc(var(--plate-depth, 1) * var(--d-scale, 1) * 1px));
            transform-style: preserve-3d;
        }
        .tm-corner-plate svg { width: 100%; height: 100%; display: block; overflow: visible; }
        .tm-corner-plate .plate-fill { fill: var(--plate-fill-solid, #4a3a2c); }
        .tm-corner-plate .plate-edge { stroke: var(--ring-color, #8a5a3a); stroke-width: 5; stroke-linecap: round; }

        .tm-corner-plate.tl { top: var(--p-off); left: var(--p-off); }
        .tm-corner-plate.tr { top: var(--p-off); right: var(--p-off); }
        .tm-corner-plate.bl { bottom: var(--p-off); left: var(--p-off); }
        .tm-corner-plate.br { bottom: var(--p-off); right: var(--p-off); }

        .tm-face-glow .tm-corner-plate .plate-fill { fill: var(--ring-color, #8a5a3a) !important; }
        .tm-face-glow .tm-skull-icon svg .skull-fill { fill: #ffffff !important; }

        #tm-dice-menu {
            position: fixed; background: rgba(17, 10, 8, 0.95); backdrop-filter: blur(8px); border: 2px solid #855c34;
            border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.9); display: none; flex-direction: column; width: 280px;
            pointer-events: auto; z-index: 999995; overflow: visible;
        }

        #tm-menu-drag-handle {
            position: absolute; top: 10px; left: -26px; width: 24px; height: 40px;
            background: rgba(28, 17, 15, 0.95); color: #855c34; font-size: 14px;
            text-align: center; cursor: move; border-bottom-left-radius: 6px; border-top-left-radius: 6px;
            border: 2px solid #855c34; border-right: none;
            user-select: none; display: flex; justify-content: center; align-items: center; z-index: 20;
            backdrop-filter: blur(8px);
        }
        #tm-menu-drag-handle:hover { color: #d4b886; background: #2b1b18; }

        .tm-menu-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; font-family: 'Georgia', serif; max-height: 80vh; overflow-y: auto; }
        .tm-menu-body::-webkit-scrollbar { width: 4px; }
        .tm-menu-body::-webkit-scrollbar-thumb { background: #855c34; border-radius: 2px; }

        .tm-menu-section { display: flex; flex-direction: column; gap: 6px; }
        .tm-menu-btn {
            flex: 1; background: linear-gradient(to bottom, #2b1b18, #1c110f); border: 1px solid #a88b5e; color: #fce2a6; padding: 6px;
            cursor: pointer; font-weight: bold; font-size: 12px; border-radius: 4px; text-align: center; transition: all 0.2s;
            display: flex; justify-content: center; align-items: center;
        }
        .tm-menu-btn:hover { background: #422b26; color: #fff; }

        .tm-select { width: 100%; background: #1c110f; color: #fce2a6; border: 1px solid #a88b5e; padding: 6px; border-radius: 4px; font-family: inherit; font-size: 12px; font-weight: bold; outline: none; cursor: pointer; box-sizing: border-box; }
        .tm-select:hover { border-color: #d4b886; }
        .tm-select option { font-weight: bold; }

        .tm-select optgroup { font-style: italic; font-weight: normal; color: #a88b5e; background: #150c0a; }
        .tm-select optgroup option { font-style: normal; color: #fce2a6; }

        .tm-slider { -webkit-appearance: none; width: 100%; height: 5px; background: #2b1b18; outline: none; border: 1px solid #4a3227; border-radius: 3px; margin: 0; }
        .tm-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #a88b5e; cursor: pointer; box-shadow: 0 0 4px rgba(0,0,0,0.8); transition: background 0.1s; }
        .tm-slider::-webkit-slider-thumb:hover { background: #fce2a6; }

        .tm-val-label { color: #fce2a6; font-size: 10px; width: 28px; text-align: right; font-weight: bold; display: inline-block; background: #2b1b18; padding: 2px 4px; border-radius: 3px; border: 1px solid #4a3227; }

        #tm-save-btn { background: #1f3b23; border-color: #3b7a46; color: #a8e0b3; }
        #tm-save-btn:hover { background: #2c5432; }

        #tm-presets-list { display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px; margin-top: 2px; justify-content: center; }
        .tm-preset-item { display: flex; align-items: center; background: #1c110f; border: 1px solid #a88b5e; border-radius: 4px; color: #fce2a6; width: 30px; height: 30px; position: relative; }
        .tm-preset-name { cursor: pointer; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; }
        .tm-preset-name:hover { color: #fff; background: #422b26; border-radius: 4px; }
        .tm-preset-del { position: absolute; top: -5px; right: -5px; background: #d13017; color: #fff; font-size: 9px; font-weight: bold; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; border: 1px solid #1a100d; box-shadow: 0 0 3px rgba(0,0,0,0.5); }
        .tm-preset-del:hover { background: #ff5555; }

        #tm-custom-dialog {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 10, 8, 0.95); backdrop-filter: blur(4px);
            display: none; flex-direction: column; justify-content: center; align-items: center; padding: 15px; box-sizing: border-box; text-align: center; z-index: 30; border-radius: 8px;
        }
        #tm-dialog-msg { color: #fce2a6; font-size: 13px; font-weight: bold; margin-bottom: 12px; line-height: 1.4; }
        #tm-dialog-ok, #tm-dialog-cancel { width: 90%; padding: 6px; margin-bottom: 6px; border-radius: 4px; cursor: pointer; font-weight: bold; border: 1px solid; font-size: 12px; }
        #tm-dialog-ok { background: #1f3b23; border-color: #3b7a46; color: #a8e0b3; }
        #tm-dialog-ok:hover { background: #2c5432; }
        #tm-dialog-cancel { background: #3a110e; border-color: #8a2a22; color: #fca49d; }
        #tm-dialog-cancel:hover { background: #521814; }

        /* ================= TEMA RENK PALETLERI ================= */
        .tm-theme-obsidian {
            --body-fill: linear-gradient(150deg, #3a3632 0%, #16130f 100%);
            --plate-fill-solid: #4a4038;
            --ring-color: #b8935c;
            --ring-glow: rgba(230,180,110,0.55); --ring-glow-soft: rgba(230,180,110,0.28);
            --num-color: #f0d6a8; --num-glow: rgba(230,180,110,0.9); --num-glow-soft: rgba(200,150,80,0.5);
            --pip-hi: #fff0d4; --pip-mid: #d9a860; --pip-dark: #5c4420; --pip-glow: rgba(230,180,110,0.6);
        }
        .tm-theme-blood {
            --body-fill: linear-gradient(150deg, #3d1210 0%, #150404 100%);
            --plate-fill-solid: #501510;
            --ring-color: #c23020;
            --ring-glow: rgba(255,40,30,0.6); --ring-glow-soft: rgba(255,40,30,0.3);
            --num-color: #ffb0a8; --num-glow: rgba(255,40,30,0.95); --num-glow-soft: rgba(200,20,10,0.55);
            --pip-hi: #ffcfc8; --pip-mid: #e83a28; --pip-dark: #5c0a04; --pip-glow: rgba(255,40,30,0.65);
        }
        .tm-theme-void {
            --body-fill: linear-gradient(150deg, #2c1440 0%, #0c0614 100%);
            --plate-fill-solid: #3a1c54;
            --ring-color: #9d4edd;
            --ring-glow: rgba(180,90,240,0.6); --ring-glow-soft: rgba(180,90,240,0.3);
            --num-color: #e0b8ff; --num-glow: rgba(180,90,240,0.95); --num-glow-soft: rgba(140,60,200,0.5);
            --pip-hi: #f0d8ff; --pip-mid: #a855f7; --pip-dark: #3a1058; --pip-glow: rgba(180,90,240,0.65);
        }
        .tm-theme-celestial {
            --body-fill: linear-gradient(150deg, #d9c68a 0%, #7a5f22 100%);
            --plate-fill-solid: #c9b06a;
            --ring-color: #fff6db;
            --ring-glow: rgba(255,240,180,0.85); --ring-glow-soft: rgba(255,230,150,0.5);
            --num-color: #4a3308; --num-glow: rgba(255,255,255,0.9); --num-glow-soft: rgba(255,220,140,0.6);
            --pip-hi: #ffffff; --pip-mid: #ffe9a8; --pip-dark: #b8934a; --pip-glow: rgba(255,240,180,0.8);
        }
        .tm-theme-toxic {
            --body-fill: linear-gradient(150deg, #16350a 0%, #071206 100%);
            --plate-fill-solid: #1c4014;
            --ring-color: #39ff14;
            --ring-glow: rgba(70,255,30,0.6); --ring-glow-soft: rgba(70,255,30,0.3);
            --num-color: #baffa8; --num-glow: rgba(70,255,30,0.95); --num-glow-soft: rgba(40,200,10,0.5);
            --pip-hi: #ddffcf; --pip-mid: #5cff2e; --pip-dark: #124a08; --pip-glow: rgba(70,255,30,0.65);
        }
        .tm-theme-lava {
            --body-fill: linear-gradient(150deg, #4a1408 0%, #180402 100%);
            --plate-fill-solid: #6e2410;
            --ring-color: #ff8a3d;
            --ring-glow: rgba(255,140,50,0.7); --ring-glow-soft: rgba(255,90,20,0.35);
            --num-color: #ffe0b0; --num-glow: rgba(255,150,50,1); --num-glow-soft: rgba(255,80,10,0.6);
            --pip-hi: #fff2d0; --pip-mid: #ff8a30; --pip-dark: #7a2404; --pip-glow: rgba(255,140,50,0.75);
        }
        .tm-theme-bonelegend {
            --body-fill: linear-gradient(150deg, #322722 0%, #14100d 100%);
            --plate-fill-solid: #4a3226;
            --ring-color: #b8500f;
            --ring-glow: rgba(255,110,40,0.65); --ring-glow-soft: rgba(255,80,20,0.32);
            --num-color: #ffb27a; --num-glow: rgba(255,110,40,0.95); --num-glow-soft: rgba(255,70,10,0.55);
            --pip-hi: #ffd9a8; --pip-mid: #ff7a28; --pip-dark: #6e2a08; --pip-glow: rgba(255,110,40,0.7);
        }

        .tm-type-d6-aetherglass {
            --body-fill:
                radial-gradient(circle at 28% 18%, rgba(117,255,244,0.24), transparent 30%),
                radial-gradient(circle at 78% 82%, rgba(214,146,74,0.18), transparent 32%),
                linear-gradient(150deg, #142a2d 0%, #071114 58%, #180d0b 100%);
            --plate-fill-solid: #123136;
            --ring-color: #d6924a;
            --ring-glow: rgba(95,248,236,0.72); --ring-glow-soft: rgba(95,248,236,0.34);
            --num-color: #7dfff4; --num-glow: rgba(95,248,236,0.98); --num-glow-soft: rgba(214,146,74,0.52);
            --pip-hi: #effffd; --pip-mid: #5ff8ec; --pip-dark: #07545d; --pip-glow: rgba(95,248,236,0.78);
            --aether-pip-hi: #effffd; --aether-pip-mid: #98fff7; --aether-pip-core: #36ddcf; --aether-pip-dark: #0a6068;
        }
        .tm-type-d6-aetherglass.tm-theme-lava {
            --ring-color: #ff9a3d; --ring-glow: rgba(255,120,40,0.74); --ring-glow-soft: rgba(255,80,20,0.34);
            --num-color: #ffe0b0; --num-glow: rgba(255,140,50,0.95); --num-glow-soft: rgba(255,70,20,0.50);
            --pip-hi: #fff2d0; --pip-mid: #ff8a30; --pip-dark: #7a2404; --pip-glow: rgba(255,140,50,0.75);
            --aether-pip-hi: #fff2d0; --aether-pip-mid: #ffb45c; --aether-pip-core: #ff6a21; --aether-pip-dark: #7a2404;
        }
        .tm-type-d6-aetherglass.tm-theme-blood {
            --ring-color: #d83a2a; --ring-glow: rgba(255,50,40,0.72); --ring-glow-soft: rgba(180,20,20,0.34);
            --num-color: #ffbbb3; --num-glow: rgba(255,50,40,0.95); --num-glow-soft: rgba(180,20,20,0.52);
            --pip-hi: #ffe0dc; --pip-mid: #ff4b3d; --pip-dark: #6b0804; --pip-glow: rgba(255,50,40,0.72);
            --aether-pip-hi: #ffe0dc; --aether-pip-mid: #ff8a80; --aether-pip-core: #e9251b; --aether-pip-dark: #6b0804;
        }
        .tm-type-d6-aetherglass.tm-theme-void {
            --ring-color: #9d4edd; --ring-glow: rgba(180,90,240,0.72); --ring-glow-soft: rgba(120,40,190,0.34);
            --num-color: #e0b8ff; --num-glow: rgba(180,90,240,0.96); --num-glow-soft: rgba(120,40,190,0.52);
            --pip-hi: #f0d8ff; --pip-mid: #a855f7; --pip-dark: #3a1058; --pip-glow: rgba(180,90,240,0.70);
            --aether-pip-hi: #f0d8ff; --aether-pip-mid: #c084fc; --aether-pip-core: #8b3ddb; --aether-pip-dark: #3a1058;
        }
        .tm-type-d6-aetherglass.tm-theme-toxic {
            --ring-color: #39ff14; --ring-glow: rgba(70,255,30,0.72); --ring-glow-soft: rgba(40,200,10,0.34);
            --num-color: #baffa8; --num-glow: rgba(70,255,30,0.95); --num-glow-soft: rgba(40,200,10,0.52);
            --pip-hi: #ddffcf; --pip-mid: #5cff2e; --pip-dark: #124a08; --pip-glow: rgba(70,255,30,0.70);
            --aether-pip-hi: #ddffcf; --aether-pip-mid: #9cff80; --aether-pip-core: #45e91f; --aether-pip-dark: #124a08;
        }
        .tm-type-d6-aetherglass.tm-theme-celestial {
            --ring-color: #fff6db; --ring-glow: rgba(255,240,180,0.86); --ring-glow-soft: rgba(255,220,140,0.48);
            --num-color: #fff8df; --num-glow: rgba(255,245,200,0.98); --num-glow-soft: rgba(255,220,140,0.58);
            --pip-hi: #ffffff; --pip-mid: #ffe9a8; --pip-dark: #b8934a; --pip-glow: rgba(255,240,180,0.80);
            --aether-pip-hi: #ffffff; --aether-pip-mid: #fff0ba; --aether-pip-core: #e6c463; --aether-pip-dark: #8f6f2a;
        }

        .tm-type-d6-aetherglass .face-d6 {
            clip-path: polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%);
            border-color: rgba(214,146,74,0.82);
            box-shadow:
                0 0 calc(var(--d-size) * 0.16) rgba(95,248,236,0.34),
                inset 0 0 calc(var(--d-size) * 0.18) rgba(0,0,0,0.74),
                inset 0 0 calc(var(--d-size) * 0.06) rgba(95,248,236,0.28);
        }
        .tm-type-d6-aetherglass .tm-body-fill-layer {
            clip-path: polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%);
            border-radius: 0;
        }
        .tm-type-d6-aetherglass .tm-body-fill-layer::before {
            content: ""; position: absolute; inset: 8%; clip-path: inherit;
            border: calc(var(--d-size) * 0.014) solid rgba(95,248,236,0.28);
            box-shadow: inset 0 0 calc(var(--d-size) * 0.08) rgba(95,248,236,0.18);
        }
        .tm-type-d6-aetherglass .tm-body-fill-layer::after {
            content: ""; position: absolute; inset: 0;
            background: linear-gradient(115deg, transparent 0 22%, rgba(255,255,255,0.10) 25%, transparent 33%), repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 12px);
            opacity: 0.72; mix-blend-mode: screen;
        }
        .tm-type-d6-aetherglass .tm-face-ring.tm-ring-aetherglass { width: 82%; height: 82%; }

        /* ================= Kova Tasarımı (SADECE ANA ZAR İÇİN DEĞİŞKENLERİ EZER) ================= */
        .tm-type-d6-trashcan > .tm-dice-face,
        .tm-type-d6-trashcan > .tm-trash-inner-wall {
            --trash-body: linear-gradient(100deg, #565f5a 0%, #3c433f 38%, #2a302c 72%, #1c211e 100%);
            --trash-edge: #7c877e;
            --trash-slot: #0b0e0c;
            --body-fill: var(--trash-body);
            --ring-color: var(--trash-edge);
            --num-color: var(--trash-slot);
        }

        .tm-type-d6-trashcan {
            --trash-body-rust: radial-gradient(circle at 22% 78%, rgba(150,88,42,0.35), transparent 40%), radial-gradient(circle at 82% 20%, rgba(120,70,35,0.22), transparent 36%);
            --trash-edge-dark: #23281f;
            --trash-lid: linear-gradient(155deg, #7c8880 0%, #545e57 45%, #363e38 100%);
            --trash-lid-rim: #a3aea5;
            --trash-lid-hi: #9aa89f;
            --trash-lid-mid: #566056;
            --trash-lid-low: #262b26;
            --trash-lid-wall-top: #454e48;
            --trash-lid-wall-bot: #181c19;
            --trash-lid-socket: #10130f;
            --trash-paper-hi: #d8d2c2;
            --trash-paper-mid: #a8a091;
            --trash-paper-low: #6e6858;
            --trash-rivet: #8a958c;
            --trash-rivet-dark: #363e38;
            --trash-glow: rgba(140,220,150,0.55);
        }

        .tm-type-d6-trashcan > .face-d6 {
            border-radius: 10%;
            border-color: var(--trash-edge-dark) !important;
            box-shadow: 0 0 calc(var(--d-size) * 0.08) rgba(0,0,0,0.5), inset 0 0 calc(var(--d-size) * 0.16) rgba(0,0,0,0.55), inset 0 calc(var(--d-size) * 0.03) 0 rgba(255,255,255,0.05);
        }
        .tm-type-d6-trashcan > .face-d6 .tm-body-fill-layer {
            border-radius: 8%; background: var(--trash-body-rust), var(--body-fill);
        }
        .tm-type-d6-trashcan > .face-d6 .tm-body-fill-layer::before {
            content: ""; position: absolute; inset: 0; border-radius: inherit;
            background: repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) calc(var(--d-size) * 0.02), transparent calc(var(--d-size) * 0.02), transparent calc(var(--d-size) * 0.12), rgba(0,0,0,0.18) calc(var(--d-size) * 0.12), rgba(0,0,0,0.18) calc(var(--d-size) * 0.14), transparent calc(var(--d-size) * 0.14), transparent calc(var(--d-size) * 0.24));
            opacity: 0.85;
        }
        .tm-type-d6-trashcan > .face-d6 .tm-body-fill-layer::after {
            content: ""; position: absolute; inset: 0; border-radius: inherit;
            background: linear-gradient(115deg, rgba(255,255,255,0.08) 0 12%, transparent 20%);
            mix-blend-mode: screen; opacity: 0.6;
        }

        .tm-trash-rivet {
            position: absolute; width: calc(var(--d-size) * 0.055); height: calc(var(--d-size) * 0.055);
            border-radius: 50%; background: radial-gradient(circle at 35% 30%, var(--trash-rivet) 0%, var(--trash-rivet-dark) 100%);
            box-shadow: inset 0 0 calc(var(--d-size) * 0.015) rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.4); z-index: 17;
        }
        .tm-trash-rivet.rv-tl { top: 8%; left: 8%; } .tm-trash-rivet.rv-tr { top: 8%; right: 8%; }
        .tm-trash-rivet.rv-bl { bottom: 8%; left: 8%; } .tm-trash-rivet.rv-br { bottom: 8%; right: 8%; }

        .tm-trash-face-body { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
        .tm-trash-face-body::before {
            content: ""; position: absolute; inset: 0; z-index: 4; pointer-events: none; border-radius: inherit;
            background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%);
            box-shadow: inset 0 0 calc(var(--d-size) * 0.22) rgba(0,0,0,0.65);
        }
        .tm-trash-stain {
            position: absolute; width: 46%; height: 46%; border-radius: 45% 55% 48% 52% / 55% 45% 55% 45%;
            background: radial-gradient(circle at 40% 35%, rgba(90,60,30,0.30) 0%, rgba(50,35,20,0.16) 55%, transparent 80%);
            filter: blur(calc(var(--d-size) * 0.006)); z-index: 5;
        }

        .tm-trash-edge-shadow { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 6; pointer-events: none; }

        .tm-type-d6-trashcan .face-d6.tm-trash-lid-face {
            background: var(--trash-lid-socket, #141815); border-color: var(--trash-edge-dark) !important;
            box-shadow: inset 0 0 calc(var(--d-size) * 0.14) rgba(0,0,0,0.85), inset 0 calc(var(--d-size) * 0.02) calc(var(--d-size) * 0.03) rgba(0,0,0,0.6) !important;
            overflow: visible;
        }
        .tm-trash-lid-body { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; transform-style: preserve-3d; perspective: calc(var(--d-size) * 4); }

        .tm-trash-lid-collar { position: absolute; width: calc(88% * var(--lid-width, 1)); height: calc(88% * var(--lid-height, 1)); border-radius: 10%; transform: translateZ(calc(var(--d-scale, 1) * var(--lid-depth, 1) * 3px)); background: linear-gradient(135deg, var(--trash-lid-wall-top, #454e48) 0%, var(--trash-lid-wall-bot, #181c19) 45%, var(--trash-lid-wall-top, #454e48) 55%, var(--trash-lid-wall-bot, #181c19) 100%); box-shadow: 0 calc(var(--d-size) * 0.02) calc(var(--d-size) * 0.03) rgba(0,0,0,0.55), inset 0 0 calc(var(--d-size) * 0.02) rgba(0,0,0,0.4); }
        .tm-trash-lid-cap { position: absolute; width: calc(70% * var(--lid-width, 1)); height: calc(70% * var(--lid-height, 1)); border-radius: 8%; transform: translateZ(calc(var(--d-scale, 1) * var(--lid-depth, 1) * 9px)); background: radial-gradient(circle at 30% 24%, rgba(255,255,255,0.42) 0%, transparent 42%), radial-gradient(circle at 72% 78%, rgba(0,0,0,0.30) 0%, transparent 55%), linear-gradient(160deg, var(--trash-lid-hi, #8c988f) 0%, var(--trash-lid-mid, #56615a) 55%, var(--trash-lid-low, #313832) 100%); box-shadow: 0 0 0 calc(var(--d-size) * 0.012) var(--trash-lid-rim), 0 calc(var(--d-size) * 0.05) calc(var(--d-size) * 0.09) rgba(0,0,0,0.6), inset 0 calc(var(--d-size) * 0.04) calc(var(--d-size) * 0.05) rgba(255,255,255,0.25), inset 0 calc(var(--d-size) * -0.05) calc(var(--d-size) * 0.06) rgba(0,0,0,0.5); }
        .tm-trash-lid-knob { position: absolute; width: calc(24% * var(--lid-width, 1)); height: calc(24% * var(--lid-height, 1)); border-radius: 15%; transform: translateZ(calc(var(--d-scale, 1) * var(--lid-depth, 1) * 13px)) rotate(45deg); background: radial-gradient(circle at 32% 26%, rgba(255,255,255,0.55) 0%, transparent 45%), linear-gradient(160deg, var(--trash-lid-hi, #9aa89f) 0%, var(--trash-lid-low, #262b26) 100%); box-shadow: 0 calc(var(--d-size) * 0.02) calc(var(--d-size) * 0.03) rgba(0,0,0,0.6), inset 0 calc(var(--d-size) * 0.015) calc(var(--d-size) * 0.02) rgba(255,255,255,0.3); }

        .tm-trash-lid-tier { position: absolute; left: 50%; top: 50%; display: block; transform-style: preserve-3d; transform-origin: center; pointer-events: none; background: none; box-shadow: none; }
        .tm-trash-lid-collar { width: var(--lid-collar-w); height: var(--lid-collar-h); --tier-depth: var(--lid-collar-thickness); --tier-half: var(--lid-collar-half); transform: translate(-50%, -50%) translateZ(var(--lid-collar-z)); }
        .tm-trash-lid-cap { width: var(--lid-cap-w); height: var(--lid-cap-h); --tier-depth: var(--lid-cap-thickness); --tier-half: var(--lid-cap-half); transform: translate(-50%, -50%) translateZ(var(--lid-cap-z)); }
        .tm-trash-lid-knob { width: var(--lid-knob-w); height: var(--lid-knob-h); --tier-depth: var(--lid-knob-thickness); --tier-half: var(--lid-knob-half); transform: translate(-50%, -50%) translateZ(var(--lid-knob-z)) rotateZ(45deg); }

        .tm-lid-top, .tm-lid-side { position: absolute; display: block; box-sizing: border-box; backface-visibility: hidden; }
        .tm-lid-top { inset: 0; transform: translateZ(var(--tier-half)); border: 1px solid rgba(182,198,185,0.48); box-shadow: inset 0 calc(var(--d-size) * 0.035) calc(var(--d-size) * 0.05) rgba(255,255,255,0.22), inset 0 calc(var(--d-size) * -0.05) calc(var(--d-size) * 0.07) rgba(0,0,0,0.58); }
        .tm-lid-side { background: linear-gradient(180deg, var(--trash-lid-wall-top, #555f58), var(--trash-lid-wall-bot, #171c18)); border: 1px solid rgba(0,0,0,0.52); }
        .tm-lid-side-front, .tm-lid-side-back { left: 0; width: 100%; height: var(--tier-depth); }
        .tm-lid-side-front { top: 100%; transform-origin: top center; transform: rotateX(-90deg) translateZ(var(--tier-half)); }
        .tm-lid-side-back { bottom: 100%; transform-origin: bottom center; transform: rotateX(90deg) translateZ(var(--tier-half)); }
        .tm-lid-side-left, .tm-lid-side-right { top: 0; height: 100%; width: var(--tier-depth); }
        .tm-lid-side-left { left: 0; transform-origin: left center; transform: rotateY(-90deg) translateZ(var(--tier-half)); }
        .tm-lid-side-right { right: 0; transform-origin: right center; transform: rotateY(90deg) translateZ(var(--tier-half)); }

        .tm-trash-lid-collar .tm-lid-top { border-radius: 8%; background: linear-gradient(145deg, #68746b, #2f3933 55%, #1a201c); box-shadow: 0 calc(var(--d-size) * 0.045) calc(var(--d-size) * 0.09) rgba(0,0,0,0.72), inset 0 0 calc(var(--d-size) * 0.03) rgba(0,0,0,0.48); }
        .tm-trash-lid-cap .tm-lid-top { border-radius: 7%; background: radial-gradient(circle at 30% 24%, rgba(255,255,255,0.46) 0%, transparent 42%), radial-gradient(circle at 72% 78%, rgba(0,0,0,0.35) 0%, transparent 55%), linear-gradient(160deg, var(--trash-lid-hi, #8c988f) 0%, var(--trash-lid-mid, #56615a) 55%, var(--trash-lid-low, #313832) 100%); box-shadow: 0 0 0 calc(var(--d-size) * 0.014) var(--trash-lid-rim), 0 calc(var(--d-size) * 0.07) calc(var(--d-size) * 0.12) rgba(0,0,0,0.72), inset 0 0 calc(var(--d-size) * 0.04) rgba(255,255,255,0.16); }
        .tm-trash-lid-knob .tm-lid-top { border-radius: 10%; background: radial-gradient(circle at 32% 26%, rgba(255,255,255,0.6) 0%, transparent 45%), linear-gradient(160deg, #b0bbb2, var(--trash-lid-low, #262b26)); box-shadow: 0 calc(var(--d-size) * 0.035) calc(var(--d-size) * 0.055) rgba(0,0,0,0.76), inset 0 0 calc(var(--d-size) * 0.025) rgba(255,255,255,0.24); }

        .tm-trash-inner-wall { position: absolute; width: var(--d-size); height: var(--d-size); box-sizing: border-box; backface-visibility: hidden; }
        .tm-trash-inner-wall .tm-body-fill-layer { border-radius: 6%; }

        /* --- KÜÇÜK ZARLAR İÇİN DİNAMİK SARICI CSS --- */
        .tm-mini-dice-wrap {
            position: absolute;
            width: var(--d-size); height: var(--d-size);
            left: calc(50% - var(--d-size) / 2); top: calc(50% - var(--d-size) / 2);
            transform-style: preserve-3d;
            pointer-events: none;
        }

        .tm-type-d6-trashcan > .tm-face-glow.face-d6 {
            border-color: var(--trash-glow) !important;
            box-shadow: 0 0 calc(var(--d-size) * 0.18) calc(var(--glow-int, 65) * 0.05px) var(--trash-glow), inset 0 0 calc(var(--d-size) * 0.14) rgba(140,220,150,0.28) !important;
            filter: brightness(1.12);
        }
        `;
    }

    function getMenuHTML() {
        return `
        <div id="tm-menu-drag-handle" title="Sürüklemek İçin Tutun">⠿</div>

        <div class="tm-menu-body">

            <div class="tm-menu-section">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 2px;">ZAR TURU</div>
                <select class="tm-select" id="tm-shape-select" style="width: 100%;">
                    <option value="D6">D6 - Kup Zar</option>
                    <option value="D4">D4 - Piramit Zar</option>
                    <option value="D20">D20 - Kritik Zar</option>
                </select>
            </div>

            <div class="tm-menu-section">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 2px;">YUZ STILI</div>
                <select class="tm-select" id="tm-face-style-select" style="width: 100%;">
                    <option value="skull">Kurukafa Nokta</option>
                </select>
            </div>

            <div class="tm-menu-section" style="margin-top: 4px;">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 2px;">ZAR BOYUTU</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;">Büyüklük</span>
                    <input type="range" class="tm-slider" id="tm-size-slider" min="20" max="150" value="50" step="1" style="flex: 1;">
                    <span id="tm-size-val" class="tm-val-label" style="background:transparent; border:none;">50px</span>
                </div>
            </div>

            <div class="tm-menu-section tm-skel-settings" style="margin-top: 4px; padding: 4px; border: 1px solid #4a3227; background: #150c0a; border-radius: 4px;">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 4px; text-align:center;">GÖRSEL DETAY AYARLARI</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Noktaların Büyüklüğü">Pip Boyut</span>
                    <input type="range" class="tm-slider" id="tm-pip-scale-slider" min="50" max="350" value="220" step="5" style="flex: 1;">
                    <span id="tm-pip-scale-val" class="tm-val-label">220</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Merkezden Kenarlara Uzaklık">Yayılım</span>
                    <input type="range" class="tm-slider" id="tm-pip-spread-slider" min="40" max="100" value="90" step="1" style="flex: 1;">
                    <span id="tm-pip-spread-val" class="tm-val-label">90</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Köşe zırhlarının içeri/dışarı mesafesi (0 merkeze kilitler)">Zırh Yeri</span>
                    <input type="range" class="tm-slider" id="tm-plate-offset-slider" min="-15" max="25" value="0" step="1" style="flex: 1;">
                    <span id="tm-plate-offset-val" class="tm-val-label">0</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Köşe zırhlarının 3D derinliği (İleri/Geri)">Zırh Derin</span>
                    <input type="range" class="tm-slider" id="tm-plate-depth-slider" min="-20" max="50" value="1" step="1" style="flex: 1;">
                    <span id="tm-plate-depth-val" class="tm-val-label">1</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Köşe zırhlarını bu yüz stili için tamamen aç/kapat">Zırhlar</span>
                    <div class="tm-menu-btn" id="tm-plates-toggle-btn" style="flex: 1; padding: 4px;">Açık</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-slot-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Yarık deliklerin büyüklüğü">Yarık Boy</span>
                    <input type="range" class="tm-slider" id="tm-slot-scale-slider" min="50" max="350" value="220" step="5" style="flex: 1;">
                    <span id="tm-slot-scale-val" class="tm-val-label">220</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-slot-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Yarık deliklerin merkezden yayılımı">Yarık Yayılım</span>
                    <input type="range" class="tm-slider" id="tm-slot-spread-slider" min="40" max="100" value="90" step="1" style="flex: 1;">
                    <span id="tm-slot-spread-val" class="tm-val-label">90</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;" class="tm-lid-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Kapağın genişliği (sadece kapak, gövdeyi etkilemez)">Kapak Gen</span>
                    <input type="range" class="tm-slider" id="tm-lid-width-slider" min="40" max="200" value="100" step="5" style="flex: 1;">
                    <span id="tm-lid-width-val" class="tm-val-label">100</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-lid-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Kapağın yüksekliği (sadece kapak, gövdeyi etkilemez)">Kapak Yük</span>
                    <input type="range" class="tm-slider" id="tm-lid-height-slider" min="40" max="200" value="100" step="5" style="flex: 1;">
                    <span id="tm-lid-height-val" class="tm-val-label">100</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-lid-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Kapağın kalınlığı / öne çıkma derinliği (sadece kapak, gövdeyi etkilemez)">Kapak Kalın</span>
                    <input type="range" class="tm-slider" id="tm-lid-depth-slider" min="0" max="250" value="100" step="5" style="flex: 1;">
                    <span id="tm-lid-depth-val" class="tm-val-label">100</span>
                </div>
                <div class="tm-mini-dice-row" style="margin: 8px 0 3px; padding-top: 5px; border-top: 1px solid rgba(168,139,94,0.28); color: #a88b5e; font-size: 9px; font-weight: bold; text-align:center;">KOVA İÇİ ZAR FİZİĞİ</div>

                <!-- KUCUK ZAR EKLEME MENUSU -->
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-mini-dice-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Kova içine yeni bir zar atın">Zar Ekle</span>
                    <select class="tm-select" id="tm-mini-dice-add-select" style="flex: 1; padding: 4px;">
                        <optgroup label="D6 - Küp Zar">
                            <option value="D6_dots">Düz Nokta</option>
                            <option value="D6_numbers">Sayı</option>
                            <option value="D6_skull">Kurukafa Nokta</option>
                            <option value="D6_aetherglass">Aetherglass Rune</option>
                        </optgroup>
                        <optgroup label="D4 - Piramit Zar">
                            <option value="D4_numbers">Sayı</option>
                            <option value="D4_dots">Düz Nokta</option>
                            <option value="D4_skull">Kurukafa İşaret</option>
                        </optgroup>
                        <optgroup label="D20 - Kritik Zar">
                            <option value="D20_numbers">Sayı</option>
                            <option value="D20_dots">Düz Nokta</option>
                            <option value="D20_skull">Kurukafa İşaret</option>
                        </optgroup>
                    </select>
                    <div class="tm-menu-btn" id="tm-mini-dice-add-btn" style="flex: 0 0 30px; padding: 4px;" title="Seçilen zarı sepete ekle">+</div>
                </div>

                <div id="tm-mini-dice-list" class="tm-mini-dice-row" style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; padding: 4px; background: #1a100d; border: 1px inset #4a3227; border-radius: 4px; min-height: 24px;">
                    <!-- Eklenen zarlar buraya gelecek -->
                </div>
                <!-- ============================= -->

                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-mini-dice-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Kova içindeki küçük zarların boyutu (% olarak)">İç Zar Boyutu</span>
                    <input type="range" class="tm-slider" id="tm-mini-dice-scale-slider" min="5" max="40" value="16" step="1" style="flex: 1;">
                    <span id="tm-mini-dice-scale-val" class="tm-val-label">16</span>
                </div>

                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-mini-dice-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Kutu hareket ederken küçük zarların başlangıç ve çarpışma hızı">İç Zar Hız</span>
                    <input type="range" class="tm-slider" id="tm-mini-dice-speed-slider" min="50" max="320" value="190" step="5" style="flex: 1;">
                    <span id="tm-mini-dice-speed-val" class="tm-val-label">190</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-mini-dice-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="İç duvarlara ve diğer küçük zarlara çarptıktan sonra ne kadar sekeceği">İç Zar Sek</span>
                    <input type="range" class="tm-slider" id="tm-mini-dice-bounce-slider" min="25" max="98" value="82" step="1" style="flex: 1;">
                    <span id="tm-mini-dice-bounce-val" class="tm-val-label">82</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-mini-dice-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Yüksek değer küçük zarların daha çabuk sakinleşmesini sağlar">İç Zar Sön</span>
                    <input type="range" class="tm-slider" id="tm-mini-dice-friction-slider" min="0" max="75" value="24" step="1" style="flex: 1;">
                    <span id="tm-mini-dice-friction-val" class="tm-val-label">24</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;" class="tm-edge-shadow-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Delik kenarındaki kırık hattın gölge kalınlığı">Kenar Kalın</span>
                    <input type="range" class="tm-slider" id="tm-edge-width-slider" min="0" max="200" value="100" step="5" style="flex: 1;">
                    <span id="tm-edge-width-val" class="tm-val-label">100</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;" class="tm-edge-shadow-row">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Delik kenarındaki gölgenin bulanıklık miktarı (0 = tamamen net)">Kenar Bulanık</span>
                    <input type="range" class="tm-slider" id="tm-edge-blur-slider" min="0" max="100" value="30" step="5" style="flex: 1;">
                    <span id="tm-edge-blur-val" class="tm-val-label">30</span>
                </div>
            </div>

            <div class="tm-menu-section tm-theme-section" style="margin-top: 4px;">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 2px;">RENK PALETI</div>
                <select class="tm-select" id="tm-theme-select">
                    <option value="lava" style="color: #ffeb3b; background: #3a0000;">🔥 Reçine Lav</option>
                    <option value="bonelegend" style="color: #ff6a3d; background: #241010;">🔶 Kadim Efsane</option>
                    <option value="void" style="color: #e0b0ff; background: #1a0a28;">🟣 Hiçlik (Karanlık Mor)</option>
                    <option value="obsidian" style="color: #f0d6a8; background: #2a2119;">⚫ Obsidyen</option>
                    <option value="toxic" style="color: #baffa8; background: #0a1a08;">☣️ Toksik Asit</option>
                    <option value="blood" style="color: #ffb0a8; background: #2a0806;">🩸 Kan Büyüsü</option>
                    <option value="celestial" style="color: #fff; background: #c9b06a;">✨ Kutsal Işık</option>
                </select>
            </div>

            <div class="tm-menu-section" style="margin-top: 4px; padding: 4px; border: 1px solid #4a3227; background: #150c0a; border-radius: 4px;">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 4px; text-align:center;">SONUÇ PARLAMASI (GLOW)</div>
                <select class="tm-select" id="tm-glow-target" style="margin-bottom: 4px;">
                    <option value="top">Tepedeki Yüzeyi Seç (FRP)</option>
                    <option value="front">Ekrana Bakan Yüzeyi Seç</option>
                </select>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;">Glow Gücü</span>
                    <input type="range" class="tm-slider" id="tm-glow-slider" min="0" max="100" value="65" step="1" style="flex: 1;">
                    <span id="tm-glow-val" class="tm-val-label">65</span>
                </div>
            </div>

            <div class="tm-menu-section" style="margin-top: 4px;">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 2px;">ZEMİN AYARI</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;">Limit Yeri</span>
                    <input type="range" class="tm-slider" id="tm-ground-slider" min="10" max="100" value="100" step="1" title="Zarın düşeceği alt sınırı belirler" style="flex: 1;">
                    <span id="tm-ground-val" class="tm-val-label">%100</span>
                </div>
            </div>

            <div class="tm-menu-section" style="margin-top: 4px; padding: 4px; border: 1px solid #4a3227; background: #150c0a; border-radius: 4px;">
                <div style="color: #a88b5e; font-size: 10px; font-weight: bold; margin-bottom: 4px; text-align:center;">GÖRÜNÜRLÜK</div>
                <div class="tm-menu-btn" id="tm-toggle-visibility-btn">👁️ Zarı Gizle</div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                    <span style="color: #a88b5e; font-size: 10px; width: 45px; text-align: right;" title="Zarı gizlemek/göstermek için kısayol">Kısayol</span>
                    <div class="tm-select" id="tm-hotkey-display" style="flex: 1; text-align: center; cursor: pointer;" title="Değiştirmek için tıklayın, ardından yeni tuş kombinasyonuna basın">Alt+Shift+D</div>
                </div>
            </div>

            <div class="tm-menu-section" style="margin-top: 4px;">
                <div class="tm-menu-btn" id="tm-save-btn">💾 Hızlı Kaydet</div>
            </div>

            <div class="tm-menu-section">
                <div id="tm-presets-list"></div>
            </div>

        </div>

        <div id="tm-custom-dialog">
            <div id="tm-dialog-msg">Mesaj</div>
            <button id="tm-dialog-ok">Tamam</button>
            <button id="tm-dialog-cancel">İptal</button>
        </div>
        `;
    }

    function getSkullSVG() {
        return `<div class="tm-skull-icon"><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path class="skull-fill" d="M 50,15 C 20,15 15,35 15,55 C 15,70 25,75 30,85 L 70,85 C 75,75 85,70 85,55 C 85,35 80,15 50,15 Z"/>
            <polygon class="skull-dark" points="25,45 45,55 35,68"/>
            <polygon class="skull-dark" points="75,45 55,55 65,68"/>
            <polygon class="skull-dark" points="50,65 46,75 54,75"/>
            <path fill="rgba(0,0,0,0.85)" d="M 50,75 C 30,75 5,90 10,105 C 20,95 30,90 40,88 C 45,87 55,87 60,88 C 70,90 80,95 90,105 C 95,90 70,75 50,75 Z"/>
        </svg></div>`;
    }

    function getHornedSkullSVG() {
        return `<div class="tm-skull-icon horned-skull"><svg viewBox="-30 -20 160 150" xmlns="http://www.w3.org/2000/svg">
            <path class="skull-fill" d="M 18,30 C -15,0 -35,30 -10,48 C -5,35 15,25 30,35 Z"/>
            <path class="skull-fill" d="M 82,30 C 115,0 135,30 110,48 C 105,35 85,25 70,35 Z"/>
            <path class="skull-fill" d="M 50,10 C 15,10 5,40 10,65 C 15,80 25,85 30,100 L 70,100 C 75,85 85,80 90,65 C 95,40 85,10 50,10 Z"/>
            <path fill="rgba(0,0,0,0.3)" d="M 10,50 C 25,45 40,50 50,55 C 60,50 75,45 90,50 C 85,65 75,70 70,65 C 60,60 40,60 30,65 C 25,70 15,65 10,50 Z"/>
            <polygon class="skull-dark" points="20,45 45,55 35,68"/>
            <polygon class="skull-dark" points="80,45 55,55 65,68"/>
            <polygon class="skull-dark" points="50,65 44,78 56,78"/>
            <path fill="rgba(0,0,0,0.9)" d="M 50,80 C 20,80 -10,100 -15,125 C 5,105 25,100 40,95 C 45,93 55,93 60,95 C 75,100 95,105 115,125 C 110,100 80,80 50,80 Z"/>
        </svg></div>`;
    }

    function getCornerPlateSVG(dir) {
        let points = "";
        let edge = "";
        if (dir === 'tl') {
            points = "0,0 75,0 0,75";
            edge = '<line x1="75" y1="0" x2="0" y2="75" class="plate-edge"/>';
        } else if (dir === 'tr') {
            points = "25,0 100,0 100,75";
            edge = '<line x1="25" y1="0" x2="100" y2="75" class="plate-edge"/>';
        } else if (dir === 'bl') {
            points = "0,25 75,100 0,100";
            edge = '<line x1="0" y1="25" x2="75" y2="100" class="plate-edge"/>';
        } else if (dir === 'br') {
            points = "25,100 100,25 100,100";
            edge = '<line x1="25" y1="100" x2="100" y2="25" class="plate-edge"/>';
        }

        return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%; height:100%; display:block; overflow:visible;" xmlns="http://www.w3.org/2000/svg">
            <polygon points="${points}" class="plate-fill"/>
            ${edge}
        </svg>`;
    }

    function seededRandom(seed) {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function getJaggedHolePath(cx, cy, r, seed) {
        const coreCount = 11;
        const armCount = 4;

        const corePoints = [];
        for (let k = 0; k < coreCount; k++) {
            const angle = (k / coreCount) * Math.PI * 2 + seededRandom(seed + 500) * 0.5;
            const jitter = 0.82 + seededRandom(seed + k * 12.9898) * 0.32;
            const rr = r * jitter * 0.62;
            corePoints.push([cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr, angle, rr]);
        }

        let d = `M ${corePoints[0][0]} ${corePoints[0][1]} `;
        for (let k = 0; k < coreCount; k++) {
            const curr = corePoints[k];
            const next = corePoints[(k + 1) % coreCount];

            const shouldHaveArm = seededRandom(seed + k * 7.77) < (armCount / coreCount);
            if (shouldHaveArm) {
                const armAngle = curr[2] + (seededRandom(seed + k * 3.33) - 0.5) * 0.3;
                const armLength = r * (0.7 + seededRandom(seed + k * 5.55) * 0.4);
                const armTipX = cx + Math.cos(armAngle) * armLength;
                const armTipY = cy + Math.sin(armAngle) * armLength;

                const baseSpread = 0.15 + seededRandom(seed + k * 9.11) * 0.1;
                const perpAngle = armAngle + Math.PI / 2;
                const baseX1 = curr[0] + Math.cos(perpAngle) * r * baseSpread;
                const baseY1 = curr[1] + Math.sin(perpAngle) * r * baseSpread;
                const baseX2 = curr[0] - Math.cos(perpAngle) * r * baseSpread;
                const baseY2 = curr[1] - Math.sin(perpAngle) * r * baseSpread;

                const forkStartX = cx + Math.cos(armAngle) * armLength * 0.68;
                const forkStartY = cy + Math.sin(armAngle) * armLength * 0.68;
                const forkLen = armLength * (0.22 + seededRandom(seed + k * 6.66) * 0.18);
                const fork1Angle = armAngle + 0.35 + seededRandom(seed + k * 2.22) * 0.15;
                const fork2Angle = armAngle - 0.35 - seededRandom(seed + k * 8.88) * 0.15;
                const fork1X = forkStartX + Math.cos(fork1Angle) * forkLen;
                const fork1Y = forkStartY + Math.sin(fork1Angle) * forkLen;
                const fork2X = forkStartX + Math.cos(fork2Angle) * forkLen;
                const fork2Y = forkStartY + Math.sin(fork2Angle) * forkLen;

                d += `L ${baseX1} ${baseY1} `;
                d += `L ${forkStartX} ${forkStartY} L ${fork1X} ${fork1Y} L ${forkStartX} ${forkStartY} `;
                d += `L ${armTipX} ${armTipY} `;
                d += `L ${forkStartX} ${forkStartY} L ${fork2X} ${fork2Y} L ${forkStartX} ${forkStartY} `;
                d += `L ${baseX2} ${baseY2} `;
            }

            d += `L ${next[0]} ${next[1]} `;
        }
        d += 'Z';
        return d;
    }

    function getCompactPipsHTML(value) {
        const count = Math.max(1, Math.min(20, parseInt(value, 10) || 1));
        let html = '<div class="tm-compact-pips">';
        for(let i = 0; i < count; i++) {
            html += '<span class="tm-compact-pip"></span>';
        }
        html += '</div>';
        return html;
    }

    // Kullanılacak fonksiyonları dışa aktarıyoruz
    return {
        getCSS: getCSS,
        getMenuHTML: getMenuHTML,
        getSkullSVG: getSkullSVG,
        getHornedSkullSVG: getHornedSkullSVG,
        getCornerPlateSVG: getCornerPlateSVG,
        getJaggedHolePath: getJaggedHolePath,
        getCompactPipsHTML: getCompactPipsHTML
    };
})();
