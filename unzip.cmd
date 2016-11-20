@echo off
set folders=ctr,elevation,geology,land_cover,limits,osm

for %%i in (%folders%) do (
  CD /D %%i
  "c:\Program Files\7-Zip\7z.exe" e *.zip* -ry
  CD /D ..
)