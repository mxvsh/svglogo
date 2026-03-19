User clicks Randomize
    → randomizeLogo({ smart: true })
      → picks random icon set prefix from all 10 sets
      → fetches icon list (cached in memory)
      → getSmartLogoVisual(icons)
          → randomBackground()
              → 30% chance: solid color from nice-color-palettes (curated)
              → 70% chance: procedural gradient
                  → randomBeautifulHue() — avoids ugly 70–160° green range
                  → picks harmony type (45% analogous 2-stop, 25% analogous 3-stop,
                                        18% complementary, 12% split-complementary)
                  → consistent saturation per gradient (62–90%)
                  → lightness varies between stops for visible depth
                  → random direction 90–225°
          → pickIconColor(bg, palette)
              → solid: picks highest-contrast color from same palette (if ≥3:1), else white/black
              → gradient: white or black (whichever has better contrast across all stops)
          → random border radius from [16,24,32,48,64,96,112,128,200,256]
          → random icon size from [48,52,56,60,64]%
          → iconRotation: 0, iconBorderWidth: 0, borderWidth: 0
      → updateLogo() — applies everything to store
      → bumpStats({ total: 1, smart: 1 }) — stored in localStorage

  Custom mode (Custom ON):

  User clicks Randomize (with Icon/IconColor/Background toggles)
    → randomizeLogo({ icon, iconColor, background })
      → picks random prefix → fetches icons (cached)
      → getRandomLogoVisual(icons)
          → same randomBackground() as above
          → pickIconColor()
      → updateLogo() — only applies what's toggled on
      → bumpStats({ total: 1, custom: 1, icon: ?, iconColor: ?, background: ? })
