# Run from git root
cd ../softeng18b-rest-api-client
./gradlew test --tests gr.ntua.ece.softeng18b.client.ObservatoryAPIFunctionalTest -Dusername=admin -Dpassword=1234! -Dprotocol=https -DIGNORE_SSL_ERRORS=true -Dhost=localhost -Dport=8765 -Dtest.json=test-data.json
