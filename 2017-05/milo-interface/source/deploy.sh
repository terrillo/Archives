aws s3 cp ./html s3://app.miloai.com/ --recursive --exclude ".git/*" --exclude "node_modules/*" --exclude "src/*"
