export type Language = 'en' | 'es' | 'de';

export const translations = {
  en: {
    // Navigation
    nav: {
      products: 'PRODUCTS',
      partners: 'PARTNERS',
      playDemo: 'PLAY DEMO',
      buyNow: 'BUY NOW',
    },
    // Hero Section
    hero: {
      watchTrailer: 'WATCH TRAILER',
      buyAtCopiaro: 'BUY AT COPIARO',
      copiaroSubtext: 'Our trusted partner for physical cartridges & merchandise',
    },
    // Story Section
    story: {
      title: 'The Story',
      p1: '{heroOfBitcoin} is a story inspired by Bitcoin culture, set in the beautiful Bitcoin-sovereign nation of {elSalvador}.',
      p2: 'You will be taken to iconic places such as {bitcoinBeach}, the volcano and more, all the way to the bank\'s doorstep.',
      p3: 'The game follows the journey of a young man called {hero}, a new bitcoiner, who journeys to El Salvador wanting to help the Bitcoin fight on the frontlines.',
      p4: 'You will need to help {presidentBukele} and other bitcoiners to ensure poocoiners, bears, bankers and more do not stand in the way of Bitcoin adoption.',
    },
    // Controls Section
    controls: {
      title: 'Controls',
      aButton: 'A Button',
      bButton: 'B Button',
      start: 'Start',
      select: 'Select',
      dPad: 'D-Pad',
      aDesc: 'Confirm, Jump, Talk',
      bDesc: 'Run, Sword',
      startDesc: 'Pause',
      selectDesc: 'Unused',
      dPadDesc: 'Move, Climb, Enter',
    },
    // Characters Section
    characters: {
      title: 'Non Player Characters',
      samson: {
        role: 'Veteran Advocate',
        description: 'A veteran in the space and fervent advocate for Bitcoin technology.',
      },
      michael: {
        role: 'Inflation Hedge',
        description: 'Vocal advocate of Bitcoin as a digital asset and inflation hedge.',
      },
      maxStacey: {
        role: 'Financial News',
        description: 'Renowned for a financial news show covering topics related to global finance.',
      },
      nayib: {
        role: 'The President',
        description: 'Made a historic impact on Bitcoin establishing it as legal tender in El Salvador.',
      },
      adam: {
        role: 'OG Cyberpunk',
        description: 'Known for his pioneering work on cryptographic systems.',
      },
      faketoshi: {
        role: 'Impersonator',
        description: 'Clown or impersonator? Whatever the correct term is, he is not Satoshi.',
      },
      saifedean: {
        role: 'The Economist',
        description: 'Author of The Bitcoin Standard, advocating for sound money principles.',
      },
    },
    // Tips & Credits
    tips: {
      title: 'Tips',
      collectingBitcoin: 'Collecting Bitcoin',
      collectingDesc: 'There are 21 bitcoin hidden throughout the game. Can you find them all?',
      gettingStuck: 'Getting Stuck',
      stuckDesc: 'Talk to every NPC. They often have clues about where to go next.',
    },
    credits: {
      title: 'Credits',
      pixelart: 'Pixelart',
      programming: 'Programming',
      music: 'Music',
      soundFx: 'Sound FX',
      community: 'Community supporters',
      sponsoredBy: 'Sponsored by',
    },
    // Legal
    legal: {
      disclaimer1: 'Please note that the \'Game Boy©\' name is mentioned to demonstrate console compatibility. All trademarks are the property of their respective owners.',
      disclaimer2: 'This game can be played on Game Boy©, Game Boy Color©, Game Boy Advance©, Super Game Boy© and Analogue Pocket©.',
      notLicensed: 'This game is not licensed by Nintendo©.',
    },
    // Products Page
    products: {
      title: 'Products',
      buyNow: 'BUY NOW',
      shippingTitle: 'Shipping Info',
      shippingText: 'All products ship worldwide. Customs and import duties may apply depending on your country.',
      // Collector's Edition
      collectors: {
        title: "Collector's Edition",
        subtitle: 'LIMITED TO ~450 UNITS',
        quote: 'A tangible piece of Bitcoin history, playable on original hardware.',
        feature1: 'Premium Box & Manual',
        feature2: 'Orange Game Boy Cartridge',
        feature3: 'ROM Available on Request',
        feature4: 'Includes Sticker',
        feature5: 'Protective Box Cover',
        compatibility: 'Compatible with Game Boy, GBC, GBA, Analogue Pocket. Region free.',
      },
      // Digital Edition
      digital: {
        title: 'Digital Edition',
        subtitle: 'PLAY ANYWHERE',
        quote: 'The perfect collectible for emulator enthusiasts. No Game Boy required.',
        feature1: 'Premium Box & Manual',
        feature2: 'microSD with Game ROM',
        feature3: 'Includes Sticker',
        feature4: 'Protective Box Cover',
        note: 'Includes a decorative cartridge-shaped collectible. The game ROM is on the included microSD card.',
        compatibility: 'Play on Raspberry Pi, MiSTer FPGA, RetroArch, or any Game Boy emulator.',
      },
      // Hero Handheld
      handheld: {
        title: 'Hero Handheld',
        subtitle: 'READY TO PLAY',
        quote: 'Hero of Bitcoin pre-installed. Power on and play instantly.',
        feature1: 'ArkOS Pre-Installed',
        feature2: 'Hero of Bitcoin Ready',
        feature3: 'microSD Card Included',
        feature4: 'Includes Sticker',
        quickControls: 'Quick Controls',
        exit: 'Exit',
        save: 'Save',
        load: 'Load',
        fastFwd: 'Fast Fwd',
        copyright: 'Other system ROMs not included. Please respect copyright holders when adding additional games.',
        compatibility: 'Also supports GB, GBC, GBA, NES, SNES, Genesis, PS1, and more.',
      },
      // Stackchain Magazine
      magazine: {
        title: 'Stackchain Magazine',
        subtitle: 'LIMITED TO 30 PRINTS',
        quote: 'Exclusive interview with the creator, plus fine art print with alternative Hero of Bitcoin cover.',
        feature1: 'Stackchain Magazine Round 5',
        feature2: 'Fine Art Print (Alt Cover)',
        feature3: 'Premium Protective Toploader',
        feature4: 'Creator Interview Inside',
        note: 'Limited edition collectible. Magazine and art print ship in protective toploader.',
      },
      // Tech Details
      techDetails: {
        title: 'Hero Handheld Technical Details & Troubleshooting',
        safeShutdown: 'Safe Shutdown:',
        safeShutdownDesc: 'Never pull card while saving. Use START → Quit → Shutdown or SELECT+START twice.',
        power: 'Power & Charging',
        powerItems: ['USB-A to USB-C only', '5V (1-2A) charger', 'Avoid fast chargers'],
        microsd: 'microSD Handling',
        microsdItems: ["Don't reformat card", 'Use EASYROMS partition', 'Always eject safely'],
        addingGames: 'Adding Games',
        addingItems: ['Path: EASYROMS/roms/', 'Match folder (nes → /nes)', 'Bios files included'],
        wontBoot: "Won't Boot",
        wontBootDesc: 'Hold POWER+A 15s, release, press Power',
        gamesMissing: 'Games Missing',
        gamesMissingDesc: 'Check extensions, unzip, rescan in Options',
        chargingIssues: 'Charging Issues',
        chargingIssuesDesc: 'Try different 5V brick, avoid sleeping ports',
      },
      badges: {
        ltdEdition: 'LTD EDITION',
        budgetPick: 'BUDGET PICK',
        readyToPlay: 'READY TO PLAY',
        printEdition: 'PRINT EDITION',
      },
    },
    // Partners Page
    partners: {
      title: 'Our Partners',
      subtitle: 'Trusted retailers bringing Hero of Bitcoin to the world',
      visitStore: 'Visit Store',
      copiaro: {
        name: 'Copiaro',
        description: 'Copiaro is an established, international Bitcoin retailer and fulfillment partner, offering professional service, reliable worldwide shipping, and a curated selection of high-quality Bitcoin products. A premium choice for customers who want a smooth, trusted buying experience.',
      },
      plebstyle: {
        name: 'Plebstyle',
        description: 'Plebstyle is a Bitcoin-native, independent shop run with passion and care, offering thoughtfully designed products created by a Bitcoiner for the Bitcoin community. Best suited for customers within the EU who value authenticity, craftsmanship, and direct community support.',
      },
    },
    // Footer
    footer: {
      fanSwag: 'CUPS, SHIRTS & CAPS',
      copyright: '©2022-2025 Hero of Bitcoin • heroofbitcoin.xyz',
    },
  },

  es: {
    // Navigation
    nav: {
      products: 'PRODUCTOS',
      partners: 'SOCIOS',
      playDemo: 'JUGAR DEMO',
      buyNow: 'COMPRAR',
    },
    // Hero Section
    hero: {
      watchTrailer: 'VER TRÁILER',
      buyAtCopiaro: 'COMPRAR EN COPIARO',
      copiaroSubtext: 'Nuestro socio de confianza para cartuchos físicos y merchandising',
    },
    // Story Section
    story: {
      title: 'La Historia',
      p1: '{heroOfBitcoin} es una historia inspirada en la cultura Bitcoin, ambientada en la hermosa nación soberana de Bitcoin: {elSalvador}.',
      p2: 'Serás llevado a lugares icónicos como {bitcoinBeach}, el volcán y más, hasta llegar a las puertas del banco.',
      p3: 'El juego sigue el viaje de un joven llamado {hero}, un nuevo bitcoiner que viaja a El Salvador queriendo ayudar en la lucha por Bitcoin en primera línea.',
      p4: 'Tendrás que ayudar al {presidentBukele} y otros bitcoiners para asegurar que los poocoiners, osos, banqueros y más no se interpongan en el camino de la adopción de Bitcoin.',
    },
    // Controls Section
    controls: {
      title: 'Controles',
      aButton: 'Botón A',
      bButton: 'Botón B',
      start: 'Start',
      select: 'Select',
      dPad: 'D-Pad',
      aDesc: 'Confirmar, Saltar, Hablar',
      bDesc: 'Correr, Espada',
      startDesc: 'Pausa',
      selectDesc: 'Sin uso',
      dPadDesc: 'Mover, Escalar, Entrar',
    },
    // Characters Section
    characters: {
      title: 'Personajes No Jugables',
      samson: {
        role: 'Veterano Defensor',
        description: 'Un veterano en el espacio y ferviente defensor de la tecnología Bitcoin.',
      },
      michael: {
        role: 'Cobertura contra Inflación',
        description: 'Defensor vocal de Bitcoin como activo digital y cobertura contra la inflación.',
      },
      maxStacey: {
        role: 'Noticias Financieras',
        description: 'Reconocidos por un programa de noticias financieras sobre temas de finanzas globales.',
      },
      nayib: {
        role: 'El Presidente',
        description: 'Tuvo un impacto histórico en Bitcoin estableciéndolo como moneda de curso legal en El Salvador.',
      },
      adam: {
        role: 'OG Cyberpunk',
        description: 'Conocido por su trabajo pionero en sistemas criptográficos.',
      },
      faketoshi: {
        role: 'Impostor',
        description: '¿Payaso o impostor? Sea cual sea el término correcto, él no es Satoshi.',
      },
      saifedean: {
        role: 'El Economista',
        description: 'Autor de The Bitcoin Standard, defensor de los principios del dinero sólido.',
      },
    },
    // Tips & Credits
    tips: {
      title: 'Consejos',
      collectingBitcoin: 'Recolectando Bitcoin',
      collectingDesc: 'Hay 21 bitcoin escondidos en el juego. ¿Puedes encontrarlos todos?',
      gettingStuck: 'Si te atascas',
      stuckDesc: 'Habla con cada NPC. A menudo tienen pistas sobre dónde ir.',
    },
    credits: {
      title: 'Créditos',
      pixelart: 'Pixelart',
      programming: 'Programación',
      music: 'Música',
      soundFx: 'Efectos de Sonido',
      community: 'Apoyo de la comunidad',
      sponsoredBy: 'Patrocinado por',
    },
    // Legal
    legal: {
      disclaimer1: 'El nombre \'Game Boy©\' se menciona para demostrar compatibilidad. Todas las marcas son propiedad de sus respectivos dueños.',
      disclaimer2: 'Este juego puede jugarse en Game Boy©, Game Boy Color©, Game Boy Advance©, Super Game Boy© y Analogue Pocket©.',
      notLicensed: 'Este juego no está licenciado por Nintendo©.',
    },
    // Products Page
    products: {
      title: 'Productos',
      buyNow: 'COMPRAR',
      shippingTitle: 'Info de Envío',
      shippingText: 'Todos los productos se envían a todo el mundo. Pueden aplicarse aduanas e impuestos según tu país.',
      // Collector's Edition
      collectors: {
        title: 'Edición Coleccionista',
        subtitle: 'LIMITADO A ~450 UNIDADES',
        quote: 'Una pieza tangible de la historia de Bitcoin, jugable en hardware original.',
        feature1: 'Caja Premium y Manual',
        feature2: 'Cartucho Naranja de Game Boy',
        feature3: 'ROM Disponible bajo Petición',
        feature4: 'Incluye Pegatina',
        feature5: 'Funda Protectora',
        compatibility: 'Compatible con Game Boy, GBC, GBA, Analogue Pocket. Sin restricción de región.',
      },
      // Digital Edition
      digital: {
        title: 'Edición Digital',
        subtitle: 'JUEGA DONDE QUIERAS',
        quote: 'El coleccionable perfecto para entusiastas de emuladores. No requiere Game Boy.',
        feature1: 'Caja Premium y Manual',
        feature2: 'microSD con ROM del Juego',
        feature3: 'Incluye Pegatina',
        feature4: 'Funda Protectora',
        note: 'Incluye un coleccionable decorativo en forma de cartucho. La ROM está en la tarjeta microSD incluida.',
        compatibility: 'Juega en Raspberry Pi, MiSTer FPGA, RetroArch o cualquier emulador de Game Boy.',
      },
      // Hero Handheld
      handheld: {
        title: 'Hero Handheld',
        subtitle: 'LISTO PARA JUGAR',
        quote: 'Hero of Bitcoin preinstalado. Enciende y juega al instante.',
        feature1: 'ArkOS Preinstalado',
        feature2: 'Hero of Bitcoin Listo',
        feature3: 'Tarjeta microSD Incluida',
        feature4: 'Incluye Pegatina',
        quickControls: 'Controles Rápidos',
        exit: 'Salir',
        save: 'Guardar',
        load: 'Cargar',
        fastFwd: 'Avance Rápido',
        copyright: 'ROMs de otros sistemas no incluidas. Por favor respeta los derechos de autor al añadir juegos adicionales.',
        compatibility: 'También soporta GB, GBC, GBA, NES, SNES, Genesis, PS1 y más.',
      },
      // Stackchain Magazine
      magazine: {
        title: 'Stackchain Magazine',
        subtitle: 'LIMITADO A 30 IMPRESIONES',
        quote: 'Entrevista exclusiva con el creador, más impresión artística con portada alternativa de Hero of Bitcoin.',
        feature1: 'Stackchain Magazine Ronda 5',
        feature2: 'Impresión Artística (Portada Alt)',
        feature3: 'Toploader Protector Premium',
        feature4: 'Entrevista del Creador',
        note: 'Coleccionable de edición limitada. Revista e impresión artística enviadas en toploader protector.',
      },
      // Tech Details
      techDetails: {
        title: 'Detalles Técnicos y Solución de Problemas del Hero Handheld',
        safeShutdown: 'Apagado Seguro:',
        safeShutdownDesc: 'Nunca quites la tarjeta mientras guardas. Usa START → Salir → Apagar o SELECT+START dos veces.',
        power: 'Energía y Carga',
        powerItems: ['Solo USB-A a USB-C', 'Cargador 5V (1-2A)', 'Evita cargadores rápidos'],
        microsd: 'Manejo de microSD',
        microsdItems: ['No reformatees la tarjeta', 'Usa partición EASYROMS', 'Siempre expulsa de forma segura'],
        addingGames: 'Añadir Juegos',
        addingItems: ['Ruta: EASYROMS/roms/', 'Carpeta correspondiente (nes → /nes)', 'Archivos Bios incluidos'],
        wontBoot: 'No Enciende',
        wontBootDesc: 'Mantén POWER+A 15s, suelta, presiona Power',
        gamesMissing: 'Juegos Faltantes',
        gamesMissingDesc: 'Verifica extensiones, descomprime, reescanea en Opciones',
        chargingIssues: 'Problemas de Carga',
        chargingIssuesDesc: 'Prueba otro cargador 5V, evita puertos en suspensión',
      },
      badges: {
        ltdEdition: 'ED. LIMITADA',
        budgetPick: 'ECONÓMICO',
        readyToPlay: 'LISTO PARA JUGAR',
        printEdition: 'ED. IMPRESA',
      },
    },
    // Partners Page
    partners: {
      title: 'Nuestros Socios',
      subtitle: 'Minoristas de confianza que llevan Hero of Bitcoin al mundo',
      visitStore: 'Visitar Tienda',
      copiaro: {
        name: 'Copiaro',
        description: 'Copiaro es un minorista internacional de Bitcoin establecido y socio de cumplimiento, que ofrece servicio profesional, envío mundial confiable y una selección curada de productos Bitcoin de alta calidad. Una opción premium para clientes que desean una experiencia de compra fluida y confiable.',
      },
      plebstyle: {
        name: 'Plebstyle',
        description: 'Plebstyle es una tienda independiente nativa de Bitcoin, gestionada con pasión y cuidado, que ofrece productos diseñados con esmero, creados por un Bitcoiner para la comunidad Bitcoin. Ideal para clientes dentro de la UE que valoran la autenticidad, la artesanía y el apoyo directo a la comunidad.',
      },
    },
    // Footer
    footer: {
      fanSwag: 'TAZAS, CAMISETAS Y GORRAS',
      copyright: '©2022-2025 Hero of Bitcoin • heroofbitcoin.xyz',
    },
  },

  de: {
    // Navigation
    nav: {
      products: 'PRODUKTE',
      partners: 'PARTNER',
      playDemo: 'DEMO SPIELEN',
      buyNow: 'KAUFEN',
    },
    // Hero Section
    hero: {
      watchTrailer: 'TRAILER ANSEHEN',
      buyAtCopiaro: 'BEI COPIARO KAUFEN',
      copiaroSubtext: 'Unser vertrauenswürdiger Partner für physische Cartridges & Merchandise',
    },
    // Story Section
    story: {
      title: 'Die Geschichte',
      p1: '{heroOfBitcoin} ist eine Geschichte, inspiriert von der Bitcoin-Kultur, angesiedelt in der wunderschönen Bitcoin-souveränen Nation {elSalvador}.',
      p2: 'Du wirst zu ikonischen Orten wie {bitcoinBeach}, dem Vulkan und mehr geführt, bis hin zur Türschwelle der Bank.',
      p3: 'Das Spiel folgt der Reise eines jungen Mannes namens {hero}, einem neuen Bitcoiner, der nach El Salvador reist, um beim Bitcoin-Kampf an vorderster Front zu helfen.',
      p4: 'Du musst {presidentBukele} und anderen Bitcoinern helfen, damit Poocoiners, Bären, Banker und mehr der Bitcoin-Adoption nicht im Weg stehen.',
    },
    // Controls Section
    controls: {
      title: 'Steuerung',
      aButton: 'A-Taste',
      bButton: 'B-Taste',
      start: 'Start',
      select: 'Select',
      dPad: 'D-Pad',
      aDesc: 'Bestätigen, Springen, Reden',
      bDesc: 'Rennen, Schwert',
      startDesc: 'Pause',
      selectDesc: 'Unbenutzt',
      dPadDesc: 'Bewegen, Klettern, Betreten',
    },
    // Characters Section
    characters: {
      title: 'Nicht-Spieler-Charaktere',
      samson: {
        role: 'Veteran & Befürworter',
        description: 'Ein Veteran im Bereich und leidenschaftlicher Befürworter der Bitcoin-Technologie.',
      },
      michael: {
        role: 'Inflationsschutz',
        description: 'Lautstarker Befürworter von Bitcoin als digitaler Vermögenswert und Inflationsschutz.',
      },
      maxStacey: {
        role: 'Finanznachrichten',
        description: 'Bekannt für eine Finanznachrichtensendung über globale Finanzthemen.',
      },
      nayib: {
        role: 'Der Präsident',
        description: 'Hatte einen historischen Einfluss auf Bitcoin durch die Einführung als gesetzliches Zahlungsmittel in El Salvador.',
      },
      adam: {
        role: 'OG Cyberpunk',
        description: 'Bekannt für seine Pionierarbeit an kryptographischen Systemen.',
      },
      faketoshi: {
        role: 'Betrüger',
        description: 'Clown oder Betrüger? Wie auch immer man es nennt, er ist nicht Satoshi.',
      },
      saifedean: {
        role: 'Der Ökonom',
        description: 'Autor von The Bitcoin Standard, Befürworter von Sound-Money-Prinzipien.',
      },
    },
    // Tips & Credits
    tips: {
      title: 'Tipps',
      collectingBitcoin: 'Bitcoin Sammeln',
      collectingDesc: 'Es gibt 21 Bitcoin im Spiel versteckt. Kannst du alle finden?',
      gettingStuck: 'Wenn du nicht weiterkommst',
      stuckDesc: 'Sprich mit jedem NPC. Sie haben oft Hinweise, wo es weitergeht.',
    },
    credits: {
      title: 'Credits',
      pixelart: 'Pixelart',
      programming: 'Programmierung',
      music: 'Musik',
      soundFx: 'Sound-Effekte',
      community: 'Community-Unterstützer',
      sponsoredBy: 'Gesponsert von',
    },
    // Legal
    legal: {
      disclaimer1: 'Der Name \'Game Boy©\' wird zur Demonstration der Kompatibilität erwähnt. Alle Marken sind Eigentum ihrer jeweiligen Inhaber.',
      disclaimer2: 'Dieses Spiel kann auf Game Boy©, Game Boy Color©, Game Boy Advance©, Super Game Boy© und Analogue Pocket© gespielt werden.',
      notLicensed: 'Dieses Spiel ist nicht von Nintendo© lizenziert.',
    },
    // Products Page
    products: {
      title: 'Produkte',
      buyNow: 'KAUFEN',
      shippingTitle: 'Versandinfo',
      shippingText: 'Alle Produkte werden weltweit versendet. Zoll und Einfuhrabgaben können je nach Land anfallen.',
      // Collector's Edition
      collectors: {
        title: 'Sammler-Edition',
        subtitle: 'LIMITIERT AUF ~450 STÜCK',
        quote: 'Ein greifbares Stück Bitcoin-Geschichte, spielbar auf Original-Hardware.',
        feature1: 'Premium-Box & Handbuch',
        feature2: 'Oranges Game Boy Cartridge',
        feature3: 'ROM auf Anfrage verfügbar',
        feature4: 'Inklusive Aufkleber',
        feature5: 'Schutzhülle für Box',
        compatibility: 'Kompatibel mit Game Boy, GBC, GBA, Analogue Pocket. Regionsfrei.',
      },
      // Digital Edition
      digital: {
        title: 'Digital Edition',
        subtitle: 'ÜBERALL SPIELEN',
        quote: 'Das perfekte Sammlerstück für Emulator-Enthusiasten. Kein Game Boy erforderlich.',
        feature1: 'Premium-Box & Handbuch',
        feature2: 'microSD mit Spiel-ROM',
        feature3: 'Inklusive Aufkleber',
        feature4: 'Schutzhülle für Box',
        note: 'Enthält ein dekoratives Cartridge-Sammlerstück. Die ROM befindet sich auf der enthaltenen microSD-Karte.',
        compatibility: 'Spielbar auf Raspberry Pi, MiSTer FPGA, RetroArch oder jedem Game Boy Emulator.',
      },
      // Hero Handheld
      handheld: {
        title: 'Hero Handheld',
        subtitle: 'SOFORT SPIELBEREIT',
        quote: 'Hero of Bitcoin vorinstalliert. Einschalten und sofort spielen.',
        feature1: 'ArkOS Vorinstalliert',
        feature2: 'Hero of Bitcoin Spielbereit',
        feature3: 'microSD-Karte Inklusive',
        feature4: 'Inklusive Aufkleber',
        quickControls: 'Schnellsteuerung',
        exit: 'Beenden',
        save: 'Speichern',
        load: 'Laden',
        fastFwd: 'Vorspulen',
        copyright: 'Andere System-ROMs nicht enthalten. Bitte respektiere Urheberrechte beim Hinzufügen weiterer Spiele.',
        compatibility: 'Unterstützt auch GB, GBC, GBA, NES, SNES, Genesis, PS1 und mehr.',
      },
      // Stackchain Magazine
      magazine: {
        title: 'Stackchain Magazine',
        subtitle: 'LIMITIERT AUF 30 STÜCK',
        quote: 'Exklusives Interview mit dem Entwickler, plus Kunstdruck mit alternativem Hero of Bitcoin Cover.',
        feature1: 'Stackchain Magazine Runde 5',
        feature2: 'Kunstdruck (Alt. Cover)',
        feature3: 'Premium Schutzhülle',
        feature4: 'Entwickler-Interview',
        note: 'Limitiertes Sammlerstück. Magazin und Kunstdruck werden in Schutzhülle geliefert.',
      },
      // Tech Details
      techDetails: {
        title: 'Hero Handheld Technische Details & Fehlerbehebung',
        safeShutdown: 'Sicheres Ausschalten:',
        safeShutdownDesc: 'Niemals Karte während des Speicherns entfernen. Nutze START → Beenden → Ausschalten oder SELECT+START zweimal.',
        power: 'Strom & Laden',
        powerItems: ['Nur USB-A zu USB-C', '5V (1-2A) Ladegerät', 'Schnellladegeräte vermeiden'],
        microsd: 'microSD Handhabung',
        microsdItems: ['Karte nicht neu formatieren', 'EASYROMS Partition nutzen', 'Immer sicher auswerfen'],
        addingGames: 'Spiele Hinzufügen',
        addingItems: ['Pfad: EASYROMS/roms/', 'Passender Ordner (nes → /nes)', 'Bios-Dateien enthalten'],
        wontBoot: 'Startet Nicht',
        wontBootDesc: 'POWER+A 15s halten, loslassen, Power drücken',
        gamesMissing: 'Spiele Fehlen',
        gamesMissingDesc: 'Erweiterungen prüfen, entpacken, in Optionen neu scannen',
        chargingIssues: 'Ladeprobleme',
        chargingIssuesDesc: 'Anderen 5V-Lader probieren, schlafende Ports meiden',
      },
      badges: {
        ltdEdition: 'LIMITIERT',
        budgetPick: 'PREISWERT',
        readyToPlay: 'SPIELBEREIT',
        printEdition: 'DRUCKAUSGABE',
      },
    },
    // Partners Page
    partners: {
      title: 'Unsere Partner',
      subtitle: 'Vertrauenswürdige Händler, die Hero of Bitcoin in die Welt bringen',
      visitStore: 'Shop Besuchen',
      copiaro: {
        name: 'Copiaro',
        description: 'Copiaro ist ein etablierter, internationaler Bitcoin-Händler und Fulfillment-Partner, der professionellen Service, zuverlässigen weltweiten Versand und eine kuratierte Auswahl hochwertiger Bitcoin-Produkte bietet. Eine Premium-Wahl für Kunden, die ein reibungsloses, vertrauenswürdiges Kauferlebnis wünschen.',
      },
      plebstyle: {
        name: 'Plebstyle',
        description: 'Plebstyle ist ein Bitcoin-nativer, unabhängiger Shop, der mit Leidenschaft und Sorgfalt geführt wird und durchdacht gestaltete Produkte anbietet, die von einem Bitcoiner für die Bitcoin-Community geschaffen wurden. Ideal für Kunden in der EU, die Authentizität, Handwerkskunst und direkte Community-Unterstützung schätzen.',
      },
    },
    // Footer
    footer: {
      fanSwag: 'TASSEN, SHIRTS & CAPS',
      copyright: '©2022-2025 Hero of Bitcoin • heroofbitcoin.xyz',
    },
  },
} as const;

