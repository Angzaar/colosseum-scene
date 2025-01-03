import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from './helpers'
import { EDIT_MODIFIERS, builderHUDLabels, getEntityList, outputBuilderHUDJSON, selectAsset, selectedItem, toggleEditModifier, toggleModifier, transformObject } from '../index'
import { TransformPanel } from './TransformPanel'
import { dimensions } from '../../ui/helpers'

export let showBuilderHudPanel = true
export let enableHUD = false

export function enableBuilderHUD(value: boolean) {
    enableHUD = value
}

export function createBuilderHUDPanel(label:string) {
    return (
        <UiEntity
            key={"dcl::builder::hud::panel::" + label}
            uiTransform={{
                display: enableHUD ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * .15,
                height: dimensions.height * .5,
                positionType: 'absolute',
                position: { right: '10%', bottom:'2%' }
            }}
            // uiBackground={{color:Color4.Green()}}
        >

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateSquareImageDimensions(5).width,
        height:  calculateSquareImageDimensions(5).height,
        display: showBuilderHudPanel ? 'none' : 'flex',
        positionType: 'absolute',
        position:{right:0, bottom:0}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
        },
        uvs: getImageAtlasMapping({
            atlasHeight: 640,
            atlasWidth: 1000,
            sourceTop: 544,
            sourceLeft: 826,
            sourceWidth: 74,
            sourceHeight: 74
        })
    }}
    onMouseDown={()=>{
        showBuilderHudPanel = true
    }}
    />

<UiEntity
            uiTransform={{
                display: showBuilderHudPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * .12,
                height: dimensions.height * .5,
                positionType: 'absolute',
                position: { right: '2%', bottom:'2%' }
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            <UiEntity
            uiTransform={{
                display:"flex",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiBackground={{color:Color4.Black()}}
        >

        <Dropdown
        options={[...builderHUDLabels]}
        onChange={selectAsset}
        uiTransform={{
          width: '100%',
          height: '100%',
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
      />
      </UiEntity>

      <UiEntity
            uiTransform={{
                display:"flex",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
            }}
            uiBackground={{color:Color4.Black()}}
        >
            <TransformPanel/>
            </UiEntity>

      <UiEntity
            uiTransform={{
                display:"flex",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '60%',
            }}
            uiBackground={{color:Color4.Black()}}
        >

                     {/* top row */}
                     <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 94,
                            sourceLeft: 422,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    uiText={{value: "Output", fontSize:sizeFont(25,10)}}
                    onMouseDown={()=>{
                        outputBuilderHUDJSON()
                    }}
                    />




                </UiEntity>

                        {/* top row */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 544,
                            sourceLeft: 178,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        // sendServerEdit('y', 1)
                        transformObject('y', 1)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:"2%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 544,
                            sourceLeft: 422,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        // sendServerEdit('z', 1)
                        transformObject('z', 1)
                    }}
                    />

                    


        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 94,
                            sourceLeft: 422,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    uiText={{value: "" + (selectedItem && selectedItem.enabled ? selectedItem.factor : ""), fontSize:sizeFont(25,10)}}
                    onMouseDown={()=>{
                        toggleModifier()
                    }}
                    />




                </UiEntity>


     {/* middle row */}
           <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 544,
                            sourceLeft: 16,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        // sendServerEdit('x', -1)
                        transformObject('x',-1)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 94,
                            sourceLeft: 422,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        toggleEditModifier()
                    }}
                    uiText={{value: "" + (selectedItem && selectedItem.enabled ? getModifier() : ""), fontSize:sizeFont(25,10)}}
                    />




                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 544,
                            sourceLeft: 97,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        // sendServerEdit('x', 1)
                        transformObject('x',1)
                    }}
                    />




                </UiEntity> 


{/* bottom row */}
<UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 544,
                            sourceLeft: 259,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        // sendServerEdit('y', -1)
                        transformObject('y', -1)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 544,
                            sourceLeft: 340,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        // sendServerEdit('z', -1)
                        transformObject('z', -1)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'https://lsnft.mypinata.cloud/ipfs/QmYyDWc67svskJWxQrZNJxjwNsvsXyG9dvVzXvJtYtmgAr'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 640,
                            atlasWidth: 1000,
                            sourceTop: 544,
                            sourceLeft: 908,
                            sourceWidth: 74,
                            sourceHeight: 74
                        })
                    }}
                    onMouseDown={()=>{
                        showBuilderHudPanel = false
                    }}
                    />



                </UiEntity> 



            </UiEntity>

    </UiEntity>
      

        </UiEntity>
    )
}

function disableHUD(){

}

function getModifier(){
    switch(selectedItem.modifier){
        case EDIT_MODIFIERS.POSITION:
            return "P"

        case EDIT_MODIFIERS.ROTATION:
            return "R"

        case EDIT_MODIFIERS.SCALE:
            return "S"
    }
}