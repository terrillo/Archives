kill -9 $(lsof -t -i:8089)
nohup python app.py &
