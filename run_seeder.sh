#!/bin/bash
# ls
STAGE='Dev'
echo - Iniciando el proceso de importación en $STAGE

docker exec node_app_6_app /bin/bash -c "node ./src/database/seeders/rol.seed.js"
docker exec node_app_6_app /bin/bash -c "node ./src/database/seeders/user.seed.js"
docker exec node_app_6_app /bin/bash -c "node ./src/database/seeders/categoria.seed.js"

echo - Proceso terminado
