define(function(require) {

    return window.wozllajs = {
        assets : {
            AsyncImage : require('./assets/AsyncImage'),
            Texture : require('./assets/Texture'),
            loader : require('./assets/loader'),
			objLoader : require('./assets/objLoader')
        },
        core : {
            events : {
                GameObjectEvent : require('./core/events/GameObjectEvent'),
                TouchEvent : require('./core/events/TouchEvent')
            },
            AbstractGameObject: require('./core/AbstractGameObject'),
            Animation: require('./core/Animation'),
			Behaviour: require('./core/Behaviour'),
            CachableGameObject: require('./core/CachableGameObject'),
            Collider: require('./core/Collider'),
            Component: require('./core/Component'),
            Engine: require('./core/Engine'),
            Filter: require('./core/Filter'),
            GameObject: require('./core/GameObject'),
            HitDelegate: require('./core/HitDelegate'),
            Layout: require('./core/Layout'),
            Mask: require('./core/Mask'),
            Renderer: require('./core/Renderer'),
            Stage: require('./core/Stage'),
            Time: require('./core/Time'),
            Touch: require('./core/Touch'),
            Transform: require('./core/Transform'),
            UnityGameObject: require('./core/UnityGameObject'),
        },
        events : {
            Event : require('./events/Event'),
            EventTarget : require('./events/EventTarget')
        },
        math : {
            Matrix2D: require('./math/Matrix2D'),
            Rectangle : require('./math/Rectangle')
        },
        utils : {
            Ajax : require('./utils/Ajax'),
            Arrays : require('./utils/Arrays'),
            createCanvas : require('./utils/createCanvas'),
            Objects : require('./utils/Objects'),
            Promise : require('./utils/Promise'),
            Strings : require('./utils/Strings'),
            Tuple : require('./utils/Tuple'),
            uniqueKey: require('./utils/uniqueKey')
        }
    };

});