// Use a more flexible type that allows different string values
export interface Translations {
  nav: { products: string; partners: string; playDemo: string; buyNow: string };
  hero: { watchTrailer: string; buyAtCopiaro: string; copiaroSubtext: string };
  story: { title: string; p1: string; p2: string; p3: string; p4: string };
  controls: {
    title: string;
    aButton: string;
    bButton: string;
    start: string;
    select: string;
    dPad: string;
    aDesc: string;
    bDesc: string;
    startDesc: string;
    selectDesc: string;
    dPadDesc: string;
  };
  characters: {
    title: string;
    samson: { role: string; description: string };
    michael: { role: string; description: string };
    maxStacey: { role: string; description: string };
    nayib: { role: string; description: string };
    adam: { role: string; description: string };
    faketoshi: { role: string; description: string };
    saifedean: { role: string; description: string };
  };
  tips: {
    title: string;
    collectingBitcoin: string;
    collectingDesc: string;
    gettingStuck: string;
    stuckDesc: string;
  };
  credits: {
    title: string;
    pixelart: string;
    programming: string;
    music: string;
    soundFx: string;
    community: string;
    sponsoredBy: string;
  };
  legal: { disclaimer1: string; disclaimer2: string; notLicensed: string };
  products: {
    title: string;
    buyNow: string;
    shippingTitle: string;
    shippingText: string;
    collectors: {
      title: string;
      subtitle: string;
      quote: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      feature5: string;
      compatibility: string;
    };
    digital: {
      title: string;
      subtitle: string;
      quote: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      note: string;
      compatibility: string;
    };
    handheld: {
      title: string;
      subtitle: string;
      quote: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      quickControls: string;
      exit: string;
      save: string;
      load: string;
      fastFwd: string;
      copyright: string;
      compatibility: string;
    };
    magazine: {
      title: string;
      subtitle: string;
      quote: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      note: string;
    };
    techDetails: {
      title: string;
      safeShutdown: string;
      safeShutdownDesc: string;
      power: string;
      powerItems: readonly string[];
      microsd: string;
      microsdItems: readonly string[];
      addingGames: string;
      addingItems: readonly string[];
      wontBoot: string;
      wontBootDesc: string;
      gamesMissing: string;
      gamesMissingDesc: string;
      chargingIssues: string;
      chargingIssuesDesc: string;
    };
    badges: { ltdEdition: string; budgetPick: string; readyToPlay: string; printEdition: string };
  };
  partners: {
    title: string;
    subtitle: string;
    visitStore: string;
    copiaro: { name: string; description: string };
    plebstyle: { name: string; description: string };
  };
  footer: { fanSwag: string; copyright: string };
}
