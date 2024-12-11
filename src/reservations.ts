import { engine, InputAction, MainCamera, MeshCollider, MeshRenderer, pointerEventsSystem, Transform, VirtualCamera } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";


export function createReservationSystem(){
    const myCustomCamera = engine.addEntity()
	Transform.create(myCustomCamera, {
		position: Vector3.create(0, 500, 0),
        rotation:Quaternion.fromEulerDegrees(90,0,0)
	})
	VirtualCamera.create(myCustomCamera, {})

    let box = engine.addEntity()
    MeshRenderer.setBox(box)
    MeshCollider.setBox(box)
    Transform.create(box, {position:Vector3.create(6,1,6)})
    pointerEventsSystem.onPointerDown(
		{
			entity: box,
			opts: { button: InputAction.IA_POINTER, hoverText: 'Reset camera' },
		},
		() => {
            const mainCamera = MainCamera.createOrReplace(engine.CameraEntity, {
                virtualCameraEntity: myCustomCamera,
            })
		}
	)
}