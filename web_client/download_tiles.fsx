(* ========================================================================== *)
(* F# Script to download tiles from tiles servers and wms services            *)
(*                                                                            *)
(* by Domenico Masini 2016-12-18                                              *)
(* http://github.com/domasin/valgrande                                        *)
(* ========================================================================== *)

open System.Net
open System.IO

let wc = new WebClient()

let saveTile (url:string) zoom (x,y) = 
    let path = sprintf "/tiles/%i/%i/%i.png" (zoom |> int) (x |> int) (y |> int)
    let fileName = __SOURCE_DIRECTORY__ + path
    let file = new FileInfo(fileName)
    let directoryName = file.DirectoryName
    if not (Directory.Exists(directoryName)) then
        Directory.CreateDirectory(directoryName) |> ignore
    printfn "%s" url
    wc.DownloadFile(url, fileName)

// Tile System vs Cartesian Plan

//     0     1     2     3
//        |     + 10  |
// 0      |     +     |
//   -----|-----+-----|-----
// 1      |     +     |
//   +++++++++++++++++++++++>
// 2 -10  |     +     |   10
//   -----|-----+-----|-----
// 3      |     +     |
//        |     +-10  |
//
// If we consider the cartesian plan (ideintified by the + signs) globally as a square, 
// lon starts negative (-10 on the left) and lat positive (10 on top) and the square has 
// a side of 20 units.
//
// If we want to divide it in 8 little squares or tiles (identified by the | and - signs; 
// plus the + signs shared with the cartesian axis in the figure), each tile as a side of 
// 5 (10 * 2 / 4) cartesian units. x and y of each tile starts from 0 and go through 3 
// from top left to right bottom.
//
// To convert the x of the cartesian plan into the x of the tile system, we consider
// that 0 of the tile system corresponds to -10 in the cartesian plan and we have to 
// consider a global horizontal line of 20 units of cartesian plan divided by 4 xs in 
// the tile system.
//
// So to calculate the x in the tile system with 8 tiles for the x 6 in the cartesian plan, 
// we add the 6 to 10, then we locate it in the global horizontal line divided by 4.
// (10 + 6) / ((10 * 2) / 4) and we take the integer part. Simplifying it 
// n * (axis + x) / (2. * axis) = 3.2 = 3 (where n is the number of xs in the tile system 
// (4) and axis is the length of the axis in the cartesian plan.
//
// Since the y, instead, starts positive we subtract from 10: (10 - 6) / ((10 * 2) / 4). 
// and simplifying we obtain the formula nY * (axis - y) / (2. * axis)

/// Starting from a zoom 0 of 1 tile with 1 x = 0 and 1 y = 0 
/// the subsequent zooms divide the space in 2^zoom x * 2^zoom y tiles.

//********************************
//*       Tiles Downloader       *
//********************************

let numCoord (zoom:int) = 2. ** (zoom |> float)

let tileX axis nX lon = nX * (axis + lon) / (2. * axis) |> int

let tileY axis nY lat = nY * (axis - lat) / (2. * axis) |> int

// osm http://tile.openstreetmap.org
let tileUrlAtZoom zoom url (x,y) = 
    sprintf "%s/%i/%i/%i.png" url zoom x y

let lonLatToTileAtZoom axis zoom url (lon,lat) = 
    let x = lon |> tileX axis (zoom |> numCoord)
    let y = lat |> tileY axis (zoom |> numCoord)
    (x,y) |> tileUrlAtZoom zoom url

let tilesBetween (minX,minY,maxX,maxY) = 
    [for x in [minX..maxX] -> 
        [for y in [maxY..minY] -> (x,y)]
    ] |> List.concat

let tilesInBbox axis zoom (minLon,minLat,maxLon,maxLat)  = 
    let minX = minLon |> tileX axis (zoom |> numCoord)
    let minY = minLat |> tileY axis (zoom |> numCoord)
    let maxX = maxLon |> tileX axis (zoom |> numCoord)
    let maxY = maxLat |> tileY axis (zoom |> numCoord)
    (minX,minY,maxX,maxY)
    |> tilesBetween

let tilesInBboxAtZoom axis zoom url bbox  = 
    bbox
    |> tilesInBbox axis zoom
    |> List.map (fun (x,y) -> (x,y), ((x,y) |> tileUrlAtZoom zoom url))

let tilesInBboxAtZooms axis zooms url (minLon,minLat,maxLon,maxLat) = 
    zooms 
    |> List.map (fun zoom -> (minLon,minLat,maxLon,maxLat) |> tilesInBboxAtZoom axis zoom url)
    |> List.concat

let downloadTiles axis zoom (url:string) bbox = 
    bbox
    |> tilesInBbox axis zoom
    |> List.iter (fun tileCoord -> tileCoord |> saveTile (tileCoord |> tileUrlAtZoom zoom url) zoom)

let downloadTilesAtZooms axis zooms url bbox = 
    zooms 
    |> List.iter (fun zoom -> bbox |> downloadTiles axis zoom url)

// tiles server ulrs to test
let osmTilesUlr = "http://tile.openstreetmap.org"
let _4uiMapUrl = "http://tileserver.4umaps.eu"
let axisEPSG41001 = 20037508.39 // simple mercator

// Valgrande national park bounding box in EPSG:41001
let minLon = 920927.
let minLat = 5772907.
let maxLon = 964787.
let maxLat = 5802441.

// Download from osm tiles
//(minLon,minLat,maxLon,maxLat) |> downloadTilesAtZooms axisEPSG41001 [0..14] osmTilesUlr
//(minLon,minLat,maxLon,maxLat) |> downloadTilesAtZooms axisEPSG41001 [7..14] _4uiMapUrl

//*********************************
//*         WMS Downloader        *
//*********************************

// To download tiles from WMS service we need to take the inverse road and 
// convert from the tile systema again to a cartesian plan

let tileXToLon axis nX x = 
    let minLon = (2. * axis * x) / nX - axis
    let maxLon = minLon + (axis / (nX / 2.))
    minLon, maxLon

let tileYToLat axis nY y = 
    let maxLat = axis - (2. * axis * y) / nY
    let minLat = maxLat - (axis / (nY / 2.))
    minLat,maxLat

let tileToBbox axis zoom x y = 
    let numXY = (zoom |> numCoord)
    let minX,maxX = tileXToLon axis numXY x
    let minY,maxY = tileYToLat axis numXY y
    (minX,minY,maxX,maxY)

let tilesFromWMS axis baseUrl zooms = 

    for z in zooms do
        let xys = (minLon,minLat,maxLon,maxLat) |> tilesInBbox axis z

        for (x,y) in xys do 
            let xMin,yMin,xMax,yMax  = tileToBbox axis z (x |> float) (y |> float)
            let bbox = sprintf "%f,%f,%f,%f" xMin yMin xMax yMax

            let url = baseUrl + bbox

            printfn "%i %i %i = %s" z x y bbox

            saveTile url z (x,y)

// My local qgis server url to test WMS download
let size = "256"
let baseUrl = "http://localhost:90/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=osm,limits,elevation,land_cover&SRS=EPSG%3A3857&FORMAT=image%2Fpng&HEIGHT="+size+"&WIDTH="+size+"&TRANSPARENT=True&BBOX="

// Download from local Qgis Server
//[7..18] |> tilesFromWMS axisEPSG41001 baseUrl
