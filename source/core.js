define([
    './var',
    './core/Time',
    './core/Engine',
    './core/AbstractGameObject',
    './core/UnityGameObject',
    './core/CachableGameObject',
    './core/Transform',
    './core/Component',
    './core/Behaviour',
    './core/Collider',
    './core/Filter',
    './core/HitDelegate',
    './core/Renderer',
    './core/Stage',
    './core/Touch',
    './core/events/GameObjectEvent',
    './core/events/TouchEvent'
], function(W, Time, Engine, AbstractGameObject, UnityGameObject, CachableGameObject, Transform, Component,
    Behaviour, Collider, Filter, HitDelegate, Renderer, Stage, Touch, GameObjectEvent, TouchEvent) {

    var config;

    W.config = function(configuration) {
        config = configuration;
    };

    W.onStageInit = function(callback) {
        var stage = new Stage({
            id : 'wozllajs_Stage',
            canvas : config.canvas,
            width : config.width,
            height : config.height,
            autoClear : config.autoClear
        });
        config.canvas.width = config.width;
        config.canvas.height = config.height;
        Touch.init(stage);
        stage.init();
        stage.addEventListener(GameObjectEvent.INIT, function(e) {
            e.removeListener();
            setTimeout(function() {
                callback && callback(stage);
            }, 1);
        });
        Stage.root = stage;
        Engine.start();
    };

    return {
        Time : Time,
        Engine : Engine,
        AbstractGameObject : AbstractGameObject,
        UnityGameObject : UnityGameObject,
        CachableGameObject : CachableGameObject,
        GameObject : CachableGameObject,
        Transform : Transform,
        Component : Component,
        Behaviour : Behaviour,
        Filter : Filter,
        HitDelegate : HitDelegate,
        Renderer : Renderer,
        Stage : Stage,
        Touch : Touch,

        events : {
            TouchEvent : TouchEvent,
            GameObjectEvent : GameObjectEvent
        }
    };
});