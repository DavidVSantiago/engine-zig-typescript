```mermaid
classDiagram
    direction RL

    class Engine {
        <<Singleton>>
        currentScene: SceneUnion
        loadingScene: SceneUnion
        changeScene()
        gameLoop()
    }

    class SceneUnion {
        <<Discriminated Union>>
        type: string
        scene: GameScene | LoadingScene
    }

    class SpriteUnion {
        <<Discriminated Union>>
        type: string
        sprite: SingleSprite | MultiSprite
    }

    class SimpleScene {
        <<Engine / Root>>
    }

    class SimpleSceneLayer {
        <<Container>>
        posX: int
        posY: int
    }

    class SingleSprite {
        <<Entity / Manual Control>>
        image: HTMLImageElement
        posX: int
        posY: int
        speedX: int
        speedY: int
        currentFrame: int
    }

    class MultiSprite {
        <<Entity / Animated>>
    }

    class Frame {
        <<Component / Molde>>
    }

    class Rectangle {
        <<POD>>
        x: int
        y: int
        w: int
        h: int
    }

    class CollisionBox {
        <<POD>>
        offsetX: int
        offsetY: int
        w: int
        h: int
    }

    Engine --> "1" SceneUnion : executa
    SimpleScene *-- "N" SimpleSceneLayer : array de (layerList)
    SimpleSceneLayer *-- "N" SpriteUnion : array de (spriteList)

    
    SingleSprite *-- "1" Frame : possui (frame)
    MultiSprite *-- "N" Frame : array de (frameList)
    
    Frame *-- "1" Rectangle : possui (cutRect)
    Frame *-- "N" CollisionBox : array de (collisionBoxList)
```