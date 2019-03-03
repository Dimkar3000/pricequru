cd Server
npm install
cd ../Client
npm install
npm run build
rm -rf ../Server/public
cp -r dist ../Server/public