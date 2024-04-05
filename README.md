# Polaris Parsher
polaris parsher for pdam tirta raharja, using Mariadb version 15.1, nodejs v16.3.0
## Install PM2
Install pm2 ```bash
  apt update
  apt install pm2 ```
    
## Deployment
To deploy this project run ```bash
  pm2 start npm --name "api-v3" -- start
  pm2 start "npm run parser" --name "parser-v3" ```
