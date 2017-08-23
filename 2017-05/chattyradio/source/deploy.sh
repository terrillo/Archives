cd ~/Containers/chattyradio/ && npm run build
cd ~/Containers/chattyradio/build && aws s3 cp . s3://chattyradio --recursive
cd ~/Containers/chattyradio/ 
