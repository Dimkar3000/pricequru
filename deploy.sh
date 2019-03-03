cd Server
npm i
cd ../Client
npm i
npm run build
rm -rf ../Server/public
cp -r dist ../Server/public