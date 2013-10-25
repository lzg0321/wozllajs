define([
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
], function(Time, Engine, AbstractGameObject, UnityGameObject, CachableGameObject, Transform, Component,
    Behaviour, Collider, Filter, HitDelegate, Renderer, Stage, Touch, GameObjectEvent, TouchEvent) {

    var cfg;

    var config = function(configuration) {
        cfg = configuration;
    };

    var onStageInit = function(callback) {
        var stage = new Stage({
            id : 'wozllajs_Stage',
            canvas : cfg.canvas,
            width : cfg.width,
            height : cfg.height,
            autoClear : cfg.autoClear
        });
        cfg.canvas.width = cfg.width;
        cfg.canvas.height = cfg.height;
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

        config : config,
        onStageInit : onStageInit,

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