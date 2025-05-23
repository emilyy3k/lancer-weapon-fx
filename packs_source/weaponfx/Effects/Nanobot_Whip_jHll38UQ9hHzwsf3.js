const { targetsMissed, targetTokens, sourceToken } = game.modules.get("lancer-weapon-fx").api.getMacroVariables(this);

const impacts = [
    "jb2a.impact.002.blue",
    "jb2a.impact.003.blue",
    "jb2a.impact.004.blue",
    //"jb2a.impact.007.blue",
    "jb2a.impact.011.blue",
];

// the calculated height of the token (including scaling & elevation)
const heightOffset = game.modules.get("lancer-weapon-fx").api.getTokenHeightOffset({ targetToken: sourceToken });

await Sequencer.Preloader.preloadForClients([
    "jb2a.divine_smite.target.blueyellow",
    "modules/lancer-weapon-fx/soundfx/bladeswing.ogg",
    "modules/lancer-weapon-fx/soundfx/bladehit.ogg",
    "jb2a.impact.002.blue",
    "jb2a.impact.003.blue",
    "jb2a.impact.004.blue",
    //"jb2a.impact.007.blue",
    "jb2a.impact.011.blue",
]);

let sequence = new Sequence();

for (const target of targetTokens) {
    const targetMoveTowards = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, useAbsoluteCoords: true });
    const targetHeightOffsetRand = game.modules
        .get("lancer-weapon-fx")
        .api.getTokenHeightOffset({ targetToken: target, randomOffset: 1 });

    sequence
        .canvasPan()
            .shake(
            game.modules.get("lancer-weapon-fx").api.calculateScreenshake({
                duration: 500,
                fadeOutDuration: 150,
                fadeInDuration: 250,
                strength: 8,
                frequency: 25,
                rotation: false,
            }),
        )
        .delay(500);
    sequence
        .effect()
            .file("jb2a.divine_smite.target.blueyellow")
            .scale(0.9)
            .filter("ColorMatrix", { hue: 60, saturate: 3 })
            .atLocation(sourceToken, heightOffset)
            .moveTowards(targetMoveTowards)
            .moveSpeed(300)
            .xray()
            .aboveInterface()
            .spriteOffset({ x: 0, y: 100, gridUnits: true })
            .missed(targetsMissed.has(target.id))
            .rotate(90)
            .delay(500)
        .sound()
            .file("modules/lancer-weapon-fx/soundfx/bladeswing.ogg")
            .delay(500)
            .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));

    if (!targetsMissed.has(target.id)) {
        sequence
            .sound()
                .file("modules/lancer-weapon-fx/soundfx/bladehit.ogg")
                .delay(800)
                .volume(game.modules.get("lancer-weapon-fx").api.getEffectVolume(0.7));
        for (let j = 0; j < 5; j++) {
            sequence
                .canvasPan()
                    .shake({
                    duration: 80,
                    fadeInDuration: 20,
                    fadeOutDuration: 30,
                    strength: 7 + j * 3, // increase strength with each iteration.
                    frequency: 25 - j * 2,
                    rotation: false,
                })
                .delay(1200 + j * 80);
        }
        sequence
            .effect()
                .file(impacts)
                .scale(0.5)
                .filter("ColorMatrix", { hue: 220, saturate: 3 })
                .xray()
                .aboveInterface()
                .atLocation(target, targetHeightOffsetRand)
                .repeats(5, 80)
                .delay(1200)
                .randomSpriteRotation()
                .isometric(game.modules.get("lancer-weapon-fx").api.isometricEffectFlag())
                .waitUntilFinished(-1500);
    }
}
sequence.play();
