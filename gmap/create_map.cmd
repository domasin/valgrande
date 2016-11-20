@echo off
echo splitting...
java -Xmx2000m -jar %splitter% --output-dir=out ..\osm\valgrande.osm > out\splitter.log
echo creating map...
rem java -jar %mkgmap% -c optionsfile_gps.args out\63240001.osm.pbf
java -jar %mkgmap% -c optionsfile.args out\63240001.osm.pbf
echo complete
pause