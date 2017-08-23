kill -9 $(lsof -t -i:88)
nohup python app.py &
