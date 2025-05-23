const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

const target = targetTokens[0];

await Sequencer.Preloader.preloadForClients([
    "modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg",
    "jb2a.energy_strands.range.multiple.purple.01",
    "modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg",
    "jb2a.divine_smite.caster.blueyellow",
]);

const targetHeightOffset = game.modules
    .get("lancer-weapon-fx")
    .api.getTokenHeightOffset({ targetToken: target, missed: targetsMissed.has(target.id) });

let sequence = new Sequence()

    .canvasPan() // rising weak high speed shake for background
        .shake({
        duration: 3500,
        fadeInDuration: 3000,
        fadeOutDuration: 500,
        strength: 7,
        frequency: 4,
        rotation: false,
    })
    .delay(200) // line up to start of beam
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerFire.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .startTime(900)
        .fadeInAudio(500)
    .effect()
        .file("jb2a.energy_strands.range.multiple.purple.01")
        .scale(0.4)
        .atLocation(sourceToken, heightOffset)
        .stretchTo(target, targetHeightOffset)
        .missed(targetsMissed.has(target.id))
        .xray()
        .aboveInterface()
        .waitUntilFinished(-1100);

sequence
    .sound()
        .file("modules/lancer-weapon-fx/soundfx/DisplacerHit2.ogg")
        .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.8))
        .playIf(!targetsMissed.has(target.id))
        .delay(300)
    .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .playIf(!targetsMissed.has(target.id))
        .scaleToObject(3)
        .tint("#9523e1")
        .filter("Glow", { color: 0xffffff, distance: 1 })
        .xray()
        .aboveInterface()
        .atLocation(target, targetHeightOffset)
        .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
        .randomSpriteRotation()
        .waitUntilFinished(-1000);

sequence.play();
