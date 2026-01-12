set -x

rm -rf dist/*
rm -f *.tar
rm -f *.gz
rm -f *.tgz
rm -f *.xpkg
find src -name \*.pb.js -exec rm {} \;
find src -name \*.pb.ts -exec rm {} \;

