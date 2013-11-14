define([
    './core/Time',
    './../wozllajs/core/Engine',
    './../wozllajs/core/AbstractGameObject',
    './../wozllajs/core/UnityGameObject',
    './../wozllajs/core/CachableGameObject',
    './../wozllajs/core/GameObject',
    './../wozllajs/core/Transform',
    './../wozllajs/core/Component',
    './../wozllajs/core/Behaviour',
    './../wozllajs/core/Animation',
    './../wozllajs/core/Layout',
    './../wozllajs/core/Collider',
    './../wozllajs/core/Filter',
    './../wozllajs/core/HitDelegate',
    './../wozllajs/core/Mask',
    './../wozllajs/core/Renderer',
    './../wozllajs/core/Stage',
    './../wozllajs/core/Touch',
    './../wozllajs/core/Query',
    './../wozllajs/core/events/GameObjectEvent',
    './../wozllajs/core/events/TouchEvent'
], function(Time, Engine, AbstractGameObject, UnityGameObject, CachableGameObject, GameObject, Transform, Component,
    Behaviour, Animation, Layout, Collider, Filter, HitDelegate, Mask, Renderer, Stage, Touch, Query, GameObjectEvent, TouchEvent) {

    var cfg;

    var config = function(configuration) {
        cfg = configuration;
    };

    var onStageInit = function(callback) {
        var stage = new Stage({
            id : 'wozllajs_Stage',
            canvas : cfg.canvas,
            width : cfg.width || cfg.canvas.width,
            height : cfg.height || cfg.canvas.height,
            autoClear : cfg.autoClear
        });
        cfg.canvas.width = cfg.width;
        cfg.canvas.height = cfg.height;
        stage.addEventListener(GameObjectEvent.INIT, function(e) {
            e.removeListener();
            setTimeout(function() {
                callback && callback(stage);
            }, 1);
        });
        Stage.root = stage;
        Touch.init(stage);
        stage.init();
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
        GameObject : GameObject,
        Transform : Transform,
        Component : Component,
        Behaviour : Behaviour,
        Animation : Animation,
        Layout : Layout,
        Filter : Filter,
        Collider : Collider,
        HitDelegate : HitDelegate,
        Mask : Mask,
        Renderer : Renderer,
        Stage : Stage,
        Touch : Touch,
        Query : Query,

        events : {
            TouchEvent : TouchEvent,
            GameObjectEvent : GameObjectEvent
        }
    };
});